import { EventSubscriber } from './subscriber';
import { TradingProxyClient } from './client';
import { PumpFunExecutor } from './executor/pumpfun';
import { PumpSwapExecutor } from './executor/pumpswap';
import { MeteoraDammV2Executor } from './executor/meteoraDammV2';
import { SellTimer } from './executor/checkOrder';
import { TaskScheduler } from './task';
import { PumpFunTradeEvent, PumpSwapBuyEvent, PumpSwapSellEvent, MeteoraDammV2SwapEvent } from './parser/parser_messages';
import { ExecutorConfig } from './types';
import { log, getLogLevel } from './logger';
import { redisService, addressLookupTableService, refreshNonceInfo } from './services';
import { clearConnection } from './services/connectionService';
import Config from './config';

// 创建执行器配置
const executorConfig: ExecutorConfig = {
  buyAmountSOL: Config.BUY_AMOUNT_SOL,
  slippageBps: Config.SLIPPAGE_BPS,
  buyIntervalSeconds: Config.BUY_INTERVAL
};

// 全局执行器实例
const client = new TradingProxyClient();
const pumpFunExecutor = new PumpFunExecutor(client, executorConfig);
const pumpSwapExecutor = new PumpSwapExecutor(client, executorConfig);
const meteoraDammV2Executor = new MeteoraDammV2Executor(client, executorConfig);

// 创建执行器Map
const executors = new Map<string, any>();
executors.set('pumpfun', pumpFunExecutor);
executors.set('pumpswap', pumpSwapExecutor);
executors.set('meteora_damm_v2', meteoraDammV2Executor);

const sellTimer = new SellTimer(executors);

// 创建定时任务调度器
const taskScheduler = TaskScheduler.getInstance();


async function main(): Promise<void> {
  log('info', '🚀 Trading Bot Example 启动中...');
  
  // 显示配置信息
  log('info', '📋 配置信息:');
  log('info', `  HTTP API URL: ${Config.HTTP_API_URL}`);
  log('info', `  Unix Socket Path: ${Config.UNIX_SOCKET_PATH}`);
  log('info', `  Request Timeout: ${Config.REQUEST_TIMEOUT}ms`);
  log('info', `  Log Level: ${getLogLevel()}`);
  log('info', '📊 交易配置:');
  log('info', `  买入SOL数量: ${executorConfig.buyAmountSOL}`);
  log('info', `  滑点容忍度: ${executorConfig.slippageBps}bps`);
  log('info', `  买入间隔: ${executorConfig.buyIntervalSeconds}秒`);

  try {
    // 初始化Redis连接
    log('info', '🔗 初始化Redis连接...');
    await redisService.initialize();
    
    // 初始化地址查找表
    await addressLookupTableService.initialize();

    if (Config.USE_NONCE) {
      // 初始化Nonce信息
      log('info', '🔗 初始化Nonce信息...');
      await refreshNonceInfo();
    }
    
    // 启动定时任务
    log('info', '⏰ 启动定时任务...');
    await taskScheduler.startAllTasks();
    
    // 测试HTTP API连接
    log('info', '🔍 测试HTTP API连接...');
    const health = await client.health();
    log('info', '✅ HTTP API连接成功:', health);

    // 启动Unix Socket订阅
    log('info', '🔌 启动Unix Socket订阅...');
    const subscriber = new EventSubscriber();

    // 监听特定事件类型
    subscriber.on('PumpSwapBuy', async (data, _latency) => {
      // 使用PumpSwap执行器处理买入事件
      await pumpSwapExecutor.execute(data as PumpSwapBuyEvent, 'PumpSwapBuyEvent');
    });

    subscriber.on('PumpSwapSell', async (data, _latency) => {
      // 使用PumpSwap执行器处理卖出事件
      await pumpSwapExecutor.execute(data as PumpSwapSellEvent, 'PumpSwapSellEvent');
    });

    subscriber.on('PumpFunTrade', async (data, _latency) => {
      // 使用PumpFun执行器处理交易事件
      await pumpFunExecutor.execute(data as PumpFunTradeEvent);
    });

    subscriber.on('MeteoraDammV2Swap', async (data, _latency) => {
      // 使用MeteoraDammV2执行器处理交换事件
      await meteoraDammV2Executor.execute(data as MeteoraDammV2SwapEvent);
    });

    // 监听Unix Socket错误事件
    subscriber.on('error', (err) => {
      log('error', '💥 Unix Socket连接失败，程序退出:', err.message);
      process.exit(1);
    });

    // 启动连接
    subscriber.connect();

    // 启动卖出定时器
    log('info', '⏰ 启动卖出定时器...');
    sellTimer.start();

    // 优雅关闭处理
    process.on('SIGINT', async () => {
      log('info', '🛑 收到关闭信号，正在断开连接...');
      sellTimer.stop();
      taskScheduler.stopAllTasks();
      subscriber.disconnect();
      await redisService.close();
      clearConnection();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      log('info', '🛑 收到终止信号，正在断开连接...');
      sellTimer.stop();
      taskScheduler.stopAllTasks();
      subscriber.disconnect();
      await redisService.close();
      clearConnection();
      process.exit(0);
    });

    log('info', '🎉 Trading Bot Example 启动完成，等待Unix Socket数据...');

  } catch (error) {
    // 如果是Redis连接失败，只显示简洁的错误信息
    if (error instanceof Error && error.message.includes('Redis')) {
      log('error', `💥 ${error.message}，程序退出`);
      process.exit(1);
    }
    
    // 其他错误显示详细信息
    log('error', '❌ 启动失败:', error);
    process.exit(1);
  }
}

main().catch((error: any) => {
  log('error', '❌ 未处理的错误:', error);
  process.exit(1);
});
