import { PumpSwapBuyEvent, PumpSwapSellEvent } from '../parser/parser_messages';
import { PumpSwapParams, ExecutorConfig } from '../types';
import { OrderStatus } from '../types/order';
import { TradingProxyClient } from '../client';
import { createOrder, getRecentBlockhash, getAddressLookupTableAccount, getGasFeeStrategy } from './common';
import { redisService } from '../services';
import { log } from '../logger';
import { Config } from '../config';
import { getCachedNonceInfo, refreshNonceInfo } from '../services';

const WSOL_MINT = 'So11111111111111111111111111111111111111112';

/**
 * PumpSwap交易执行器类
 */
export class PumpSwapExecutor {
  private client: TradingProxyClient;
  private config: ExecutorConfig;

  constructor(client: TradingProxyClient, config?: ExecutorConfig) {
    this.client = client;
    this.config = config || {};
  }

  /**
   * 计算Token价格（以SOL为单位）
   * @param sol_amount SOL数量
   * @param token_amount Token数量
   * @returns Token价格（SOL）
   */
  public calcPrice(sol_amount: number, token_amount: number): number {
    if (token_amount > 0) {
      return sol_amount / token_amount;
    } else {
      return 0;
    }
  }

  /**
   * 构建PumpSwap DEX参数
   * @param eventData PumpSwap事件数据
   * @returns PumpSwap DEX参数对象
   */
  private buildDexParams(eventData: PumpSwapBuyEvent | PumpSwapSellEvent): PumpSwapParams {
    return {
      dex_type: 'PumpSwap',
      pool: eventData.pool,
      base_mint: eventData.base_mint,
      quote_mint: eventData.quote_mint,
      pool_base_token_account: eventData.pool_base_token_account,
      pool_quote_token_account: eventData.pool_quote_token_account,
      pool_base_token_reserves: eventData.pool_base_token_reserves,
      pool_quote_token_reserves: eventData.pool_quote_token_reserves,
      coin_creator_vault_ata: eventData.coin_creator_vault_ata,
      coin_creator_vault_authority: eventData.coin_creator_vault_authority,
    };
  }

  /**
   * 执行交易 - 处理PumpSwap交易事件数据
   * @param eventData PumpSwap事件数据
   * @returns 处理后的数据
   */
  public async execute(eventData: PumpSwapBuyEvent | PumpSwapSellEvent, eventType: string) {

    // 如果base_mint和quote_mint都不是WSOL，则跳过
    if(eventData.base_mint !== WSOL_MINT && eventData.quote_mint !== WSOL_MINT) {
      return;
    };

    let is_buy = false;
    let sol_amount = 0;
    let token_amount = 0;
    let mint = '';
    
    // 先判断事件类型
    if (eventType === 'PumpSwapBuyEvent') {
      const buyEvent = eventData as PumpSwapBuyEvent;
      // 根据WSOL_MINT的位置判断买入卖出
      if (buyEvent.base_mint == WSOL_MINT) {
        // base_mint是WSOL，说明用SOL买入代币（买入）
        is_buy = true;
        sol_amount = buyEvent.base_amount_out; // SOL输入数量
        token_amount = buyEvent.user_quote_amount_in; // 代币输出数量
        mint = buyEvent.quote_mint; // 代币mint地址
      } else {
        // quote_mint是WSOL，说明用代币换SOL（卖出）
        is_buy = false;
        sol_amount = buyEvent.user_quote_amount_in; // SOL输出数量
        token_amount = buyEvent.base_amount_out; // 代币输入数量
        mint = buyEvent.base_mint; // 代币mint地址
      }
    } else {
      const sellEvent = eventData as PumpSwapSellEvent;
      // 根据WSOL_MINT的位置判断买入卖出
      if (sellEvent.base_mint == WSOL_MINT) {
        // base_mint是WSOL，说明用SOL买入代币（买入）
        is_buy = true;
        sol_amount = sellEvent.base_amount_in; // SOL输出数量
        token_amount = sellEvent.user_quote_amount_out; // 代币输入数量
        mint = sellEvent.quote_mint; // 代币mint地址
      } else {
        // quote_mint是WSOL，说明用代币换SOL（卖出）
        is_buy = false;
        sol_amount = sellEvent.user_quote_amount_out; // SOL输入数量
        token_amount = sellEvent.base_amount_in; // 代币输出数量
        mint = sellEvent.base_mint; // 代币mint地址
      }
    }
    
    // 更新PumpSwapTradeInfo数据
    await redisService.updatePumpSwapTradeInfo(mint, eventData);

    // 更新订单的代币数量和价格
    if (eventData.user == Config.BOT_ADDRESS) {
      // console.log('bot交易信息=> ', is_buy, sol_amount, token_amount, mint);
      const price = this.calcPrice(sol_amount, token_amount);
      await redisService.updateOrderTokenAmountAndPrice(mint, token_amount, price, is_buy);
    }
    
    // 根据交易类型决定买入
    if (is_buy) {
      await this.buy(eventData, mint);
    }
  }

  /**
   * 买入方法
   * @param eventData PumpSwap事件数据
   */
  public async buy(eventData: PumpSwapBuyEvent | PumpSwapSellEvent, mint: string) {
    let lockValue: string | undefined;
    
    try {
      // 使用分布式锁确保买入操作的原子性
      const buyIntervalSeconds = this.config.buyIntervalSeconds ?? 60;
      const lockResult = await redisService.tryBuyWithLock(buyIntervalSeconds);
      
      if (!lockResult.success) {
        log('debug', '🔒 无法获取买入锁或未达到买入间隔，跳过本次PumpSwap买入');
        return;
      }

      lockValue = lockResult.lockValue;

      // 构建买入参数（包含DEX参数和交易参数）
      const buyParams = await this.buildBuyParams(eventData, mint);
      
      // 创建订单
      let price = 0; // 当订阅到bot买入的交易后会去更新价格
      await createOrder(mint, price, 'pumpswap');
      await redisService.savePumpSwapTradeInfo(mint, eventData);
      
      // 调用买入接口
      const result = await this.client.buy(buyParams.dexParams, buyParams.tradeParams);
      
      // 在检查结果之前刷新 nonce
      if (Config.USE_NONCE) {
        refreshNonceInfo();
      }
      
      if (result.success && result.signature) {
        log('info', '✅ PumpSwap买入成功! 交易签名:', result.signature);
        await redisService.updateOrderStatus(mint, OrderStatus.Bought);
      } else {
        log('error', '❌ PumpSwap买入失败:', result.message);
        await redisService.deleteOrder(mint);
        await redisService.deletePumpSwapTradeInfo(mint);
      }
    } catch (error) {
      log('error', '❌ PumpSwap买入操作失败:', error);
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

      // 更新订单状态
      await redisService.updateOrderStatus(mintAddress, OrderStatus.Selling);

      // 获取PumpSwapTradeInfo数据
      const eventData = await redisService.getPumpSwapTradeInfo(mintAddress);
      
      // 检查eventData是否存在
      if (!eventData) {
        return;
      }
      
      // 构建卖出参数（包含DEX参数和交易参数）
      const sellParams = await this.buildSellParams(eventData, order.token_amount, mintAddress);
      
      // 调用卖出接口
      const result = await this.client.sell(sellParams.dexParams, sellParams.tradeParams);
      
      // 在检查结果之前刷新 nonce
      if (Config.USE_NONCE) {
        refreshNonceInfo();
      }
      
      if (result.success && result.signature) {
        await redisService.updateOrderStatus(mintAddress, OrderStatus.Sold);
        log('info', '✅ PumpSwap卖出成功! 交易签名:', result.signature);
      } else {
        await redisService.updateOrderStatus(mintAddress, OrderStatus.Bought);
        log('error', '❌ PumpSwap卖出失败:', result.message);
      }
    } catch (error) {
      log('error', '❌ PumpSwap卖出操作失败:', error);
      await redisService.updateOrderStatus(mintAddress, OrderStatus.Bought);
      throw error;
    }
  }

  /**
   * 构建买入参数（包含DEX参数和交易参数）
   * @param eventData PumpSwap事件数据
   * @returns 完整的买入参数对象
   */
  public async buildBuyParams(eventData: PumpSwapBuyEvent | PumpSwapSellEvent, mint: string) {
    
    // 构建DEX参数
    const dexParams = this.buildDexParams(eventData);
    
    // 获取地址查找表账户数据
    const addressLookupTableAccount = getAddressLookupTableAccount();
    
    // 构建交易参数
    const tradeParams: any = {
      mint: mint,
      amount_sol: this.config.buyAmountSOL ?? 0.01, // 默认0.01 SOL
      slippage_bps: this.config.slippageBps ?? 100,  // 默认100 bps (1%)
      token_type: 'WSOL',
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
   * @param eventData PumpSwap事件数据
   * @param token_amount 卖出的Token数量
   * @returns 完整的卖出参数对象
   */
  public async buildSellParams(eventData: PumpSwapBuyEvent | PumpSwapSellEvent, token_amount: number, mint: string) {
    
    // 构建DEX参数
    const dexParams = this.buildDexParams(eventData);
    
    // 获取地址查找表账户数据
    const addressLookupTableAccount = getAddressLookupTableAccount();
    
    // 构建交易参数
    const tradeParams: any = {
      mint: mint,
      amount_tokens: token_amount,
      slippage_bps: this.config.slippageBps ?? 100,
      token_type: 'WSOL',
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
