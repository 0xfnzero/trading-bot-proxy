import {
  PublicKey,
  AccountInfo,
  NONCE_ACCOUNT_LENGTH,
} from "@solana/web3.js";
import { Buffer } from "buffer";
import bs58 from "bs58";
import { log } from "../logger";
import Config from "../config";
import { getConnection } from "./connectionService";

/**
 * DurableNonceInfo 结构用于存储持久性 nonce 相关信息
 */
export interface DurableNonceInfo {
  nonce_account: string;
  current_nonce: string;
}

// 内存中缓存的 nonce 信息
let cachedNonceInfo: DurableNonceInfo | null = null;

/**
 * 刷新并缓存 nonce 信息
 * 使用 RPC_URL 和 NONCE_PUBKEY 环境变量
 * 支持重试机制：最多重试5次，每次延迟1.5秒
 * 如果获取的值有变化，则停止重试
 * @returns DurableNonceInfo 或者在不可用时返回 null
 */
export async function refreshNonceInfo(): Promise<DurableNonceInfo | null> {
  const maxRetries = 5;
  const retryDelay = 1500; // 1.5秒延迟
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    log('info', `Refreshing nonce info, attempt ${attempt}`);
    try {
      if (!Config.USE_NONCE) {
        return null;
      }

      // 从配置获取设置
      const noncePubkeyStr = Config.NONCE_PUBKEY;

      if (!noncePubkeyStr) {
        log('error', "NONCE_PUBKEY 环境变量未设置。");
        return null;
      }

      // 获取连接并解析 nonce 账户公钥
      const connection = getConnection('finalized');
      const nonceAccountPubkey = new PublicKey(noncePubkeyStr);

      // 从 RPC 获取账户信息，使用 finalized commitment level 确保获取最新数据
      const accountInfo: AccountInfo<Buffer> | null =
        await connection.getAccountInfo(nonceAccountPubkey, { commitment: 'finalized' });

      if (!accountInfo) {
        log('error', "未找到 Nonce 账户。");
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue;
        }
        return null;
      }

      // 验证账户数据长度（应该匹配 NONCE_ACCOUNT_LENGTH）
      if (accountInfo.data.length !== NONCE_ACCOUNT_LENGTH) {
        log('error', "账户不是有效的 nonce 账户。");
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue;
        }
        return null;
      }

      // 解析 nonce 账户数据（手动解码）
      // 参考：https://github.com/solana-labs/solana/blob/master/account-decoder/src/parse_account_data.rs
      const nonceData = decodeNonceAccount(accountInfo.data);

      if (nonceData && nonceData.authority) {
        const nonceInfo = {
          nonce_account: nonceAccountPubkey.toString(),
          current_nonce: nonceData.authority.toString(),
        };
        
        // 检查获取的值是否有变化
        const hasValueChanged = !cachedNonceInfo || 
          cachedNonceInfo.current_nonce !== nonceInfo.current_nonce;
        
        // 保存到内存缓存
        cachedNonceInfo = nonceInfo;
        
        if (hasValueChanged) {
          log('info', "Nonce信息缓存成功:", nonceInfo);
          return nonceInfo;
        } else {
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, retryDelay));
            continue;
          } else {
            return nonceInfo;
          }
        }
      }

      // 如果解析失败，进行重试
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        continue;
      }
      
      return null;
    } catch (error) {
      log('error', "获取 nonce 账户信息失败:", error);
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        continue;
      }
      return null;
    }
  }
  
  return null;
}

/**
 * 获取缓存的 nonce 信息
 * @returns 缓存的 DurableNonceInfo 或者 null
 */
export function getCachedNonceInfo(): DurableNonceInfo | null {
  return cachedNonceInfo;
}

/**
 * 清理所有缓存（包括 nonce 信息）
 * 在需要重置状态时调用
 */
export function clearAllCache(): void {
  cachedNonceInfo = null;
}

/**
 * 将 nonce 账户二进制数据解码为可读结构
 * @param data 账户数据的 Buffer
 * 
 * 官方 Rust 布局：
 * struct NonceAccount {
 *   version: u32,
 *   state: u32,
 *   data: {
 *     durable_nonce: [u8; 32],
 *     authority: Pubkey,
 *   }
 * }
 */
function decodeNonceAccount(data: Buffer): {
  nonce: string | null;
  authority: PublicKey | null;
} {
  try {
    const VERSION_SIZE = 4;
    const STATE_SIZE = 4;
    const NONCE_SIZE = 32;
    const PUBKEY_SIZE = 32;

    // 偏移量
    const NONCE_OFFSET = VERSION_SIZE + STATE_SIZE;
    const AUTHORITY_OFFSET = NONCE_OFFSET + NONCE_SIZE;

    // 提取字段
    const nonceHashBuf = data.subarray(NONCE_OFFSET, NONCE_OFFSET + NONCE_SIZE);
    const authorityBuf = data.subarray(AUTHORITY_OFFSET, AUTHORITY_OFFSET + PUBKEY_SIZE);

    const nonce = bs58.encode(nonceHashBuf); // 正确的哈希表示
    const authority = new PublicKey(authorityBuf);

    return { nonce, authority };
  } catch (e) {
    log('error', "解码 nonce 账户失败:", e);
    return { nonce: null, authority: null };
  }
}
