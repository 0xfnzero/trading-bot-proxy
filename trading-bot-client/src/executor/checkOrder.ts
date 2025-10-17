import { redisService } from '../services';
import { OrderStatus } from '../types/order';
import { log } from '../logger';

/**
 * 执行器接口 - 定义卖出方法
 */
interface Executor {
  sell(mintAddress: string): Promise<void>;
}

/**
 * 定时器类 - 负责监控买入订单并在10秒后自动卖出
 */
export class SellTimer {
  private executors: Map<string, Executor>;
  private intervalId: NodeJS.Timeout | null = null;
  private readonly checkIntervalMs = 1000; // 每秒检查一次
  private readonly sellDelaySeconds = 10; // 买入后10秒卖出

  constructor(executors: Map<string, Executor>) {
    this.executors = executors;
  }

  /**
   * 启动定时器
   */
  public start(): void {
    if (this.intervalId) {
      return;
    }

    log('info', '🚀 启动卖出定时器，每1秒检查一次订单');
    
    this.intervalId = setInterval(async () => {
      await this.checkAndSellOrders();
    }, this.checkIntervalMs);
  }

  /**
   * 停止定时器
   */
  public stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      log('info', '⏹️ 卖出定时器已停止');
    }
  }

  /**
   * 检查并卖出符合条件的订单
   */
  private async checkAndSellOrders(): Promise<void> {
    try {
      // 获取所有订单
      const orders = await redisService.getAllOrders();
      
      if (orders.length === 0) {
        return;
      }

      const currentTime = Date.now();
      
      for (const order of orders) {
        // 只处理已买入状态的订单
        if (order.status !== OrderStatus.Bought) {
          continue;
        }

        // 检查是否到了卖出时间（买入时间 + 10秒）
        const timeSinceBuy = (currentTime - order.created_at) / 1000;
        
        if (timeSinceBuy >= this.sellDelaySeconds) {
          
          try {
            // 根据platform选择对应的执行器
            const executor = this.executors.get(order.platform);
            if (!executor) {
              log('error', `❌ 未找到平台 ${order.platform} 的执行器`);
              continue;
            }
            
            await executor.sell(order.mint);
          } catch (error) {
            log('error', `❌ 订单 ${order.mint} (${order.platform}) 卖出失败:`, error);
          }
        }
      }
    } catch (error) {
      log('error', '❌ 检查订单时发生错误:', error);
    }
  }

  /**
   * 获取定时器状态
   */
  public isRunning(): boolean {
    return this.intervalId !== null;
  }

  /**
   * 手动触发一次检查
   */
  public async checkOnce(): Promise<void> {
    await this.checkAndSellOrders();
  }
}
