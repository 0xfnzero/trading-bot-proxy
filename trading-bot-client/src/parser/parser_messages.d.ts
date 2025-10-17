// Generated TypeScript definitions for parser_proxy messages

export interface DexEvent {
  event_type?: string;
  pumpfun_trade?: PumpFunTradeEvent;
  pumpfun_create?: PumpFunCreateEvent;
  pumpfun_migrate?: PumpFunMigrateEvent;
  pumpswap_buy?: PumpSwapBuyEvent;
  pumpswap_sell?: PumpSwapSellEvent;
  pumpswap_create_pool?: PumpSwapCreatePoolEvent;
  pumpswap_liquidity_added?: PumpSwapLiquidityAddedEvent;
  pumpswap_liquidity_removed?: PumpSwapLiquidityRemovedEvent;
  raydium_clmm_swap?: RaydiumClmmSwapEvent;
  raydium_amm_v4_swap?: RaydiumAmmV4SwapEvent;
  orca_whirlpool_swap?: OrcaWhirlpoolSwapEvent;
  meteora_pools_swap?: MeteoraPoolsSwapEvent;
  meteora_damm_v2_swap?: MeteoraDammV2SwapEvent;
  meteora_damm_v2_add_liquidity?: MeteoraDammV2AddLiquidityEvent;
  meteora_damm_v2_remove_liquidity?: MeteoraDammV2RemoveLiquidityEvent;
  meteora_damm_v2_create_position?: MeteoraDammV2CreatePositionEvent;
  meteora_damm_v2_close_position?: MeteoraDammV2ClosePositionEvent;
}

export interface PumpFunTradeEvent {
  metadata?: EventMetadata;
  mint: string;
  sol_amount: number;
  token_amount: number;
  is_buy: boolean;
  is_created_buy: boolean;
  user: string;
  timestamp: number;
  virtual_sol_reserves: number;
  virtual_token_reserves: number;
  real_sol_reserves: number;
  real_token_reserves: number;
  fee_recipient: string;
  fee_basis_points: number;
  fee: number;
  creator: string;
  creator_fee_basis_points: number;
  creator_fee: number;
  track_volume: boolean;
  total_unclaimed_tokens: number;
  total_claimed_tokens: number;
  current_sol_volume: number;
  last_update_timestamp: number;
  bonding_curve: string;
  associated_bonding_curve: string;
  creator_vault: string;
}

export interface PumpFunCreateEvent {
  metadata?: EventMetadata;
  name: string;
  symbol: string;
  uri: string;
  mint: string;
  bonding_curve: string;
  user: string;
  creator: string;
  timestamp: number;
  virtual_token_reserves: number;
  virtual_sol_reserves: number;
  real_token_reserves: number;
  token_total_supply: number;
}

export interface PumpFunMigrateEvent {
  metadata?: EventMetadata;
  user: string;
  mint: string;
  mint_amount: number;
  sol_amount: number;
  pool_migration_fee: number;
  bonding_curve: string;
  timestamp: number;
  pool: string;
}

export interface PumpSwapBuyEvent {
  metadata?: EventMetadata;
  timestamp: number;
  base_amount_out: number;
  max_quote_amount_in: number;
  user_base_token_reserves: number;
  user_quote_token_reserves: number;
  pool_base_token_reserves: number;
  pool_quote_token_reserves: number;
  quote_amount_in: number;
  lp_fee_basis_points: number;
  lp_fee: number;
  protocol_fee_basis_points: number;
  protocol_fee: number;
  quote_amount_in_with_lp_fee: number;
  user_quote_amount_in: number;
  pool: string;
  user: string;
  user_base_token_account: string;
  user_quote_token_account: string;
  protocol_fee_recipient: string;
  protocol_fee_recipient_token_account: string;
  coin_creator: string;
  coin_creator_fee_basis_points: number;
  coin_creator_fee: number;
  track_volume: boolean;
  total_unclaimed_tokens: number;
  total_claimed_tokens: number;
  current_sol_volume: number;
  last_update_timestamp: number;
  base_mint: string;
  quote_mint: string;
  pool_base_token_account: string;
  pool_quote_token_account: string;
  coin_creator_vault_ata: string;
  coin_creator_vault_authority: string;
  base_token_program: string;
  quote_token_program: string;
}

export interface PumpSwapSellEvent {
  metadata?: EventMetadata;
  timestamp: number;
  base_amount_in: number;
  min_quote_amount_out: number;
  user_base_token_reserves: number;
  user_quote_token_reserves: number;
  pool_base_token_reserves: number;
  pool_quote_token_reserves: number;
  quote_amount_out: number;
  lp_fee_basis_points: number;
  lp_fee: number;
  protocol_fee_basis_points: number;
  protocol_fee: number;
  quote_amount_out_without_lp_fee: number;
  user_quote_amount_out: number;
  pool: string;
  user: string;
  user_base_token_account: string;
  user_quote_token_account: string;
  protocol_fee_recipient: string;
  protocol_fee_recipient_token_account: string;
  coin_creator: string;
  coin_creator_fee_basis_points: number;
  coin_creator_fee: number;
  base_mint: string;
  quote_mint: string;
  pool_base_token_account: string;
  pool_quote_token_account: string;
  coin_creator_vault_ata: string;
  coin_creator_vault_authority: string;
  base_token_program: string;
  quote_token_program: string;
}

export interface PumpSwapCreatePoolEvent {
  metadata?: EventMetadata;
  timestamp: number;
  index: number;
  creator: string;
  base_mint: string;
  quote_mint: string;
  base_mint_decimals: number;
  quote_mint_decimals: number;
  base_amount_in: number;
  quote_amount_in: number;
  pool_base_amount: number;
  pool_quote_amount: number;
  minimum_liquidity: number;
  initial_liquidity: number;
  lp_token_amount_out: number;
  pool_bump: number;
  pool: string;
  lp_mint: string;
  user_base_token_account: string;
  user_quote_token_account: string;
  coin_creator: string;
}

export interface PumpSwapLiquidityAddedEvent {
  metadata?: EventMetadata;
  timestamp: number;
  lp_token_amount_out: number;
  max_base_amount_in: number;
  max_quote_amount_in: number;
  user_base_token_reserves: number;
  user_quote_token_reserves: number;
  pool_base_token_reserves: number;
  pool_quote_token_reserves: number;
  base_amount_in: number;
  quote_amount_in: number;
  lp_mint_supply: number;
  pool: string;
  user: string;
  user_base_token_account: string;
  user_quote_token_account: string;
  user_pool_token_account: string;
}

export interface PumpSwapLiquidityRemovedEvent {
  metadata?: EventMetadata;
  timestamp: number;
  lp_token_amount_in: number;
  min_base_amount_out: number;
  min_quote_amount_out: number;
  user_base_token_reserves: number;
  user_quote_token_reserves: number;
  pool_base_token_reserves: number;
  pool_quote_token_reserves: number;
  base_amount_out: number;
  quote_amount_out: number;
  lp_mint_supply: number;
  pool: string;
  user: string;
  user_base_token_account: string;
  user_quote_token_account: string;
  user_pool_token_account: string;
}

export interface RaydiumClmmSwapEvent {
  metadata?: EventMetadata;
  pool_state: string;
  sender: string;
  token_account_0: string;
  token_account_1: string;
  amount_0: number;
  transfer_fee_0: number;
  amount_1: number;
  transfer_fee_1: number;
  zero_for_one: boolean;
  sqrt_price_x64: number;
  liquidity: number;
  tick: number;
}

export interface RaydiumAmmV4SwapEvent {
  metadata?: EventMetadata;
  amount_in: number;
  minimum_amount_out: number;
  max_amount_in: number;
  amount_out: number;
  token_program: string;
  amm: string;
  amm_authority: string;
  amm_open_orders: string;
  amm_target_orders: string;
  pool_coin_token_account: string;
  pool_pc_token_account: string;
  serum_program: string;
  serum_market: string;
  serum_bids: string;
  serum_asks: string;
  serum_event_queue: string;
  serum_coin_vault_account: string;
  serum_pc_vault_account: string;
  serum_vault_signer: string;
  user_source_token_account: string;
  user_destination_token_account: string;
  user_source_owner: string;
}

export interface OrcaWhirlpoolSwapEvent {
  metadata?: EventMetadata;
  whirlpool: string;
  a_to_b: boolean;
  pre_sqrt_price: number;
  post_sqrt_price: number;
  input_amount: number;
  output_amount: number;
  input_transfer_fee: number;
  output_transfer_fee: number;
  lp_fee: number;
  protocol_fee: number;
}

export interface MeteoraPoolsSwapEvent {
  metadata?: EventMetadata;
  in_amount: number;
  out_amount: number;
  trade_fee: number;
  admin_fee: number;
  host_fee: number;
}

export interface EventMetadata {
  signature?: string;
  slot?: number;
  tx_index?: number;
  block_time_us?: number;
  grpc_recv_us?: number;
}

export interface ClientMessage {
  message?: {
    register?: ClientRegister;
    heartbeat?: ClientHeartbeat;
    disconnect?: ClientDisconnect;
    request?: ClientRequest;
  };
}

export interface ServerMessage {
  ack?: ServerAck;
  event?: DexEvent;
  error?: ServerError;
  heartbeat?: ServerHeartbeat;
}

export interface ClientRegister {
  client_id?: string;
  version?: string;
  subscribed_events?: string[];
}

export interface ClientHeartbeat {
  timestamp?: number;
}

export interface ClientDisconnect {
  reason?: string;
}

export interface ClientRequest {
  request_id?: string;
  request_type?: string;
  request_data?: string;
}

export interface ServerAck {
  message_id?: string;
  success?: boolean;
  message?: string;
}

export interface ServerError {
  error_code?: string;
  error_message?: string;
  request_id?: string;
}

export interface ServerHeartbeat {
  timestamp?: number;
  connected_clients?: number;
}

// ====================== Meteora DAMM V2 事件 ======================

export interface MeteoraDammV2SwapEvent {
  metadata?: EventMetadata;
  pool: string;
  trade_direction: number;
  has_referral: boolean;
  amount_in: number;
  minimum_amount_out: number;
  output_amount: number;
  next_sqrt_price: number;
  lp_fee: number;
  protocol_fee: number;
  partner_fee: number;
  referral_fee: number;
  actual_amount_in: number;
  current_timestamp: number;
  token_a_vault: string;
  token_b_vault: string;
  token_a_mint: string;
  token_b_mint: string;
  token_a_program: string;
  token_b_program: string;
}

export interface MeteoraDammV2AddLiquidityEvent {
  metadata?: EventMetadata;
  pool: string;
  position: string;
  owner: string;
  liquidity_delta: number;
  token_a_amount_threshold: number;
  token_b_amount_threshold: number;
  token_a_amount: number;
  token_b_amount: number;
  total_amount_a: number;
  total_amount_b: number;
}

export interface MeteoraDammV2RemoveLiquidityEvent {
  metadata?: EventMetadata;
  pool: string;
  position: string;
  owner: string;
  liquidity_delta: number;
  token_a_amount_threshold: number;
  token_b_amount_threshold: number;
  token_a_amount: number;
  token_b_amount: number;
}

export interface MeteoraDammV2CreatePositionEvent {
  metadata?: EventMetadata;
  pool: string;
  owner: string;
  position: string;
  position_nft_mint: string;
}

export interface MeteoraDammV2ClosePositionEvent {
  metadata?: EventMetadata;
  pool: string;
  owner: string;
  position: string;
  position_nft_mint: string;
}

// Export functions - 只保留实际使用的解码函数
export function decodeServerMessage(buffer: Uint8Array): ServerMessage;