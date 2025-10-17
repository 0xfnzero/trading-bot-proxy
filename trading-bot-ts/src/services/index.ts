import { RedisService } from './redisService';
import { AddressLookupTableService } from './addressLookupTableService';

// 导出全局RedisService实例
export const redisService = RedisService.getInstance();

// 导出RedisService类
export { RedisService } from './redisService';

// 导出AddressLookupTableService实例
export const addressLookupTableService = AddressLookupTableService.getInstance();

// 导出AddressLookupTableService类
export { AddressLookupTableService } from './addressLookupTableService';

// 导出DurableNonceService相关功能
export { refreshNonceInfo, getCachedNonceInfo, DurableNonceInfo } from './durableNonceService';

// 导出ConnectionService相关功能
export { connectionManager, getConnection, clearConnection } from './connectionService';
