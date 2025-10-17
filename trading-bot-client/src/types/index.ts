// 基础类型定义
export interface HealthResponse {
  status: string;
  service: string;
}

// Gas Fee 策略类型定义
export interface GlobalStrategy {
  strategy_type: 'global';
  global_cu_limit: number;
  global_cu_price: number;
  global_buy_tip: number;
  global_sell_tip: number;
}

export interface HighLowStrategy {
  strategy_type: 'high_low';
  cu_limit: number;
  high_cu_price: number;
  low_buy_tip: number;
  low_sell_tip: number;
  low_cu_price: number;
  high_buy_tip: number;
  high_sell_tip: number;
}

// Gas Fee 策略联合类型
export type GasFeeStrategy = GlobalStrategy | HighLowStrategy;

export interface TradeResponse {
  success: boolean;
  signature?: string;
  message: string;
}

export interface BuyRequest {
  mint: string;
  amount_sol: number;
  slippage_bps: number;
  token_type: string;
  recent_blockhash?: string;
  address_lookup_table_account?: {
    key: string;
    addresses: string[];
  };
  durable_nonce?: {
    nonce_account: string;
    current_nonce: string;
  };
  gas_fee_strategy: GasFeeStrategy;
}

export interface SellRequest {
  mint: string;
  amount_tokens: number;
  slippage_bps: number;
  token_type: string;
  recent_blockhash?: string;
  address_lookup_table_account?: {
    key: string;
    addresses: string[];
  };
  durable_nonce?: {
    nonce_account: string;
    current_nonce: string;
  };
  gas_fee_strategy: GasFeeStrategy;
  close_output_token_ata: boolean;
}

// DEX 参数
export interface PumpSwapParams {
  dex_type: 'PumpSwap';
  pool: string,
  base_mint: string,
  quote_mint: string,
  pool_base_token_account: string,
  pool_quote_token_account: string,
  pool_base_token_reserves: number,
  pool_quote_token_reserves: number,
  coin_creator_vault_ata: string,
  coin_creator_vault_authority: string,
}

export interface PumpFunParams {
  dex_type: 'PumpFun';
  bonding_curve_account: string;
  virtual_token_reserves: number;
  virtual_sol_reserves: number;
  real_token_reserves: number;
  real_sol_reserves: number;
  token_total_supply: number;
  complete: boolean;
  creator: string;
  associated_bonding_curve: string;
  creator_vault: string;
  close_token_account_when_sell: boolean;
}

export interface MeteoraDammV2Params {
  dex_type: 'MeteoraDammV2';
  pool: string;
  token_a_vault: string;
  token_b_vault: string;
  token_a_mint: string;
  token_b_mint: string;
  token_a_program: string;
  token_b_program: string;
}

export type DexParams = PumpSwapParams | PumpFunParams | MeteoraDammV2Params;

export interface LatencyInfo {
  grpc_recv_us: number;
  client_recv_us: number;
  latency_us: number;
  latency_ms: number;
}

// 全局执行器配置
export interface ExecutorConfig {
  buyAmountSOL?: number;
  slippageBps?: number;
  buyIntervalSeconds?: number;
}

// 导出订单相关类型
export * from './order';
