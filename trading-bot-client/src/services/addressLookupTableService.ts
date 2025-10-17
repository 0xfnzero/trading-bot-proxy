import { 
  Connection, 
  PublicKey, 
  AddressLookupTableAccount 
} from '@solana/web3.js';
import { log } from '../logger';
import Config from '../config';
import { getConnection } from './connectionService';

/**
 * 地址查找表服务类
 * 用于获取和管理Solana地址查找表账户
 */
export class AddressLookupTableService {
  private connection: Connection | null = null;
  private lookupTableAccounts: Map<string, { key: string; addresses: string[] }> = new Map();
  private static instance: AddressLookupTableService | null = null;

  private constructor() {}

  /**
   * 获取AddressLookupTableService单例实例
   */
  public static getInstance(): AddressLookupTableService {
    if (!AddressLookupTableService.instance) {
      AddressLookupTableService.instance = new AddressLookupTableService();
    }
    return AddressLookupTableService.instance;
  }

  /**
   * 初始化地址查找表服务
   */
  public async initialize(): Promise<void> {
    if (!this.connection) {
      await this.initConnection();
    }
  }

  /**
   * 初始化Solana连接
   */
  private async initConnection(): Promise<void> {
    try {
      // 从配置获取设置
      const lookupTableAddresses = Config.getLookupTableAddresses();

      // 更新配置
      this.connection = getConnection('confirmed');
      
      if (lookupTableAddresses.length === 0) {
        log('warn', '⚠️ 未配置地址查找表账户，跳过初始化');
        return;
      }

      log('info', `📋 正在初始化地址查找表账户...`);
      log('info', `📋 地址查找表账户列表: ${lookupTableAddresses.join(', ')}`);

      // 获取所有地址查找表账户并存储到Map中
      await this.fetchAllAddressLookupTableAccounts(lookupTableAddresses);
      
      log('info', `✅ 地址查找表初始化完成`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      log('error', `❌ 地址查找表初始化失败: ${errorMessage}`);
      // 不抛出错误，允许程序继续运行
    }
  }

  /**
   * 从 Solana RPC 节点获取并解析 Address Lookup Table
   * @param lookupTableAddress Address Lookup Table 的公钥
   * @returns AddressLookupTableAccount 实例
   */
  public async fetchAddressLookupTableAccount(
    lookupTableAddress: PublicKey
  ): Promise<AddressLookupTableAccount> {
    if (!this.connection) {
      log('error', '❌ 连接未初始化，请先调用initialize()方法');
      throw new Error('连接未初始化，请先调用initialize()方法');
    }

    try {
      // 直接通过 web3.js 提供的接口获取 ALT
      const res = await this.connection.getAddressLookupTable(lookupTableAddress);

      if (res.value === null) {
        log('error', `❌ Address Lookup Table not found: ${lookupTableAddress.toBase58()}`);
        throw new Error(`Address Lookup Table not found: ${lookupTableAddress.toBase58()}`);
      }

      return res.value;
    } catch (error) {
      log('error', `❌ 获取地址查找表账户失败: ${error instanceof Error ? error.message : '未知错误'}`);
      throw new Error(`获取地址查找表账户失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  }

  /**
   * 获取所有配置的地址查找表账户并存储到Map中
   * @param lookupTableAddresses 查找表地址列表
   */
  public async fetchAllAddressLookupTableAccounts(lookupTableAddresses: string[]): Promise<void> {
    // 清空现有的Map
    this.lookupTableAccounts.clear();
    
    for (const addressStr of lookupTableAddresses) {
      try {
        const address = new PublicKey(addressStr);
        const account = await this.fetchAddressLookupTableAccount(address);
        
        // 直接存储处理后的数据格式，避免每次getAddressLookupTableAccount时重复处理
        const processedData = {
          key: account.key.toBase58(),
          addresses: account.state.addresses.map(addr => addr.toBase58())
        };
        
        this.lookupTableAccounts.set(addressStr, processedData);
      } catch (error) {
        log('error', `获取地址查找表失败 ${addressStr}: ${error instanceof Error ? error.message : String(error)}`);
        // 继续处理其他地址，不中断整个流程
      }
    }
  }


  /**
   * 根据地址获取地址查找表账户
   * @param address 查找表地址字符串
   * @returns 简化的地址查找表账户对象，如果不存在则返回undefined
   */
  public getAddressLookupTableAccount(address: string): { key: string; addresses: string[] } | undefined {
    // 直接返回存储的处理后数据，无需重复处理
    return this.lookupTableAccounts.get(address);
  }

  /**
   * 关闭连接
   */
  public async close(): Promise<void> {
    if (this.connection) {
      try {
        // Solana Connection doesn't have a close method, but we can nullify it
        this.connection = null;
        log('info', '🔌 地址查找表服务连接已关闭');
      } catch (error) {
        log('error', `❌ 关闭地址查找表服务连接时出错: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }
}
