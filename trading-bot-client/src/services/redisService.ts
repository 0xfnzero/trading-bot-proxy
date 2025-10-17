import { createClient } from 'redis';
import { Order, OrderStatus } from '../types/order';
import { log } from '../logger';
import { Config } from '../config';

/**
 * Redis服务类
 * 负责订单的创建、存储和管理
 */
export class RedisService {
  private redisClient: any;
  private static instance: RedisService | null = null;
  
  // Redis默认TTL：24小时（秒）
  private static readonly DEFAULT_TTL_SECONDS = 24 * 60 * 60;

  private constructor() {}

  /**
   * 获取RedisService单例实例
   */
  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  /**
   * 初始化Redis连接
   */
  public async initialize(): Promise<void> {
    if (!this.redisClient) {
      await this.initRedis();
    }
  }

  /**
   * 初始化Redis连接
   */
  private async initRedis() {
    try {
      log('info', 'redis url: ' + Config.REDIS_URL);
      
      // 检查是否是Unix socket连接
      if (Config.REDIS_URL.startsWith('unix://')) {
        // 解析Unix socket URL
        const url = new URL(Config.REDIS_URL);
        const socketPath = url.pathname;
        const db = url.searchParams.get('db') || '0';
        
        this.redisClient = createClient({
          socket: {
            path: socketPath,
            tls: false
          },
          database: parseInt(db)
        });
      } else {
        // 普通TCP连接
        this.redisClient = createClient({
          url: Config.REDIS_URL
        });
      }

      this.redisClient.on('error', (err: any) => {
        // Redis连接错误时立即退出程序
        log('error', `Redis连接错误: ${err.message}`);
        process.exit(1);
      });

      await this.redisClient.connect();
      log('info', '✅ Redis连接成功');
    } catch (error) {
      // 只记录简洁的错误信息并立即退出程序
      const errorMessage = error instanceof Error ? error.message : String(error);
      log('error', `Redis连接失败: ${errorMessage}`);
      process.exit(1);
    }
  }


  /**
   * 创建新订单
   * @param orderData 订单数据
   * @returns 创建的订单
   */
  public async createOrder(orderData: Partial<Order>): Promise<Order> {
    const now = Date.now();
    const order: Order = {
      mint: orderData.mint || '',
      token_amount: orderData.token_amount || 0,
      price: orderData.price || 0,
      created_at: now,
      status: OrderStatus.Buying,
      platform: orderData.platform || ''
    };

    // 存储到Redis (使用mint作为key)
    await this.saveOrderToRedis(order.mint, order);
    return order;
  }

  /**
   * 更新订单状态
   * @param mint 代币mint地址
   * @param status 新状态
   */
  public async updateOrderStatus(mint: string, status: OrderStatus): Promise<void> {
    try {
      // 从Redis获取订单
      const orderData = await this.redisClient.get(`order:${mint}`);
      if (!orderData) {
        return;
      }

      const order: Order = JSON.parse(orderData);
      order.status = status;

      // 更新Redis
      await this.saveOrderToRedis(mint, order);

    } catch (error) {
      log('error', '❌ 更新订单状态失败:', error);
      throw error;
    }
  }

  /**
   * 更新订单的代币数量和价格
   * @param mint 代币mint地址
   * @param tokenAmount 新的代币数量
   * @param price 新的价格
   * @param isBuy 是否是买入
   */
  public async updateOrderTokenAmountAndPrice(mint: string, tokenAmount: number, price: number, isBuy: boolean): Promise<void> {
    try {
      // 从Redis获取订单
      const orderData = await this.redisClient.get(`order:${mint}`);
      if (!orderData) {
        return;
      }

      const order: Order = JSON.parse(orderData);
      if (isBuy) {
        order.token_amount += tokenAmount;
      } else {
        order.token_amount -= tokenAmount;
      }
      order.price = price;

      // 更新Redis
      await this.saveOrderToRedis(mint, order);

    } catch (error) {
      throw error;
    }
  }

  /**
   * 更新订单的代币数量
   * @param mint 代币mint地址
   * @param tokenAmount 新的代币数量
   */
  public async updateOrderTokenAmount(mint: string, tokenAmount: number): Promise<void> {
    try {
      // 从Redis获取订单
      const orderData = await this.redisClient.get(`order:${mint}`);
      if (!orderData) {
        return;
      }

      const order: Order = JSON.parse(orderData);
      order.token_amount = tokenAmount;

      // 更新Redis
      await this.saveOrderToRedis(mint, order);

    } catch (error) {
      throw error;
    }
  }

  /**
   * 获取订单
   * @param mint 代币mint地址
   * @returns 订单数据
   */
  public async getOrder(mint: string): Promise<Order | null> {
    try {
      const orderData = await this.redisClient.get(`order:${mint}`);
      return orderData ? JSON.parse(orderData) : null;
    } catch (error) {
      log('error', '❌ 获取订单失败:', error);
      return null;
    }
  }

  /**
   * 获取所有订单
   * @returns 所有订单列表
   */
  public async getAllOrders(): Promise<Order[]> {
    try {
      const keys = await this.redisClient.keys('order:*');
      const orders: Order[] = [];
      
      for (const key of keys) {
        const orderData = await this.redisClient.get(key);
        if (orderData) {
          const order: Order = JSON.parse(orderData);
          orders.push(order);
        }
      }
      
      return orders;
    } catch (error) {
      log('error', '❌ 获取所有订单失败:', error);
      return [];
    }
  }

  /**
   * 删除订单
   * @param mint 代币mint地址
   * @returns 是否删除成功
   */
  public async deleteOrder(mint: string): Promise<boolean> {
    try {
      // 检查订单是否存在
      const orderExists = await this.redisClient.exists(`order:${mint}`);
      if (!orderExists) {
        return false;
      }

      // 删除订单
      await this.redisClient.del(`order:${mint}`);
      return true;
    } catch (error) {
      log('error', '❌ 删除订单失败:', error);
      return false;
    }
  }

  /**
   * 保存订单到Redis
   * @param mint 代币mint地址
   * @param order 订单数据
   */
  public async saveOrderToRedis(mint: string, order: Order): Promise<void> {
    try {
      await this.redisClient.set(`order:${mint}`, JSON.stringify(order), {
        EX: RedisService.DEFAULT_TTL_SECONDS
      });
    } catch (error) {
      log('error', '❌ 保存订单到Redis失败:', error);
      throw error;
    }
  }

  /**
   * 保存PumpfunTradeInfo数据
   * @param token 代币mint地址
   * @param processedData 处理后的数据
   */
  public async savePumpfunTradeInfo(token: string, processedData: any): Promise<void> {
    try {
      await this.redisClient.set(`pumpfun_token:${token}`, JSON.stringify(processedData), {
        EX: RedisService.DEFAULT_TTL_SECONDS
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * 更新PumpfunTradeInfo数据
   * @param token 代币mint地址
   * @param updateData 要更新的数据
   */
  public async updatePumpfunTradeInfo(token: string, updateData: any): Promise<void> {
    try {
      // 先获取现有数据
      const existingData = await this.getPumpfunTradeInfo(token);
      if (!existingData) {
        return;
      }

      // 保存更新后的数据
      await this.redisClient.set(`pumpfun_token:${token}`, JSON.stringify(updateData), {
        EX: RedisService.DEFAULT_TTL_SECONDS
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * 获取PumpfunTradeInfo数据
   * @param token 代币mint地址
   * @returns PumpfunTradeInfo数据或null
   */
  public async getPumpfunTradeInfo(token: string): Promise<any | null> {
    try {
      const data = await this.redisClient.get(`pumpfun_token:${token}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * 删除PumpfunTradeInfo数据
   * @param token 代币mint地址
   * @returns 是否删除成功
   */
  public async deletePumpfunTradeInfo(token: string): Promise<boolean> {
    try {
      // 检查数据是否存在
      const exists = await this.redisClient.exists(`pumpfun_token:${token}`);
      if (!exists) {
        return false;
      }

      // 删除数据
      await this.redisClient.del(`pumpfun_token:${token}`);
      return true;
    } catch (error) {
      log('error', '❌ 删除PumpfunTradeInfo失败:', error);
      return false;
    }
  }

  /**
   * 保存PumpSwapTradeInfo数据
   * @param token 代币mint地址
   * @param processedData 处理后的数据
   */
  public async savePumpSwapTradeInfo(token: string, processedData: any): Promise<void> {
    try {
      await this.redisClient.set(`pumpswap_token:${token}`, JSON.stringify(processedData), {
        EX: RedisService.DEFAULT_TTL_SECONDS
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * 更新PumpSwapTradeInfo数据
   * @param token 代币mint地址
   * @param updateData 要更新的数据
   */
  public async updatePumpSwapTradeInfo(token: string, updateData: any): Promise<void> {
    try {
      // 先获取现有数据
      const existingData = await this.getPumpSwapTradeInfo(token);
      if (!existingData) {
        return;
      }

      // 保存更新后的数据
      await this.redisClient.set(`pumpswap_token:${token}`, JSON.stringify(updateData), {
        EX: RedisService.DEFAULT_TTL_SECONDS
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * 获取PumpSwapTradeInfo数据
   * @param token 代币mint地址
   * @returns PumpSwapTradeInfo数据或null
   */
  public async getPumpSwapTradeInfo(token: string): Promise<any | null> {
    try {
      const data = await this.redisClient.get(`pumpswap_token:${token}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * 删除PumpSwapTradeInfo数据
   * @param token 代币mint地址
   * @returns 是否删除成功
   */
  public async deletePumpSwapTradeInfo(token: string): Promise<boolean> {
    try {
      // 检查数据是否存在
      const exists = await this.redisClient.exists(`pumpswap_token:${token}`);
      if (!exists) {
        return false;
      }

      // 删除数据
      await this.redisClient.del(`pumpswap_token:${token}`);
      return true;
    } catch (error) {
      log('error', '❌ 删除PumpSwapTradeInfo失败:', error);
      return false;
    }
  }

  // ==================== Meteora DAMM V2 TradeInfo 相关方法 ====================

  /**
   * 保存MeteoraDammV2TradeInfo数据
   * @param token 代币mint地址
   * @param processedData 处理后的数据
   */
  public async saveMeteoraDammV2TradeInfo(token: string, processedData: any): Promise<void> {
    try {
      await this.redisClient.set(`meteora_damm_v2_token:${token}`, JSON.stringify(processedData), {
        EX: RedisService.DEFAULT_TTL_SECONDS
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * 更新MeteoraDammV2TradeInfo数据
   * @param token 代币mint地址
   * @param updateData 要更新的数据
   */
  public async updateMeteoraDammV2TradeInfo(token: string, updateData: any): Promise<void> {
    try {
      // 先获取现有数据
      const existingData = await this.getMeteoraDammV2TradeInfo(token);
      if (!existingData) {
        return;
      }

      // 保存更新后的数据
      await this.redisClient.set(`meteora_damm_v2_token:${token}`, JSON.stringify(updateData), {
        EX: RedisService.DEFAULT_TTL_SECONDS
      });
    } catch (error) {
      throw error;
    }
  }

  /**
   * 获取MeteoraDammV2TradeInfo数据
   * @param token 代币mint地址
   * @returns MeteoraDammV2TradeInfo数据或null
   */
  public async getMeteoraDammV2TradeInfo(token: string): Promise<any | null> {
    try {
      const data = await this.redisClient.get(`meteora_damm_v2_token:${token}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      return null;
    }
  }

  /**
   * 删除MeteoraDammV2TradeInfo数据
   * @param token 代币mint地址
   * @returns 是否删除成功
   */
  public async deleteMeteoraDammV2TradeInfo(token: string): Promise<boolean> {
    try {
      // 检查数据是否存在
      const exists = await this.redisClient.exists(`meteora_damm_v2_token:${token}`);
      if (!exists) {
        return false;
      }

      // 删除数据
      await this.redisClient.del(`meteora_damm_v2_token:${token}`);
      return true;
    } catch (error) {
      log('error', '❌ 删除MeteoraDammV2TradeInfo失败:', error);
      return false;
    }
  }


  /**
   * 记录全局买入时间
   */
  public async recordGlobalBuyTime(): Promise<void> {
    try {
      const currentTime = Date.now();
      await this.redisClient.set('global_buy_time', currentTime.toString(), {
        EX: RedisService.DEFAULT_TTL_SECONDS
      });
    } catch (error) {
      log('error', '❌ 记录全局买入时间失败:', error);
      throw error;
    }
  }

  /**
   * 检查是否可以买入（基于全局买入间隔）
   * @param buyIntervalSeconds 买入间隔（秒）
   * @returns 是否可以买入
   */
  public async canBuy(buyIntervalSeconds: number): Promise<boolean> {
    try {
      const lastBuyTimeStr = await this.redisClient.get('global_buy_time');
      
      // 如果没有记录过买入时间，可以买入
      if (!lastBuyTimeStr) {
        return true;
      }

      const lastBuyTime = parseInt(lastBuyTimeStr);
      const currentTime = Date.now();
      const timeDiffSeconds = (currentTime - lastBuyTime) / 1000;

      const canBuy = timeDiffSeconds >= buyIntervalSeconds;

      return canBuy;
    } catch (error) {
      log('error', '❌ 检查全局买入间隔失败:', error);
      // 出错时允许买入，避免阻塞交易
      return true;
    }
  }

  /**
   * 尝试获取买入锁并执行买入操作
   * 使用Redis的SET NX EX命令实现分布式锁
   * @param buyIntervalSeconds 买入间隔（秒）
   * @returns 包含锁值和是否成功的对象
   */
  public async tryBuyWithLock(buyIntervalSeconds: number): Promise<{ success: boolean; lockValue?: string }> {
    const lockTimeoutSeconds = 30; // 固定30秒超时
    const lockKey = 'buy_lock';
    const lockValue = `${Date.now()}_${Math.random()}`;
    
    try {
      // 首先检查是否可以买入（基于时间间隔）
      const canBuy = await this.canBuy(buyIntervalSeconds);
      if (!canBuy) {
        return { success: false };
      }

      // 尝试获取锁（SET NX EX - 如果不存在则设置，并设置过期时间）
      const lockResult = await this.redisClient.set(lockKey, lockValue, {
        NX: true,  // 只在键不存在时设置
        EX: lockTimeoutSeconds  // 设置过期时间
      });

      if (lockResult === 'OK') {
        // 成功获取锁，记录买入时间
        await this.recordGlobalBuyTime();
        log('info', '🔒 成功获取买入锁，可以执行买入操作');
        return { success: true, lockValue };
      } else {
        // 获取锁失败，说明其他进程正在执行买入
        log('debug', '🔒 买入锁被占用，跳过本次买入');
        return { success: false };
      }
    } catch (error) {
      log('error', '❌ 获取买入锁失败:', error);
      // 出错时允许买入，避免阻塞交易
      return { success: true, lockValue };
    }
  }

  /**
   * 释放买入锁
   * @param lockValue 锁的值，用于验证锁的所有权
   */
  public async releaseBuyLock(lockValue: string): Promise<void> {
    const lockKey = 'buy_lock';
    
    try {
      // 使用Lua脚本确保只有锁的持有者才能释放锁
      const luaScript = `
        if redis.call("GET", KEYS[1]) == ARGV[1] then
          return redis.call("DEL", KEYS[1])
        else
          return 0
        end
      `;
      
      await this.redisClient.eval(luaScript, {
        keys: [lockKey],
        arguments: [lockValue]
      });
      
      log('debug', '🔓 买入锁已释放');
    } catch (error) {
      log('error', '❌ 释放买入锁失败:', error);
    }
  }

  /**
   * 保存最近的区块哈希到Redis
   * @param blockhash 区块哈希
   */
  public async saveRecentBlockhash(blockhash: string): Promise<void> {
    try {
      await this.redisClient.set('recent_blockhash', blockhash, {
        EX: RedisService.DEFAULT_TTL_SECONDS
      });
    } catch (error) {
      log('error', '❌ 保存区块哈希到Redis失败:', error);
      throw error;
    }
  }

  /**
   * 从Redis获取最近的区块哈希
   * @returns 区块哈希或null
   */
  public async getRecentBlockhash(): Promise<string | null> {
    try {
      const blockhash = await this.redisClient.get('recent_blockhash');
      return blockhash;
    } catch (error) {
      log('error', '❌ 从Redis获取区块哈希失败:', error);
      return null;
    }
  }

  /**
   * 关闭Redis连接
   */
  public async close(): Promise<void> {
    if (this.redisClient) {
      try {
        // 检查客户端是否已经关闭
        if (this.redisClient.isOpen) {
          await this.redisClient.quit();
          log('info', '🔌 Redis连接已关闭');
        } else {
          log('info', '🔌 Redis连接已关闭');
        }
      } catch (error) {
        // 忽略客户端已关闭的错误
        if (error instanceof Error && error.message.includes('The client is closed')) {
          log('info', '🔌 Redis连接已关闭');
        } else {
          log('error', '❌ 关闭Redis连接时出错:', error);
        }
      }
    }
  }
}
