import { MeteoraDammV2SwapEvent } from '../parser/parser_messages';
import { MeteoraDammV2Params, ExecutorConfig } from '../types';
import { OrderStatus } from '../types/order';
import { TradingProxyClient } from '../client';
import { createOrder, getRecentBlockhash, getAddressLookupTableAccount, getGasFeeStrategy } from './common';
import { redisService } from '../services';
import { log } from '../logger';
import { Config } from '../config';
import { getCachedNonceInfo, refreshNonceInfo } from '../services';

const WSOL_MINT = 'So11111111111111111111111111111111111111112';

/**
 * Meteora DAMM V2 交易执行器类
 */
export class MeteoraDammV2Executor {
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
   * 构建Meteora DAMM V2 DEX参数
   * @param eventData Meteora DAMM V2事件数据
   * @returns Meteora DAMM V2 DEX参数对象
   */
  private buildDexParams(eventData: MeteoraDammV2SwapEvent): MeteoraDammV2Params {
    return {
      dex_type: 'MeteoraDammV2',
      pool: eventData.pool,
      token_a_vault: eventData.token_a_vault,
      token_b_vault: eventData.token_b_vault,
      token_a_mint: eventData.token_a_mint,
      token_b_mint: eventData.token_b_mint,
      token_a_program: eventData.token_a_program,
      token_b_program: eventData.token_b_program,
    };
  }

  /**
   * 执行交易 - 处理Meteora DAMM V2交易事件数据
   * @param eventData Meteora DAMM V2事件数据
   * @returns 处理后的数据
   */
  public async execute(eventData: MeteoraDammV2SwapEvent) {

    // 如果token_a_mint和token_b_mint都不是WSOL，则跳过
    if(eventData.token_a_mint !== WSOL_MINT && eventData.token_b_mint !== WSOL_MINT) {
      return;
    };

    let is_buy = false;
    let sol_amount = 0;
    let token_amount = 0;
    let mint = '';
    
    // trade_direction: 0 表示 A -> B, 1 表示 B -> A
    // 根据trade_direction和WSOL的位置判断买入卖出
    if (eventData.trade_direction === 0) {
      // A -> B
      if (eventData.token_a_mint === WSOL_MINT) {
        // 用SOL换Token（买入）
        is_buy = true;
        sol_amount = eventData.actual_amount_in; // SOL输入数量
        token_amount = eventData.output_amount; // Token输出数量
        mint = eventData.token_b_mint; // 代币mint地址
      } else {
        // 用Token换SOL（卖出）
        is_buy = false;
        sol_amount = eventData.output_amount; // SOL输出数量
        token_amount = eventData.actual_amount_in; // Token输入数量
        mint = eventData.token_a_mint; // 代币mint地址
      }
    } else {
      // B -> A
      if (eventData.token_b_mint === WSOL_MINT) {
        // 用SOL换Token（买入）
        is_buy = true;
        sol_amount = eventData.actual_amount_in; // SOL输入数量
        token_amount = eventData.output_amount; // Token输出数量
        mint = eventData.token_a_mint; // 代币mint地址
      } else {
        // 用Token换SOL（卖出）
        is_buy = false;
        sol_amount = eventData.output_amount; // SOL输出数量
        token_amount = eventData.actual_amount_in; // Token输入数量
        mint = eventData.token_b_mint; // 代币mint地址
      }
    }
    
    // 记录交易信息（用于调试）
    log('debug', `🔄 Meteora DAMM V2交易: ${is_buy ? '买入' : '卖出'}, SOL数量: ${sol_amount}, Token数量: ${token_amount}, Mint: ${mint}`);
    
    // 更新MeteoraDammV2TradeInfo数据
    await redisService.updateMeteoraDammV2TradeInfo(mint, eventData);

    // 更新订单的代币数量和价格
    // 注意：这里需要知道user地址，但MeteoraDammV2SwapEvent没有user字段
    // 如果需要判断是否是bot交易，需要从交易的其他信息中获取
    // 暂时注释掉这部分逻辑，或者需要额外的处理 ---------- 在定时任务中会获取order mint的余额
    // if (eventData.user == Config.BOT_ADDRESS) {
    //   const price = this.calcPrice(sol_amount, token_amount);
    //   await redisService.updateOrderTokenAmountAndPrice(mint, token_amount, price, is_buy);
    // }
    
    // 根据交易类型决定买入
    if (is_buy) {
      await this.buy(eventData, mint);
    }
  }

  /**
   * 买入方法
   * @param eventData Meteora DAMM V2事件数据
   */
  public async buy(eventData: MeteoraDammV2SwapEvent, mint: string) {
    let lockValue: string | undefined;
    
    try {
      // 使用分布式锁确保买入操作的原子性
      const buyIntervalSeconds = this.config.buyIntervalSeconds ?? 60;
      const lockResult = await redisService.tryBuyWithLock(buyIntervalSeconds);
      
      if (!lockResult.success) {
        log('debug', '🔒 无法获取买入锁或未达到买入间隔，跳过本次Meteora DAMM V2买入');
        return;
      }

      lockValue = lockResult.lockValue;

      // 构建买入参数（包含DEX参数和交易参数）
      const buyParams = await this.buildBuyParams(eventData, mint);
      
      // 创建订单
      let price = 0; // 当订阅到bot买入的交易后会去更新价格
      await createOrder(mint, price, 'meteora_damm_v2');
      await redisService.saveMeteoraDammV2TradeInfo(mint, eventData);
      
      // 调用买入接口
      const result = await this.client.buy(buyParams.dexParams, buyParams.tradeParams);
      
      // 在检查结果之前刷新 nonce
      if (Config.USE_NONCE) {
        refreshNonceInfo();
      }
      
      if (result.success && result.signature) {
        log('info', '✅ Meteora DAMM V2买入成功! 交易签名:', result.signature);
        await redisService.updateOrderStatus(mint, OrderStatus.Bought);
      } else {
        log('error', '❌ Meteora DAMM V2买入失败:', result.message);
        await redisService.deleteOrder(mint);
        await redisService.deleteMeteoraDammV2TradeInfo(mint);
      }
    } catch (error) {
      log('error', '❌ Meteora DAMM V2买入操作失败:', error);
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

      // 获取MeteoraDammV2TradeInfo数据
      const eventData = await redisService.getMeteoraDammV2TradeInfo(mintAddress);
      
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
        log('info', '✅ Meteora DAMM V2卖出成功! 交易签名:', result.signature);
      } else {
        await redisService.updateOrderStatus(mintAddress, OrderStatus.Bought);
        log('error', '❌ Meteora DAMM V2卖出失败:', result.message);
      }
    } catch (error) {
      log('error', '❌ Meteora DAMM V2卖出操作失败:', error);
      await redisService.updateOrderStatus(mintAddress, OrderStatus.Bought);
      throw error;
    }
  }

  /**
   * 构建买入参数（包含DEX参数和交易参数）
   * @param eventData Meteora DAMM V2事件数据
   * @returns 完整的买入参数对象
   */
  public async buildBuyParams(eventData: MeteoraDammV2SwapEvent, mint: string) {
    
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
   * @param eventData Meteora DAMM V2事件数据
   * @param token_amount 卖出的Token数量
   * @returns 完整的卖出参数对象
   */
  public async buildSellParams(eventData: MeteoraDammV2SwapEvent, token_amount: number, mint: string) {
    
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

