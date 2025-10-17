import { EventEmitter } from 'events';
import * as net from 'net';
import { LatencyInfo } from './types';
import { log } from './logger';
import { 
  ServerMessage, 
  DexEvent,
  decodeServerMessage
} from './parser/parser_messages.js';
import Config from './config';

export class EventSubscriber extends EventEmitter {
  private socket: net.Socket | null = null;
  private socketPath: string;
  private lastLatency?: LatencyInfo;

  constructor(socketPath?: string) {
    super();
    this.socketPath = socketPath || Config.UNIX_SOCKET_PATH;
  }

  connect(): void {
    this.socket = new net.Socket();
    let buffer = Buffer.alloc(0);

    this.socket.on('connect', () => {
      log('info', '✅ Connected to trading data stream via Unix Socket');
      this.emit('connected');
    });

    this.socket.on('data', (data: Buffer) => {
      buffer = Buffer.concat([buffer, data]);
      
      // 处理protobuf消息
      while (buffer.length >= 4) {
        // 读取消息长度（前4字节）
        const messageLength = buffer.readUInt32BE(0);
        
        if (buffer.length < 4 + messageLength) {
          // 消息不完整，等待更多数据
          break;
        }
        
        // 提取完整的消息
        const messageData = buffer.subarray(4, 4 + messageLength);
        buffer = buffer.subarray(4 + messageLength);
        
        try {
          const serverMessage = decodeServerMessage(messageData);
          this.handleServerMessage(serverMessage);
        } catch (e) {
          log('error', 'Failed to decode server message:', e);
        }
      }
    });

    this.socket.on('error', (err) => {
      log('error', 'Unix Socket error:', err.message);
      this.emit('error', err);
    });

    this.socket.on('close', () => {
      log('info', '🔌 Disconnected from server');
      this.emit('disconnected');
    });

    // 连接到Unix Socket
    this.socket.connect(this.socketPath);
  }


  private handleServerMessage(serverMessage: ServerMessage): void {
    if (serverMessage.event) {
      this.handleDexEvent(serverMessage.event);
    } else if (serverMessage.ack) {
      log('debug', 'Received server ack:', serverMessage.ack);
    } else if (serverMessage.error) {
      log('error', 'Server error:', serverMessage.error);
    } else if (serverMessage.heartbeat) {
      log('debug', 'Received server heartbeat:', serverMessage.heartbeat);
    }
  }

  private handleDexEvent(dexEvent: DexEvent): void {
    try {
      // 使用新的protobuf结构直接处理事件
      const eventType = dexEvent.event_type;
      
      // 计算延迟信息
      const nowUs = Date.now() * 1000;
      let grpcRecvUs: number | undefined;
      let eventData: any = null;
      
      // 根据事件类型获取事件数据和元数据
      // 由于每次只会有一个事件字段有值，我们可以遍历所有可能的事件字段
      const eventFields = [
        'pumpfun_trade', 'pumpfun_create', 'pumpfun_migrate',
        'pumpswap_buy', 'pumpswap_sell', 'pumpswap_create_pool', 
        'pumpswap_liquidity_added', 'pumpswap_liquidity_removed',
        'raydium_clmm_swap', 'raydium_amm_v4_swap',
        'orca_whirlpool_swap', 'meteora_pools_swap',
        'meteora_damm_v2_swap', 'meteora_damm_v2_add_liquidity',
        'meteora_damm_v2_remove_liquidity', 'meteora_damm_v2_create_position',
        'meteora_damm_v2_close_position'
      ];
      
      for (const field of eventFields) {
        if (dexEvent[field as keyof DexEvent]) {
          eventData = dexEvent[field as keyof DexEvent];
          grpcRecvUs = eventData?.metadata?.grpc_recv_us;
          break;
        }
      }
      
      let latency: LatencyInfo | undefined;
      if (grpcRecvUs && typeof grpcRecvUs === 'number') {
        const latencyUs = nowUs - grpcRecvUs;
        
        let adjustedLatencyUs: number;
        if (Math.abs(latencyUs) > 3600000000) {
          adjustedLatencyUs = 1000;
        } else if (latencyUs < 0) {
          adjustedLatencyUs = Math.abs(latencyUs);
        } else {
          adjustedLatencyUs = latencyUs;
        }

        latency = {
          grpc_recv_us: grpcRecvUs,
          client_recv_us: nowUs,
          latency_us: adjustedLatencyUs,
          latency_ms: parseFloat((adjustedLatencyUs / 1000).toFixed(2)),
        };
        this.lastLatency = latency;
      }

      // 根据事件类型发射相应事件
      if (eventType) {
        this.emit(eventType, eventData, latency);
      }
    } catch (e) {
      log('error', 'Failed to handle DexEvent:', e);
    }
  }

  getLastLatency(): LatencyInfo | undefined {
    return this.lastLatency;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.end();
      this.socket = null;
    }
  }
}
