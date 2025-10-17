import { PumpFunTradeEvent } from '../parser/parser_messages';
import { PumpFunParams, ExecutorConfig } from '../types';
import { OrderStatus } from '../types/order';
import { TradingProxyClient } from '../client';
import { createOrder, getRecentBlockhash, getAddressLookupTableAccount, getGasFeeStrategy } from './common';
import { redisService } from '../services';
import { log } from '../logger';
import { Config } from '../config';
import { getCachedNonceInfo, refreshNonceInfo } from '../services';

/**
 * PumpFun交易执行器类
 */
export class PumpFunExecutor {
  private client: TradingProxyClient;
  private config: ExecutorConfig;

  // 价格计算相关常量
  private static readonly LAMPORTS_PER_SOL = 1_000_000_000; // Solana lamports的10^9单位
  private static readonly SCALE = 1_000_000; // Token精度的10^6单位

  constructor(client: TradingProxyClient, config?: ExecutorConfig) {
    this.client = client;
    this.config = config || {};
  }

  /**
   * 计算Token价格（以SOL为单位）
   * @param virtualSolReserves 虚拟SOL储备量
   * @param virtualTokenReserves 虚拟Token储备量
   * @returns Token价格（SOL）
   */
  public calcPrice(virtualSolReserves: number, virtualTokenReserves: number): number {
    const vSol = virtualSolReserves / PumpFunExecutor.LAMPORTS_PER_SOL;
    const vTokens = virtualTokenReserves / PumpFunExecutor.SCALE;
    
    if (vTokens === 0) {
      return 0;
    }
    
    return vSol / vTokens;
  }

  /**
   * 执行交易 - 处理PumpFun交易事件数据
   * @param eventData 原始事件数据
   * @returns 处理后的数据
   */
  public async execute(eventData: PumpFunTradeEvent) {
    
    log('debug', '🎯 PumpFunTrade: ', eventData);
    
    // 更新PumpfunTradeInfo数据
    await redisService.updatePumpfunTradeInfo(eventData.mint, eventData);

    // 更新订单的代币数量和价格
    if (eventData.user == Config.BOT_ADDRESS) {
      const price = this.calcPrice(eventData.virtual_sol_reserves, eventData.virtual_token_reserves);
      await redisService.updateOrderTokenAmountAndPrice(eventData.mint, eventData.token_amount, price, eventData.is_buy);
    }
    
    // 根据交易类型决定买入
    if (eventData.is_buy) {
      await this.buy(eventData);
    }
  }

  /**
   * 买入方法
   * @param eventData 处理后的交易数据
   */
  public async buy(eventData: any) {
    let lockValue: string | undefined;
    
    try {
      // 使用分布式锁确保买入操作的原子性
      const buyIntervalSeconds = this.config.buyIntervalSeconds ?? 60;
      const lockResult = await redisService.tryBuyWithLock(buyIntervalSeconds);
      
      if (!lockResult.success) {
        log('debug', '🔒 无法获取买入锁或未达到买入间隔，跳过本次买入');
        return;
      }

      lockValue = lockResult.lockValue;

      // 构建买入参数（包含DEX参数和交易参数）
      const buyParams = await this.buildBuyParams(eventData);

      // 创建订单
      let price = 0; // 当订阅到bot买入的交易后会去更新价格
      await createOrder(eventData.mint, price, 'pumpfun');
      await redisService.savePumpfunTradeInfo(eventData.mint, eventData);
      
      // 调用买入接口
      const result = await this.client.buy(buyParams.dexParams, buyParams.tradeParams);
      
      // 在检查结果之前刷新 nonce
      if (Config.USE_NONCE) {
        refreshNonceInfo();
      }
      
      if (result.success && result.signature) {
        log('info', '✅ 买入成功! 交易签名:', result.signature);
        await redisService.updateOrderStatus(eventData.mint, OrderStatus.Bought);
      } else {
        log('error', '❌ 买入失败:', result.message);
        await redisService.deleteOrder(eventData.mint);
        await redisService.deletePumpfunTradeInfo(eventData.mint);
      }
    } catch (error) {
      log('error', '❌ 买入操作失败:', error);
      throw error;
    } finally {
      // 只有成功获取锁的情况下才需要释放锁
      if (lockValue) {
        await redisService.releaseBuyLock(lockValue);
      }
    }
  }

  /**
   * 卖出方法
   * @param mintAddress
   */
  public async sell(mintAddress: string) {
    try {
      // 卖出条件检查
      const order = await redisService.getOrder(mintAddress);
      if (!order) {
        return;
      }
      if (order.status !== OrderStatus.Bought) {
        return;
      }
      if (order.token_amount === 0) {
        return;
      }

      log('info', '🔒 卖出订单:', order);

      // 更新订单状态
      await redisService.updateOrderStatus(mintAddress, OrderStatus.Selling);

      // 获取PumpfunTradeInfo数据
      const eventData = await redisService.getPumpfunTradeInfo(mintAddress);
      
      // 检查eventData是否存在
      if (!eventData) {
        return;
      }
      
      // 构建卖出参数（包含DEX参数和交易参数）
      const sellParams = await this.buildSellParams(eventData, order.token_amount);
      
      // 调用卖出接口
      const result = await this.client.sell(sellParams.dexParams, sellParams.tradeParams);
      
      // 在检查结果之前刷新 nonce
      if (Config.USE_NONCE) {
        refreshNonceInfo();
      }
      
      if (result.success && result.signature) {
        await redisService.updateOrderStatus(mintAddress, OrderStatus.Sold);
        log('info', '✅ 卖出成功! 交易签名:', result.signature);
      } else {
        await redisService.updateOrderStatus(mintAddress, OrderStatus.Bought);
        log('error', '❌ 卖出失败:', result.message);
      }
    } catch (error) {
      log('error', '❌ 卖出操作失败:', error);
      await redisService.updateOrderStatus(mintAddress, OrderStatus.Bought);
      throw error;
    }
  }

  /**
   * 构建买入参数（包含DEX参数和交易参数）
   * @param eventData 处理后的交易数据
   * @returns 完整的买入参数对象
   */
  public async buildBuyParams(eventData: any) {
    // 构建DEX参数
    const dexParams: PumpFunParams = {
      dex_type: 'PumpFun',
      bonding_curve_account: eventData.bonding_curve,
      virtual_token_reserves: eventData.virtual_token_reserves,
      virtual_sol_reserves: eventData.virtual_sol_reserves,
      real_token_reserves: eventData.real_token_reserves,
      real_sol_reserves: eventData.real_sol_reserves,
      token_total_supply: 1_000_000_000_000_000,
      complete: false,
      creator: eventData.creator,
      associated_bonding_curve: eventData.associated_bonding_curve,
      creator_vault: eventData.creator_vault,
      close_token_account_when_sell: false // 买入设置false即可
    };
    
    // 获取地址查找表账户数据
    const addressLookupTableAccount = getAddressLookupTableAccount();
    
    // 构建交易参数
    const tradeParams: any = {
      mint: eventData.mint,
      amount_sol: this.config.buyAmountSOL ?? 0.01, // 默认0.01 SOL
      slippage_bps: this.config.slippageBps ?? 100,  // 默认100 bps (1%)
      token_type: 'SOL',
      gas_fee_strategy: getGasFeeStrategy(),
    };

    if (Config.USE_NONCE) {
      tradeParams.durable_nonce = getCachedNonceInfo();
    } else {
      const recentBlockhash = await getRecentBlockhash();
      tradeParams.recent_blockhash = recentBlockhash || '';
    }
    
    // 只有当地址查找表账户存在时才添加该属性
    if (addressLookupTableAccount) {
      tradeParams.address_lookup_table_account = addressLookupTableAccount;
    }
    
    const buyParams = {
      dexParams,
      tradeParams
    };
    
    return buyParams;
  }

  /**
   * 构建卖出参数（包含DEX参数和交易参数）
   * @param eventData 处理后的交易数据
   * @param token_amount 卖出的Token数量
   * @returns 完整的卖出参数对象
   */
  public async buildSellParams(eventData: any, token_amount: number) {
    // 构建DEX参数
    const dexParams: PumpFunParams = {
      dex_type: 'PumpFun',
      bonding_curve_account: eventData.bonding_curve,
      virtual_token_reserves: eventData.virtual_token_reserves,
      virtual_sol_reserves: eventData.virtual_sol_reserves,
      real_token_reserves: eventData.real_token_reserves,
      real_sol_reserves: eventData.real_sol_reserves,
      token_total_supply: 1_000_000_000_000_000,
      complete: false,
      creator: eventData.creator,
      associated_bonding_curve: eventData.associated_bonding_curve,
      creator_vault: eventData.creator_vault,
      close_token_account_when_sell: true // 卖出时关闭token账户, 如果是全部卖出, 则设置为true，部分卖出时只有在最后一次卖出才设置true
    };
    
    // 获取地址查找表账户数据
    const addressLookupTableAccount = getAddressLookupTableAccount();
    
    // 构建交易参数
    const tradeParams: any = {
      mint: eventData.mint,
      amount_tokens: token_amount,
      slippage_bps: this.config.slippageBps ?? 100,
      token_type: 'SOL',
      gas_fee_strategy: getGasFeeStrategy(),
      close_output_token_ata: true, // 如果是全部卖出就设置true，部分卖出时只有在最后一次卖出才设置true
    };

    if (Config.USE_NONCE) {
      tradeParams.durable_nonce = getCachedNonceInfo();
    } else {
      const recentBlockhash = await getRecentBlockhash();
      tradeParams.recent_blockhash = recentBlockhash || '';
    }
    
    // 只有当地址查找表账户存在时才添加该属性
    if (addressLookupTableAccount) {
      tradeParams.address_lookup_table_account = addressLookupTableAccount;
    }
    
    const sellParams = {
      dexParams,
      tradeParams
    };
    
    return sellParams;
  }

}
