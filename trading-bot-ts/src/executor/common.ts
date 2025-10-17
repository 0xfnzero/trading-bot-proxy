import { redisService } from '../services';
import { log } from '../logger';
import { AddressLookupTableService } from '../services/addressLookupTableService';
import { Config } from '../config';
import { GasFeeStrategy, GlobalStrategy, HighLowStrategy } from '../types';

/**
 * 创建订单
 * @param mint 代币mint地址
 * @param price 价格
 */
export async function createOrder(mint: string, price: number, platform: string): Promise<void> {
  try {
    
    // 创建订单数据
    const orderData = {
      mint: mint,
      token_amount: 0,
      price: price,
      platform: platform
    };
    
    // 创建订单
    await redisService.createOrder(orderData);
    
  } catch (error) {
    log('error', '❌ 创建订单失败:', error);
    // 不抛出错误，避免影响主流程
  }
}

/**
 * 获取最近的区块哈希
 * 从Redis缓存中获取，如果Redis中没有则返回null
 * @returns 返回最近的区块哈希
 */
export async function getRecentBlockhash(): Promise<string | null> {
  try {
    // 从Redis获取缓存的区块哈希
    const blockhash = await redisService.getRecentBlockhash();
    
    if (!blockhash) {
      log('warn', '⚠️ Redis中未找到区块哈希，请确保区块哈希定时任务正在运行');
      return null;
    }
    
    return blockhash;
    
  } catch (error) {
    log('error', '❌ 从Redis获取区块哈希失败:', error);
    return null;
  }
}

/**
 * 获取地址查找表账户数据
 * 如果环境变量 LOOKUP_TABLE_ACCOUNTS 为空，返回 undefined
 * 如果有值，使用第一个值获取地址查找表账户
 * @returns 地址查找表账户数据或 undefined
 */
export function getAddressLookupTableAccount(): { key: string; addresses: string[] } | undefined {
  try {
    const lookupTableAddresses = Config.getLookupTableAddresses();
    
    // 如果环境变量为空，返回 undefined
    if (lookupTableAddresses.length === 0) {
      return undefined;
    }
    
    // 使用第一个地址获取地址查找表账户
    const firstAddress = lookupTableAddresses[0];
    if (!firstAddress) {
      return undefined;
    }
    const addressLookupTableService = AddressLookupTableService.getInstance();
    const account = addressLookupTableService.getAddressLookupTableAccount(firstAddress);
    
    return account;
    
  } catch (error) {
    log('error', '❌ 获取地址查找表账户失败:', error);
    return undefined;
  }
}

/**
 * 获取Gas Fee策略配置
 * 根据配置决定使用全局策略还是高低小费策略
 * @returns Gas Fee策略对象
 */
export function getGasFeeStrategy(): GasFeeStrategy {
  // 如果启用了高低小费策略
  if (Config.ENABLE_HIGH_LOW_FEE) {
    const highLowStrategy: HighLowStrategy = {
      strategy_type: 'high_low',
      cu_limit: Config.GLOBAL_CU_LIMIT,
      high_cu_price: Config.HIGH_CU_PRICE,
      low_buy_tip: Config.LOW_BUY_TIP,
      low_sell_tip: Config.LOW_SELL_TIP,
      low_cu_price: Config.LOW_CU_PRICE,
      high_buy_tip: Config.HIGH_BUY_TIP,
      high_sell_tip: Config.HIGH_SELL_TIP
    };
    
    log('debug', '🔧 使用高低小费策略:', highLowStrategy);
    return highLowStrategy;
  } else {
    // 使用全局策略
    const globalStrategy: GlobalStrategy = {
      strategy_type: 'global',
      global_cu_limit: Config.GLOBAL_CU_LIMIT,
      global_cu_price: Config.GLOBAL_CU_PRICE,
      global_buy_tip: Config.GLOBAL_BUY_TIP,
      global_sell_tip: Config.GLOBAL_SELL_TIP
    };
    
    log('debug', '🔧 使用全局策略:', globalStrategy);
    return globalStrategy;
  }
}
