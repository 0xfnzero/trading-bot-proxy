import { Connection } from '@solana/web3.js';
import Config from '../config';
import { log } from '../logger';

/**
 * Solana连接管理类
 * 使用单例模式管理Connection实例，避免重复创建连接
 */
class ConnectionManager {
  private static instance: ConnectionManager | null = null;
  private connection: Connection | null = null;

  private constructor() {}

  /**
   * 获取ConnectionManager单例实例
   */
  public static getInstance(): ConnectionManager {
    if (!ConnectionManager.instance) {
      ConnectionManager.instance = new ConnectionManager();
    }
    return ConnectionManager.instance;
  }

  /**
   * 获取或创建Connection实例
   * @param commitment 确认级别，默认为 'confirmed'
   * @returns Connection实例
   */
  public getConnection(
    commitment: 'processed' | 'confirmed' | 'finalized' = 'confirmed'
  ): Connection {
    const url = Config.RPC_URL;
    
    if (!url) {
      throw new Error('RPC_URL未配置');
    }

    // 如果连接不存在，创建新连接
    if (!this.connection) {
      this.connection = new Connection(url, commitment);
      log('info', `🔗 创建新的Solana连接: ${url}`);
    }

    return this.connection;
  }

  /**
   * 清除缓存的连接
   * 下次调用getConnection时会创建新连接
   */
  public clearConnection(): void {
    this.connection = null;
    log('info', '🔌 已清除Solana连接缓存');
  }
}

// 导出单例实例的便捷方法
export const connectionManager = ConnectionManager.getInstance();

/**
 * 获取Solana连接实例（便捷函数）
 * @param commitment 确认级别，默认为 'confirmed'
 * @returns Connection实例
 */
export function getConnection(
  commitment: 'processed' | 'confirmed' | 'finalized' = 'confirmed'
): Connection {
  return connectionManager.getConnection(commitment);
}

/**
 * 清除连接缓存（便捷函数）
 */
export function clearConnection(): void {
  connectionManager.clearConnection();
}

