import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

/**
 * 应用配置类
 * 统一管理所有环境变量，避免在代码中直接使用 process.env
 */
export class Config {
  // HTTP API 配置
  public static readonly HTTP_API_URL: string = process.env['HTTP_API_URL'] || 'http://localhost:3000';
  public static readonly REQUEST_TIMEOUT: number = parseInt(process.env['REQUEST_TIMEOUT'] || '30000');

  // 日志配置
  public static readonly LOG_LEVEL: string = process.env['LOG_LEVEL'] || 'info';

  // 交易配置
  public static readonly BUY_AMOUNT_SOL: number = parseFloat(process.env['BUY_AMOUNT_SOL'] || '0.01');
  public static readonly SLIPPAGE_BPS: number = parseInt(process.env['SLIPPAGE_BPS'] || '500');
  public static readonly BUY_INTERVAL: number = parseInt(process.env['BUY_INTERVAL'] || '60');

  // 机器人钱包地址
  public static readonly BOT_ADDRESS: string = process.env['BOT_ADDRESS'] || '';

  // Unix Socket 配置
  public static readonly UNIX_SOCKET_PATH: string = process.env['UNIX_SOCKET_PATH'] || '/tmp/parser_proxy.sock';

  // Solana RPC 配置
  public static readonly RPC_URL: string = process.env['RPC_URL'] || 'https://api.mainnet-beta.solana.com';

  // Redis 配置
  public static readonly REDIS_URL: string = process.env['REDIS_URL'] || 'unix:///home/redis-run/redis.sock?db=2';

  // 地址查找表配置
  public static readonly LOOKUP_TABLE_ACCOUNTS: string = process.env['LOOKUP_TABLE_ACCOUNTS'] || '';

  // Nonce 账户配置
  public static readonly NONCE_PUBKEY: string = process.env['NONCE_PUBKEY'] || '';
  public static readonly USE_NONCE: boolean = process.env['USE_NONCE'] === 'true';

  // Gas Fee 配置
  public static readonly GLOBAL_CU_LIMIT: number = parseInt(process.env['GLOBAL_CU_LIMIT'] || '1100000');
  public static readonly GLOBAL_CU_PRICE: number = parseInt(process.env['GLOBAL_CU_PRICE'] || '180000');
  public static readonly GLOBAL_BUY_TIP: number = parseFloat(process.env['GLOBAL_BUY_TIP'] || '0.0001');
  public static readonly GLOBAL_SELL_TIP: number = parseFloat(process.env['GLOBAL_SELL_TIP'] || '0.0001');

  // 高低小费策略配置
  public static readonly ENABLE_HIGH_LOW_FEE: boolean = process.env['ENABLE_HIGH_LOW_FEE'] === 'true';
  
  // 低小费高优先费策略
  public static readonly HIGH_CU_PRICE: number = parseInt(process.env['HIGH_CU_PRICE'] || '500000');
  public static readonly LOW_BUY_TIP: number = parseFloat(process.env['LOW_BUY_TIP'] || '0.0001');
  public static readonly LOW_SELL_TIP: number = parseFloat(process.env['LOW_SELL_TIP'] || '0.0001');

  // 高小费低优先费策略
  public static readonly LOW_CU_PRICE: number = parseInt(process.env['LOW_CU_PRICE'] || '180000');
  public static readonly HIGH_BUY_TIP: number = parseFloat(process.env['HIGH_BUY_TIP'] || '0.0002');
  public static readonly HIGH_SELL_TIP: number = parseFloat(process.env['HIGH_SELL_TIP'] || '0.0002');

  /**
   * 获取地址查找表账户列表
   * @returns 地址查找表账户地址数组
   */
  public static getLookupTableAddresses(): string[] {
    return this.LOOKUP_TABLE_ACCOUNTS
      .split(',')
      .map(addr => addr.trim())
      .filter(addr => addr.length > 0);
  }

}

// 导出默认配置实例
export default Config;
