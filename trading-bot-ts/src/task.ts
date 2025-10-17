import { PublicKey } from '@solana/web3.js';
import { redisService, getConnection } from './services';
import { log } from './logger';
import Config from './config';
import { OrderStatus } from './types/order';

/**
 * 定时任务类
 * 负责各种定时任务的执行，包括区块哈希更新等
 */
export class TaskScheduler {
  private static instance: TaskScheduler | null = null;
  private blockhashIntervalId: NodeJS.Timeout | null = null;
  private isBlockhashTaskRunning: boolean = false;
  private tokenBalanceIntervalId: NodeJS.Timeout | null = null;
  private isTokenBalanceTaskRunning: boolean = false;

  private constructor() {}

  /**
   * 获取TaskScheduler单例实例
   */
  public static getInstance(): TaskScheduler {
    if (!TaskScheduler.instance) {
      TaskScheduler.instance = new TaskScheduler();
    }
    return TaskScheduler.instance;
  }

  /**
   * 启动所有定时任务
   */
  public async startAllTasks(): Promise<void> {
    try {
      // 启动区块哈希定时任务
      await this.startBlockhashTask();
      
      // 启动token余额检查定时任务
      await this.startTokenBalanceCheckTask();
      
      log('info', '✅ 所有定时任务已启动');
    } catch (error) {
      log('error', '❌ 启动定时任务失败:', error);
      throw error;
    }
  }

  /**
   * 启动区块哈希定时任务
   * 每5秒更新一次区块哈希
   */
  public async startBlockhashTask(): Promise<void> {
    if (Config.USE_NONCE) {
      return;
    }

    if (this.isBlockhashTaskRunning) {
      log('warn', '⚠️ 区块哈希定时任务已在运行中');
      return;
    }

    try {
      // 立即执行一次获取区块哈希
      await this.updateBlockhash();
      
      // 启动定时任务，每5秒更新一次
      this.blockhashIntervalId = setInterval(async () => {
        await this.updateBlockhash();
      }, 5 * 1000); // 5秒

      this.isBlockhashTaskRunning = true;
    } catch (error) {
      log('error', '❌ 启动区块哈希定时任务失败:', error);
      throw error;
    }
  }

  /**
   * 停止区块哈希定时任务
   */
  public stopBlockhashTask(): void {
    if (!this.isBlockhashTaskRunning) {
      log('warn', '⚠️ 区块哈希定时任务未在运行');
      return;
    }

    if (this.blockhashIntervalId) {
      clearInterval(this.blockhashIntervalId);
      this.blockhashIntervalId = null;
    }

    this.isBlockhashTaskRunning = false;
  }

  /**
   * 获取最新的区块哈希并存储到Redis
   */
  private async updateBlockhash(): Promise<void> {
    try {
      const connection = getConnection('confirmed');
      
      // 获取最近的区块哈希
      const { blockhash } = await connection.getLatestBlockhash();
      
      // 存储到Redis
      await redisService.saveRecentBlockhash(blockhash);
      
    } catch (error) {
      log('error', '❌ 更新区块哈希失败:', error);
    }
  }

  /**
   * 检查区块哈希定时任务是否正在运行
   */
  public isBlockhashTaskActive(): boolean {
    return this.isBlockhashTaskRunning;
  }

  /**
   * 停止所有定时任务
   */
  public stopAllTasks(): void {
    this.stopBlockhashTask();
    this.stopTokenBalanceCheckTask();
  }

  /**
   * 启动token余额检查定时任务
   * 每10秒检查状态为Bought且token_amount为0的订单的token余额
   */
  public async startTokenBalanceCheckTask(): Promise<void> {
    if (this.isTokenBalanceTaskRunning) {
      log('warn', '⚠️ Token余额检查定时任务已在运行中');
      return;
    }

    try {
      // 立即执行一次检查
      await this.checkTokenBalances();
      
      // 启动定时任务，每10秒检查一次
      this.tokenBalanceIntervalId = setInterval(async () => {
        await this.checkTokenBalances();
      }, 10 * 1000); // 10秒

      this.isTokenBalanceTaskRunning = true;
      log('info', '✅ Token余额检查定时任务已启动');
    } catch (error) {
      log('error', '❌ 启动Token余额检查定时任务失败:', error);
      throw error;
    }
  }

  /**
   * 停止token余额检查定时任务
   */
  public stopTokenBalanceCheckTask(): void {
    if (!this.isTokenBalanceTaskRunning) {
      log('warn', '⚠️ Token余额检查定时任务未在运行');
      return;
    }

    if (this.tokenBalanceIntervalId) {
      clearInterval(this.tokenBalanceIntervalId);
      this.tokenBalanceIntervalId = null;
    }

    this.isTokenBalanceTaskRunning = false;
    log('info', '✅ Token余额检查定时任务已停止');
  }

  /**
   * 检查所有符合条件的订单的token余额
   */
  private async checkTokenBalances(): Promise<void> {
    try {
      // 获取所有订单
      const orders = await redisService.getAllOrders();
      
      // 筛选状态为Bought且token_amount为0的订单
      const eligibleOrders = orders.filter(order => 
        order.status === OrderStatus.Bought && order.token_amount === 0
      );

      if (eligibleOrders.length === 0) {
        return;
      }

      const botAddress = Config.BOT_ADDRESS;
      if (!botAddress) {
        log('error', '❌ 未找到 BOT_ADDRESS 环境变量');
        return;
      }

      const connection = getConnection('confirmed');
      const walletPublicKey = new PublicKey(botAddress);

      // 一次性获取钱包所有token账户，避免重复调用RPC
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        walletPublicKey,
        {
          programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
        }
      );

      // 检查每个订单的token余额
      for (const order of eligibleOrders) {
        try {
          let actualBalance = 0;

          // 遍历查找匹配的mint
          for (const { account } of tokenAccounts.value) {
            const parsedInfo = account.data.parsed.info;
            if (parsedInfo.mint === order.mint) {
              actualBalance = Number(parsedInfo.tokenAmount.amount);
              // log('info', `📊 订单 ${order.mint} token余额: ${actualBalance}`);
              break;
            }
          }

          // 如果余额大于0，更新订单的token_amount
          if (actualBalance > 0 && order.token_amount === 0) {
            await redisService.updateOrderTokenAmount(
              order.mint, 
              actualBalance
            );
            log('info', `✅ 已更新订单 ${order.mint} 的token_amount为: ${actualBalance}`);
          }
        } catch (error) {
          log('error', `❌ 检查订单 ${order.mint} token余额失败:`, error);
        }
      }
    } catch (error) {
      log('error', '❌ 检查token余额失败:', error);
    }
  }
}
