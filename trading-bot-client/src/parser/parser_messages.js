
export function decodeEventMetadata(binary) {
  return _decodeEventMetadata(wrapByteBuffer(binary));
}

function _decodeEventMetadata(bb) {
  let message = {};

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string signature = 1;
      case 1: {
        message.signature = readString(bb, readVarint32(bb));
        break;
      }

      // optional uint64 slot = 2;
      case 2: {
        message.slot = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional uint64 tx_index = 3;
      case 3: {
        message.tx_index = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional int64 block_time_us = 4;
      case 4: {
        message.block_time_us = readVarint64(bb, /* unsigned */ false);
        break;
      }

      // optional int64 grpc_recv_us = 5;
      case 5: {
        message.grpc_recv_us = readVarint64(bb, /* unsigned */ false);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}


export function decodePumpFunTradeEvent(binary) {
  return _decodePumpFunTradeEvent(wrapByteBuffer(binary));
}

function _decodePumpFunTradeEvent(bb) {
  // Initialize all fields with their default values
  let message = {
    metadata: null,
    mint: "",
    sol_amount: 0,
    token_amount: 0,
    is_buy: false,
    is_created_buy: false,
    user: "",
    timestamp: 0,
    virtual_sol_reserves: 0,
    virtual_token_reserves: 0,
    real_sol_reserves: 0,
    real_token_reserves: 0,
    fee_recipient: "",
    fee_basis_points: 0,
    fee: 0,
    creator: "",
    creator_fee_basis_points: 0,
    creator_fee: 0,
    track_volume: false,
    total_unclaimed_tokens: 0,
    total_claimed_tokens: 0,
    current_sol_volume: 0,
    last_update_timestamp: 0,
    bonding_curve: "",
    associated_bonding_curve: "",
    creator_vault: ""
  };

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional EventMetadata metadata = 1;
      case 1: {
        let limit = pushTemporaryLength(bb);
        message.metadata = _decodeEventMetadata(bb);
        bb.limit = limit;
        break;
      }

      // optional string mint = 2;
      case 2: {
        message.mint = readString(bb, readVarint32(bb));
        break;
      }

      // optional uint64 sol_amount = 3;
      case 3: {
        message.sol_amount = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional uint64 token_amount = 4;
      case 4: {
        message.token_amount = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional bool is_buy = 5;
      case 5: {
        message.is_buy = !!readByte(bb);
        break;
      }

      // optional bool is_created_buy = 6;
      case 6: {
        message.is_created_buy = !!readByte(bb);
        break;
      }

      // optional string user = 7;
      case 7: {
        message.user = readString(bb, readVarint32(bb));
        break;
      }

      // optional int64 timestamp = 8;
      case 8: {
        message.timestamp = readVarint64(bb, /* unsigned */ false);
        break;
      }

      // optional uint64 virtual_sol_reserves = 9;
      case 9: {
        message.virtual_sol_reserves = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional uint64 virtual_token_reserves = 10;
      case 10: {
        message.virtual_token_reserves = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional uint64 real_sol_reserves = 11;
      case 11: {
        message.real_sol_reserves = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional uint64 real_token_reserves = 12;
      case 12: {
        message.real_token_reserves = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional string fee_recipient = 13;
      case 13: {
        message.fee_recipient = readString(bb, readVarint32(bb));
        break;
      }

      // optional uint64 fee_basis_points = 14;
      case 14: {
        message.fee_basis_points = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional uint64 fee = 15;
      case 15: {
        message.fee = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional string creator = 16;
      case 16: {
        message.creator = readString(bb, readVarint32(bb));
        break;
      }

      // optional uint64 creator_fee_basis_points = 17;
      case 17: {
        message.creator_fee_basis_points = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional uint64 creator_fee = 18;
      case 18: {
        message.creator_fee = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional bool track_volume = 19;
      case 19: {
        message.track_volume = !!readByte(bb);
        break;
      }

      // optional uint64 total_unclaimed_tokens = 20;
      case 20: {
        message.total_unclaimed_tokens = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional uint64 total_claimed_tokens = 21;
      case 21: {
        message.total_claimed_tokens = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional uint64 current_sol_volume = 22;
      case 22: {
        message.current_sol_volume = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional int64 last_update_timestamp = 23;
      case 23: {
        message.last_update_timestamp = readVarint64(bb, /* unsigned */ false);
        break;
      }

      // optional string bonding_curve = 24;
      case 24: {
        message.bonding_curve = readString(bb, readVarint32(bb));
        break;
      }

      // optional string associated_bonding_curve = 25;
      case 25: {
        message.associated_bonding_curve = readString(bb, readVarint32(bb));
        break;
      }

      // optional string creator_vault = 26;
      case 26: {
        message.creator_vault = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}


export function decodePumpFunCreateEvent(binary) {
  return _decodePumpFunCreateEvent(wrapByteBuffer(binary));
}

function _decodePumpFunCreateEvent(bb) {
  // Initialize all fields with their default values
  let message = {
    metadata: null,
    name: "",
    symbol: "",
    uri: "",
    mint: "",
    bonding_curve: "",
    user: "",
    creator: "",
    timestamp: 0,
    virtual_token_reserves: 0,
    virtual_sol_reserves: 0,
    real_token_reserves: 0,
    token_total_supply: 0
  };

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional EventMetadata metadata = 1;
      case 1: {
        let limit = pushTemporaryLength(bb);
        message.metadata = _decodeEventMetadata(bb);
        bb.limit = limit;
        break;
      }

      // optional string name = 2;
      case 2: {
        message.name = readString(bb, readVarint32(bb));
        break;
      }

      // optional string symbol = 3;
      case 3: {
        message.symbol = readString(bb, readVarint32(bb));
        break;
      }

      // optional string uri = 4;
      case 4: {
        message.uri = readString(bb, readVarint32(bb));
        break;
      }

      // optional string mint = 5;
      case 5: {
        message.mint = readString(bb, readVarint32(bb));
        break;
      }

      // optional string bonding_curve = 6;
      case 6: {
        message.bonding_curve = readString(bb, readVarint32(bb));
        break;
      }

      // optional string user = 7;
      case 7: {
        message.user = readString(bb, readVarint32(bb));
        break;
      }

      // optional string creator = 8;
      case 8: {
        message.creator = readString(bb, readVarint32(bb));
        break;
      }

      // optional int64 timestamp = 9;
      case 9: {
        message.timestamp = readVarint64(bb, /* unsigned */ false);
        break;
      }

      // optional uint64 virtual_token_reserves = 10;
      case 10: {
        message.virtual_token_reserves = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional uint64 virtual_sol_reserves = 11;
      case 11: {
        message.virtual_sol_reserves = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional uint64 real_token_reserves = 12;
      case 12: {
        message.real_token_reserves = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional uint64 token_total_supply = 13;
      case 13: {
        message.token_total_supply = readVarint64(bb, /* unsigned */ true);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}


export function decodeRaydiumClmmSwapEvent(binary) {
  return _decodeRaydiumClmmSwapEvent(wrapByteBuffer(binary));
}

function _decodeRaydiumClmmSwapEvent(bb) {
  // Initialize all fields with their default values
  let message = {
    metadata: null,
    pool_state: "",
    sender: "",
    token_account_0: "",
    token_account_1: "",
    amount_0: 0,
    transfer_fee_0: 0,
    amount_1: 0,
    transfer_fee_1: 0,
    zero_for_one: false,
    sqrt_price_x64: 0,
    liquidity: 0,
    tick: 0
  };

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional EventMetadata metadata = 1;
      case 1: {
        let limit = pushTemporaryLength(bb);
        message.metadata = _decodeEventMetadata(bb);
        bb.limit = limit;
        break;
      }

      // optional string pool_state = 2;
      case 2: {
        message.pool_state = readString(bb, readVarint32(bb));
        break;
      }

      // optional string sender = 3;
      case 3: {
        message.sender = readString(bb, readVarint32(bb));
        break;
      }

      // optional string token_account_0 = 4;
      case 4: {
        message.token_account_0 = readString(bb, readVarint32(bb));
        break;
      }

      // optional string token_account_1 = 5;
      case 5: {
        message.token_account_1 = readString(bb, readVarint32(bb));
        break;
      }

      // optional uint64 amount_0 = 6;
      case 6: {
        message.amount_0 = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional uint64 transfer_fee_0 = 7;
      case 7: {
        message.transfer_fee_0 = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional uint64 amount_1 = 8;
      case 8: {
        message.amount_1 = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional uint64 transfer_fee_1 = 9;
      case 9: {
        message.transfer_fee_1 = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional bool zero_for_one = 10;
      case 10: {
        message.zero_for_one = !!readByte(bb);
        break;
      }

      // optional uint64 sqrt_price_x64 = 11;
      case 11: {
        message.sqrt_price_x64 = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional uint64 liquidity = 12;
      case 12: {
        message.liquidity = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional int32 tick = 13;
      case 13: {
        message.tick = readVarint32(bb);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}


export function decodeRaydiumAmmV4SwapEvent(binary) {
  return _decodeRaydiumAmmV4SwapEvent(wrapByteBuffer(binary));
}

function _decodeRaydiumAmmV4SwapEvent(bb) {
  // Initialize all fields with their default values
  let message = {
    metadata: null,
    amount_in: 0,
    minimum_amount_out: 0,
    max_amount_in: 0,
    amount_out: 0,
    token_program: "",
    amm: "",
    amm_authority: "",
    amm_open_orders: "",
    amm_target_orders: "",
    pool_coin_token_account: "",
    pool_pc_token_account: "",
    serum_program: "",
    serum_market: "",
    serum_bids: "",
    serum_asks: "",
    serum_event_queue: "",
    serum_coin_vault_account: "",
    serum_pc_vault_account: "",
    serum_vault_signer: "",
    user_source_token_account: "",
    user_destination_token_account: "",
    user_source_owner: ""
  };

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional EventMetadata metadata = 1;
      case 1: {
        let limit = pushTemporaryLength(bb);
        message.metadata = _decodeEventMetadata(bb);
        bb.limit = limit;
        break;
      }

      // optional uint64 amount_in = 2;
      case 2: {
        message.amount_in = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional uint64 minimum_amount_out = 3;
      case 3: {
        message.minimum_amount_out = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional uint64 max_amount_in = 4;
      case 4: {
        message.max_amount_in = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional uint64 amount_out = 5;
      case 5: {
        message.amount_out = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional string token_program = 6;
      case 6: {
        message.token_program = readString(bb, readVarint32(bb));
        break;
      }

      // optional string amm = 7;
      case 7: {
        message.amm = readString(bb, readVarint32(bb));
        break;
      }

      // optional string amm_authority = 8;
      case 8: {
        message.amm_authority = readString(bb, readVarint32(bb));
        break;
      }

      // optional string amm_open_orders = 9;
      case 9: {
        message.amm_open_orders = readString(bb, readVarint32(bb));
        break;
      }

      // optional string amm_target_orders = 10;
      case 10: {
        message.amm_target_orders = readString(bb, readVarint32(bb));
        break;
      }

      // optional string pool_coin_token_account = 11;
      case 11: {
        message.pool_coin_token_account = readString(bb, readVarint32(bb));
        break;
      }

      // optional string pool_pc_token_account = 12;
      case 12: {
        message.pool_pc_token_account = readString(bb, readVarint32(bb));
        break;
      }

      // optional string serum_program = 13;
      case 13: {
        message.serum_program = readString(bb, readVarint32(bb));
        break;
      }

      // optional string serum_market = 14;
      case 14: {
        message.serum_market = readString(bb, readVarint32(bb));
        break;
      }

      // optional string serum_bids = 15;
      case 15: {
        message.serum_bids = readString(bb, readVarint32(bb));
        break;
      }

      // optional string serum_asks = 16;
      case 16: {
        message.serum_asks = readString(bb, readVarint32(bb));
        break;
      }

      // optional string serum_event_queue = 17;
      case 17: {
        message.serum_event_queue = readString(bb, readVarint32(bb));
        break;
      }

      // optional string serum_coin_vault_account = 18;
      case 18: {
        message.serum_coin_vault_account = readString(bb, readVarint32(bb));
        break;
      }

      // optional string serum_pc_vault_account = 19;
      case 19: {
        message.serum_pc_vault_account = readString(bb, readVarint32(bb));
        break;
      }

      // optional string serum_vault_signer = 20;
      case 20: {
        message.serum_vault_signer = readString(bb, readVarint32(bb));
        break;
      }

      // optional string user_source_token_account = 21;
      case 21: {
        message.user_source_token_account = readString(bb, readVarint32(bb));
        break;
      }

      // optional string user_destination_token_account = 22;
      case 22: {
        message.user_destination_token_account = readString(bb, readVarint32(bb));
        break;
      }

      // optional string user_source_owner = 23;
      case 23: {
        message.user_source_owner = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}


export function decodeOrcaWhirlpoolSwapEvent(binary) {
  return _decodeOrcaWhirlpoolSwapEvent(wrapByteBuffer(binary));
}

function _decodeOrcaWhirlpoolSwapEvent(bb) {
  // Initialize all fields with their default values
  let message = {
    metadata: null,
    whirlpool: "",
    a_to_b: false,
    pre_sqrt_price: 0,
    post_sqrt_price: 0,
    input_amount: 0,
    output_amount: 0,
    input_transfer_fee: 0,
    output_transfer_fee: 0,
    lp_fee: 0,
    protocol_fee: 0
  };

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional EventMetadata metadata = 1;
      case 1: {
        let limit = pushTemporaryLength(bb);
        message.metadata = _decodeEventMetadata(bb);
        bb.limit = limit;
        break;
      }

      // optional string whirlpool = 2;
      case 2: {
        message.whirlpool = readString(bb, readVarint32(bb));
        break;
      }

      // optional bool a_to_b = 3;
      case 3: {
        message.a_to_b = !!readByte(bb);
        break;
      }

      // optional uint64 pre_sqrt_price = 4;
      case 4: {
        message.pre_sqrt_price = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional uint64 post_sqrt_price = 5;
      case 5: {
        message.post_sqrt_price = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional uint64 input_amount = 6;
      case 6: {
        message.input_amount = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional uint64 output_amount = 7;
      case 7: {
        message.output_amount = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional uint64 input_transfer_fee = 8;
      case 8: {
        message.input_transfer_fee = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional uint64 output_transfer_fee = 9;
      case 9: {
        message.output_transfer_fee = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional uint64 lp_fee = 10;
      case 10: {
        message.lp_fee = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional uint64 protocol_fee = 11;
      case 11: {
        message.protocol_fee = readVarint64(bb, /* unsigned */ true);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}


export function decodeMeteoraPoolsSwapEvent(binary) {
  return _decodeMeteoraPoolsSwapEvent(wrapByteBuffer(binary));
}

function _decodeMeteoraPoolsSwapEvent(bb) {
  // Initialize all fields with their default values
  let message = {
    metadata: null,
    in_amount: 0,
    out_amount: 0,
    trade_fee: 0,
    admin_fee: 0,
    host_fee: 0
  };

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional EventMetadata metadata = 1;
      case 1: {
        let limit = pushTemporaryLength(bb);
        message.metadata = _decodeEventMetadata(bb);
        bb.limit = limit;
        break;
      }

      // optional uint64 in_amount = 2;
      case 2: {
        message.in_amount = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional uint64 out_amount = 3;
      case 3: {
        message.out_amount = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional uint64 trade_fee = 4;
      case 4: {
        message.trade_fee = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional uint64 admin_fee = 5;
      case 5: {
        message.admin_fee = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional uint64 host_fee = 6;
      case 6: {
        message.host_fee = readVarint64(bb, /* unsigned */ true);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export function decodeDexEvent(binary) {
  return _decodeDexEvent(wrapByteBuffer(binary));
}

function _decodeDexEvent(bb) {
  let message = {};

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string event_type = 1;
      case 1: {
        message.event_type = readString(bb, readVarint32(bb));
        break;
      }

      // optional PumpFunTradeEvent pumpfun_trade = 2;
      case 2: {
        let limit = pushTemporaryLength(bb);
        message.pumpfun_trade = _decodePumpFunTradeEvent(bb);
        bb.limit = limit;
        break;
      }

      // optional PumpFunCreateEvent pumpfun_create = 3;
      case 3: {
        let limit = pushTemporaryLength(bb);
        message.pumpfun_create = _decodePumpFunCreateEvent(bb);
        bb.limit = limit;
        break;
      }

      // optional PumpFunMigrateEvent pumpfun_migrate = 4;
      case 4: {
        let limit = pushTemporaryLength(bb);
        message.pumpfun_migrate = _decodePumpFunMigrateEvent(bb);
        bb.limit = limit;
        break;
      }

      // optional PumpSwapBuyEvent pumpswap_buy = 5;
      case 5: {
        let limit = pushTemporaryLength(bb);
        message.pumpswap_buy = _decodePumpSwapBuyEvent(bb);
        bb.limit = limit;
        break;
      }

      // optional PumpSwapSellEvent pumpswap_sell = 6;
      case 6: {
        let limit = pushTemporaryLength(bb);
        message.pumpswap_sell = _decodePumpSwapSellEvent(bb);
        bb.limit = limit;
        break;
      }

      // optional PumpSwapCreatePoolEvent pumpswap_create_pool = 7;
      case 7: {
        let limit = pushTemporaryLength(bb);
        message.pumpswap_create_pool = _decodePumpSwapCreatePoolEvent(bb);
        bb.limit = limit;
        break;
      }

      // optional PumpSwapLiquidityAddedEvent pumpswap_liquidity_added = 8;
      case 8: {
        let limit = pushTemporaryLength(bb);
        message.pumpswap_liquidity_added = _decodePumpSwapLiquidityAddedEvent(bb);
        bb.limit = limit;
        break;
      }

      // optional PumpSwapLiquidityRemovedEvent pumpswap_liquidity_removed = 9;
      case 9: {
        let limit = pushTemporaryLength(bb);
        message.pumpswap_liquidity_removed = _decodePumpSwapLiquidityRemovedEvent(bb);
        bb.limit = limit;
        break;
      }

      // optional RaydiumClmmSwapEvent raydium_clmm_swap = 10;
      case 10: {
        let limit = pushTemporaryLength(bb);
        message.raydium_clmm_swap = _decodeRaydiumClmmSwapEvent(bb);
        bb.limit = limit;
        break;
      }

      // optional RaydiumAmmV4SwapEvent raydium_amm_v4_swap = 11;
      case 11: {
        let limit = pushTemporaryLength(bb);
        message.raydium_amm_v4_swap = _decodeRaydiumAmmV4SwapEvent(bb);
        bb.limit = limit;
        break;
      }

      // optional OrcaWhirlpoolSwapEvent orca_whirlpool_swap = 12;
      case 12: {
        let limit = pushTemporaryLength(bb);
        message.orca_whirlpool_swap = _decodeOrcaWhirlpoolSwapEvent(bb);
        bb.limit = limit;
        break;
      }

      // optional MeteoraPoolsSwapEvent meteora_pools_swap = 13;
      case 13: {
        let limit = pushTemporaryLength(bb);
        message.meteora_pools_swap = _decodeMeteoraPoolsSwapEvent(bb);
        bb.limit = limit;
        break;
      }

      // optional MeteoraDammV2SwapEvent meteora_damm_v2_swap = 14;
      case 14: {
        let limit = pushTemporaryLength(bb);
        message.meteora_damm_v2_swap = _decodeMeteoraDammV2SwapEvent(bb);
        bb.limit = limit;
        break;
      }

      // optional MeteoraDammV2AddLiquidityEvent meteora_damm_v2_add_liquidity = 15;
      case 15: {
        let limit = pushTemporaryLength(bb);
        message.meteora_damm_v2_add_liquidity = _decodeMeteoraDammV2AddLiquidityEvent(bb);
        bb.limit = limit;
        break;
      }

      // optional MeteoraDammV2RemoveLiquidityEvent meteora_damm_v2_remove_liquidity = 16;
      case 16: {
        let limit = pushTemporaryLength(bb);
        message.meteora_damm_v2_remove_liquidity = _decodeMeteoraDammV2RemoveLiquidityEvent(bb);
        bb.limit = limit;
        break;
      }

      // optional MeteoraDammV2CreatePositionEvent meteora_damm_v2_create_position = 17;
      case 17: {
        let limit = pushTemporaryLength(bb);
        message.meteora_damm_v2_create_position = _decodeMeteoraDammV2CreatePositionEvent(bb);
        bb.limit = limit;
        break;
      }

      // optional MeteoraDammV2ClosePositionEvent meteora_damm_v2_close_position = 18;
      case 18: {
        let limit = pushTemporaryLength(bb);
        message.meteora_damm_v2_close_position = _decodeMeteoraDammV2ClosePositionEvent(bb);
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export function decodeServerMessage(binary) {
  return _decodeServerMessage(wrapByteBuffer(binary));
}

// ====================== PumpFun Migrate Event ======================

export function decodePumpFunMigrateEvent(binary) {
  return _decodePumpFunMigrateEvent(wrapByteBuffer(binary));
}

function _decodePumpFunMigrateEvent(bb) {
  let message = {
    metadata: null,
    user: "",
    mint: "",
    mint_amount: 0,
    sol_amount: 0,
    pool_migration_fee: 0,
    bonding_curve: "",
    timestamp: 0,
    pool: ""
  };

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      case 1: {
        let limit = pushTemporaryLength(bb);
        message.metadata = _decodeEventMetadata(bb);
        bb.limit = limit;
        break;
      }

      case 2: {
        message.user = readString(bb, readVarint32(bb));
        break;
      }

      case 3: {
        message.mint = readString(bb, readVarint32(bb));
        break;
      }

      case 4: {
        message.mint_amount = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 5: {
        message.sol_amount = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 6: {
        message.pool_migration_fee = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 7: {
        message.bonding_curve = readString(bb, readVarint32(bb));
        break;
      }

      case 8: {
        message.timestamp = readVarint64(bb, /* unsigned */ false);
        break;
      }

      case 9: {
        message.pool = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

// ====================== PumpSwap Events ======================

export function decodePumpSwapBuyEvent(binary) {
  return _decodePumpSwapBuyEvent(wrapByteBuffer(binary));
}

function _decodePumpSwapBuyEvent(bb) {
  let message = {
    metadata: null,
    timestamp: 0,
    base_amount_out: 0,
    max_quote_amount_in: 0,
    user_base_token_reserves: 0,
    user_quote_token_reserves: 0,
    pool_base_token_reserves: 0,
    pool_quote_token_reserves: 0,
    quote_amount_in: 0,
    lp_fee_basis_points: 0,
    lp_fee: 0,
    protocol_fee_basis_points: 0,
    protocol_fee: 0,
    quote_amount_in_with_lp_fee: 0,
    user_quote_amount_in: 0,
    pool: "",
    user: "",
    user_base_token_account: "",
    user_quote_token_account: "",
    protocol_fee_recipient: "",
    protocol_fee_recipient_token_account: "",
    coin_creator: "",
    coin_creator_fee_basis_points: 0,
    coin_creator_fee: 0,
    track_volume: false,
    total_unclaimed_tokens: 0,
    total_claimed_tokens: 0,
    current_sol_volume: 0,
    last_update_timestamp: 0,
    base_mint: "",
    quote_mint: "",
    pool_base_token_account: "",
    pool_quote_token_account: "",
    coin_creator_vault_ata: "",
    coin_creator_vault_authority: "",
    base_token_program: "",
    quote_token_program: ""
  };

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      case 1: {
        let limit = pushTemporaryLength(bb);
        message.metadata = _decodeEventMetadata(bb);
        bb.limit = limit;
        break;
      }

      case 2: {
        message.timestamp = readVarint64(bb, /* unsigned */ false);
        break;
      }

      case 3: {
        message.base_amount_out = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 4: {
        message.max_quote_amount_in = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 5: {
        message.user_base_token_reserves = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 6: {
        message.user_quote_token_reserves = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 7: {
        message.pool_base_token_reserves = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 8: {
        message.pool_quote_token_reserves = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 9: {
        message.quote_amount_in = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 10: {
        message.lp_fee_basis_points = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 11: {
        message.lp_fee = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 12: {
        message.protocol_fee_basis_points = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 13: {
        message.protocol_fee = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 14: {
        message.quote_amount_in_with_lp_fee = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 15: {
        message.user_quote_amount_in = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 16: {
        message.pool = readString(bb, readVarint32(bb));
        break;
      }

      case 17: {
        message.user = readString(bb, readVarint32(bb));
        break;
      }

      case 18: {
        message.user_base_token_account = readString(bb, readVarint32(bb));
        break;
      }

      case 19: {
        message.user_quote_token_account = readString(bb, readVarint32(bb));
        break;
      }

      case 20: {
        message.protocol_fee_recipient = readString(bb, readVarint32(bb));
        break;
      }

      case 21: {
        message.protocol_fee_recipient_token_account = readString(bb, readVarint32(bb));
        break;
      }

      case 22: {
        message.coin_creator = readString(bb, readVarint32(bb));
        break;
      }

      case 23: {
        message.coin_creator_fee_basis_points = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 24: {
        message.coin_creator_fee = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 25: {
        message.track_volume = !!readByte(bb);
        break;
      }

      case 26: {
        message.total_unclaimed_tokens = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 27: {
        message.total_claimed_tokens = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 28: {
        message.current_sol_volume = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 29: {
        message.last_update_timestamp = readVarint64(bb, /* unsigned */ false);
        break;
      }

      case 30: {
        message.base_mint = readString(bb, readVarint32(bb));
        break;
      }

      case 31: {
        message.quote_mint = readString(bb, readVarint32(bb));
        break;
      }

      case 32: {
        message.pool_base_token_account = readString(bb, readVarint32(bb));
        break;
      }

      case 33: {
        message.pool_quote_token_account = readString(bb, readVarint32(bb));
        break;
      }

      case 34: {
        message.coin_creator_vault_ata = readString(bb, readVarint32(bb));
        break;
      }

      case 35: {
        message.coin_creator_vault_authority = readString(bb, readVarint32(bb));
        break;
      }

      case 36: {
        message.base_token_program = readString(bb, readVarint32(bb));
        break;
      }

      case 37: {
        message.quote_token_program = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export function decodePumpSwapSellEvent(binary) {
  return _decodePumpSwapSellEvent(wrapByteBuffer(binary));
}

function _decodePumpSwapSellEvent(bb) {
  let message = {
    metadata: null,
    timestamp: 0,
    base_amount_in: 0,
    min_quote_amount_out: 0,
    user_base_token_reserves: 0,
    user_quote_token_reserves: 0,
    pool_base_token_reserves: 0,
    pool_quote_token_reserves: 0,
    quote_amount_out: 0,
    lp_fee_basis_points: 0,
    lp_fee: 0,
    protocol_fee_basis_points: 0,
    protocol_fee: 0,
    quote_amount_out_without_lp_fee: 0,
    user_quote_amount_out: 0,
    pool: "",
    user: "",
    user_base_token_account: "",
    user_quote_token_account: "",
    protocol_fee_recipient: "",
    protocol_fee_recipient_token_account: "",
    coin_creator: "",
    coin_creator_fee_basis_points: 0,
    coin_creator_fee: 0,
    base_mint: "",
    quote_mint: "",
    pool_base_token_account: "",
    pool_quote_token_account: "",
    coin_creator_vault_ata: "",
    coin_creator_vault_authority: "",
    base_token_program: "",
    quote_token_program: ""
  };

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      case 1: {
        let limit = pushTemporaryLength(bb);
        message.metadata = _decodeEventMetadata(bb);
        bb.limit = limit;
        break;
      }

      case 2: {
        message.timestamp = readVarint64(bb, /* unsigned */ false);
        break;
      }

      case 3: {
        message.base_amount_in = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 4: {
        message.min_quote_amount_out = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 5: {
        message.user_base_token_reserves = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 6: {
        message.user_quote_token_reserves = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 7: {
        message.pool_base_token_reserves = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 8: {
        message.pool_quote_token_reserves = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 9: {
        message.quote_amount_out = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 10: {
        message.lp_fee_basis_points = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 11: {
        message.lp_fee = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 12: {
        message.protocol_fee_basis_points = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 13: {
        message.protocol_fee = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 14: {
        message.quote_amount_out_without_lp_fee = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 15: {
        message.user_quote_amount_out = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 16: {
        message.pool = readString(bb, readVarint32(bb));
        break;
      }

      case 17: {
        message.user = readString(bb, readVarint32(bb));
        break;
      }

      case 18: {
        message.user_base_token_account = readString(bb, readVarint32(bb));
        break;
      }

      case 19: {
        message.user_quote_token_account = readString(bb, readVarint32(bb));
        break;
      }

      case 20: {
        message.protocol_fee_recipient = readString(bb, readVarint32(bb));
        break;
      }

      case 21: {
        message.protocol_fee_recipient_token_account = readString(bb, readVarint32(bb));
        break;
      }

      case 22: {
        message.coin_creator = readString(bb, readVarint32(bb));
        break;
      }

      case 23: {
        message.coin_creator_fee_basis_points = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 24: {
        message.coin_creator_fee = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 25: {
        message.base_mint = readString(bb, readVarint32(bb));
        break;
      }

      case 26: {
        message.quote_mint = readString(bb, readVarint32(bb));
        break;
      }

      case 27: {
        message.pool_base_token_account = readString(bb, readVarint32(bb));
        break;
      }

      case 28: {
        message.pool_quote_token_account = readString(bb, readVarint32(bb));
        break;
      }

      case 29: {
        message.coin_creator_vault_ata = readString(bb, readVarint32(bb));
        break;
      }

      case 30: {
        message.coin_creator_vault_authority = readString(bb, readVarint32(bb));
        break;
      }

      case 31: {
        message.base_token_program = readString(bb, readVarint32(bb));
        break;
      }

      case 32: {
        message.quote_token_program = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export function decodePumpSwapCreatePoolEvent(binary) {
  return _decodePumpSwapCreatePoolEvent(wrapByteBuffer(binary));
}

function _decodePumpSwapCreatePoolEvent(bb) {
  let message = {
    metadata: null,
    timestamp: 0,
    index: 0,
    creator: "",
    base_mint: "",
    quote_mint: "",
    base_mint_decimals: 0,
    quote_mint_decimals: 0,
    base_amount_in: 0,
    quote_amount_in: 0,
    pool_base_amount: 0,
    pool_quote_amount: 0,
    minimum_liquidity: 0,
    initial_liquidity: 0,
    lp_token_amount_out: 0,
    pool_bump: 0,
    pool: "",
    lp_mint: "",
    user_base_token_account: "",
    user_quote_token_account: "",
    coin_creator: ""
  };

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      case 1: {
        let limit = pushTemporaryLength(bb);
        message.metadata = _decodeEventMetadata(bb);
        bb.limit = limit;
        break;
      }

      case 2: {
        message.timestamp = readVarint64(bb, /* unsigned */ false);
        break;
      }

      case 3: {
        message.index = readVarint32(bb);
        break;
      }

      case 4: {
        message.creator = readString(bb, readVarint32(bb));
        break;
      }

      case 5: {
        message.base_mint = readString(bb, readVarint32(bb));
        break;
      }

      case 6: {
        message.quote_mint = readString(bb, readVarint32(bb));
        break;
      }

      case 7: {
        message.base_mint_decimals = readVarint32(bb);
        break;
      }

      case 8: {
        message.quote_mint_decimals = readVarint32(bb);
        break;
      }

      case 9: {
        message.base_amount_in = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 10: {
        message.quote_amount_in = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 11: {
        message.pool_base_amount = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 12: {
        message.pool_quote_amount = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 13: {
        message.minimum_liquidity = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 14: {
        message.initial_liquidity = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 15: {
        message.lp_token_amount_out = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 16: {
        message.pool_bump = readVarint32(bb);
        break;
      }

      case 17: {
        message.pool = readString(bb, readVarint32(bb));
        break;
      }

      case 18: {
        message.lp_mint = readString(bb, readVarint32(bb));
        break;
      }

      case 19: {
        message.user_base_token_account = readString(bb, readVarint32(bb));
        break;
      }

      case 20: {
        message.user_quote_token_account = readString(bb, readVarint32(bb));
        break;
      }

      case 21: {
        message.coin_creator = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export function decodePumpSwapLiquidityAddedEvent(binary) {
  return _decodePumpSwapLiquidityAddedEvent(wrapByteBuffer(binary));
}

function _decodePumpSwapLiquidityAddedEvent(bb) {
  let message = {
    metadata: null,
    timestamp: 0,
    lp_token_amount_out: 0,
    max_base_amount_in: 0,
    max_quote_amount_in: 0,
    user_base_token_reserves: 0,
    user_quote_token_reserves: 0,
    pool_base_token_reserves: 0,
    pool_quote_token_reserves: 0,
    base_amount_in: 0,
    quote_amount_in: 0,
    lp_mint_supply: 0,
    pool: "",
    user: "",
    user_base_token_account: "",
    user_quote_token_account: "",
    user_pool_token_account: ""
  };

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      case 1: {
        let limit = pushTemporaryLength(bb);
        message.metadata = _decodeEventMetadata(bb);
        bb.limit = limit;
        break;
      }

      case 2: {
        message.timestamp = readVarint64(bb, /* unsigned */ false);
        break;
      }

      case 3: {
        message.lp_token_amount_out = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 4: {
        message.max_base_amount_in = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 5: {
        message.max_quote_amount_in = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 6: {
        message.user_base_token_reserves = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 7: {
        message.user_quote_token_reserves = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 8: {
        message.pool_base_token_reserves = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 9: {
        message.pool_quote_token_reserves = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 10: {
        message.base_amount_in = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 11: {
        message.quote_amount_in = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 12: {
        message.lp_mint_supply = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 13: {
        message.pool = readString(bb, readVarint32(bb));
        break;
      }

      case 14: {
        message.user = readString(bb, readVarint32(bb));
        break;
      }

      case 15: {
        message.user_base_token_account = readString(bb, readVarint32(bb));
        break;
      }

      case 16: {
        message.user_quote_token_account = readString(bb, readVarint32(bb));
        break;
      }

      case 17: {
        message.user_pool_token_account = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export function decodePumpSwapLiquidityRemovedEvent(binary) {
  return _decodePumpSwapLiquidityRemovedEvent(wrapByteBuffer(binary));
}

function _decodePumpSwapLiquidityRemovedEvent(bb) {
  let message = {
    metadata: null,
    timestamp: 0,
    lp_token_amount_in: 0,
    min_base_amount_out: 0,
    min_quote_amount_out: 0,
    user_base_token_reserves: 0,
    user_quote_token_reserves: 0,
    pool_base_token_reserves: 0,
    pool_quote_token_reserves: 0,
    base_amount_out: 0,
    quote_amount_out: 0,
    lp_mint_supply: 0,
    pool: "",
    user: "",
    user_base_token_account: "",
    user_quote_token_account: "",
    user_pool_token_account: ""
  };

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      case 1: {
        let limit = pushTemporaryLength(bb);
        message.metadata = _decodeEventMetadata(bb);
        bb.limit = limit;
        break;
      }

      case 2: {
        message.timestamp = readVarint64(bb, /* unsigned */ false);
        break;
      }

      case 3: {
        message.lp_token_amount_in = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 4: {
        message.min_base_amount_out = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 5: {
        message.min_quote_amount_out = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 6: {
        message.user_base_token_reserves = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 7: {
        message.user_quote_token_reserves = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 8: {
        message.pool_base_token_reserves = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 9: {
        message.pool_quote_token_reserves = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 10: {
        message.base_amount_out = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 11: {
        message.quote_amount_out = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 12: {
        message.lp_mint_supply = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 13: {
        message.pool = readString(bb, readVarint32(bb));
        break;
      }

      case 14: {
        message.user = readString(bb, readVarint32(bb));
        break;
      }

      case 15: {
        message.user_base_token_account = readString(bb, readVarint32(bb));
        break;
      }

      case 16: {
        message.user_quote_token_account = readString(bb, readVarint32(bb));
        break;
      }

      case 17: {
        message.user_pool_token_account = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

function _decodeServerMessage(bb) {
  let message = {};

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional ServerAck ack = 1;
      case 1: {
        let limit = pushTemporaryLength(bb);
        message.ack = _decodeServerAck(bb);
        bb.limit = limit;
        break;
      }

      // optional DexEvent event = 2;
      case 2: {
        let limit = pushTemporaryLength(bb);
        message.event = _decodeDexEvent(bb);
        bb.limit = limit;
        break;
      }

      // optional ServerError error = 3;
      case 3: {
        let limit = pushTemporaryLength(bb);
        message.error = _decodeServerError(bb);
        bb.limit = limit;
        break;
      }

      // optional ServerHeartbeat heartbeat = 4;
      case 4: {
        let limit = pushTemporaryLength(bb);
        message.heartbeat = _decodeServerHeartbeat(bb);
        bb.limit = limit;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export function decodeServerAck(binary) {
  return _decodeServerAck(wrapByteBuffer(binary));
}

function _decodeServerAck(bb) {
  let message = {};

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string message_id = 1;
      case 1: {
        message.message_id = readString(bb, readVarint32(bb));
        break;
      }

      // optional bool success = 2;
      case 2: {
        message.success = !!readByte(bb);
        break;
      }

      // optional string message = 3;
      case 3: {
        message.message = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export function decodeServerError(binary) {
  return _decodeServerError(wrapByteBuffer(binary));
}

function _decodeServerError(bb) {
  let message = {};

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional string error_code = 1;
      case 1: {
        message.error_code = readString(bb, readVarint32(bb));
        break;
      }

      // optional string error_message = 2;
      case 2: {
        message.error_message = readString(bb, readVarint32(bb));
        break;
      }

      // optional string request_id = 3;
      case 3: {
        message.request_id = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export function decodeServerHeartbeat(binary) {
  return _decodeServerHeartbeat(wrapByteBuffer(binary));
}

function _decodeServerHeartbeat(bb) {
  let message = {};

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      // optional uint64 timestamp = 1;
      case 1: {
        message.timestamp = readVarint64(bb, /* unsigned */ true);
        break;
      }

      // optional uint32 connected_clients = 2;
      case 2: {
        message.connected_clients = readVarint32(bb) >>> 0;
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

function pushTemporaryLength(bb) {
  let length = readVarint32(bb);
  let limit = bb.limit;
  bb.limit = bb.offset + length;
  return limit;
}

function skipUnknownField(bb, type) {
  switch (type) {
    case 0: while (readByte(bb) & 0x80) { } break;
    case 2: skip(bb, readVarint32(bb)); break;
    case 5: skip(bb, 4); break;
    case 1: skip(bb, 8); break;
    default: throw new Error("Unimplemented type: " + type);
  }
}

// 以下代码修改自 https://github.com/protobufjs/bytebuffer.js
// 使用 Apache License 2.0 许可证

function wrapByteBuffer(bytes) {
  return { bytes, offset: 0, limit: bytes.length };
}

function skip(bb, offset) {
  if (bb.offset + offset > bb.limit) {
    throw new Error('Skip past limit');
  }
  bb.offset += offset;
}

function isAtEnd(bb) {
  return bb.offset >= bb.limit;
}

function advance(bb, count) {
  let offset = bb.offset;
  if (offset + count > bb.limit) {
    throw new Error('Read past limit');
  }
  bb.offset += count;
  return offset;
}

function readString(bb, count) {
  // Sadly a hand-coded UTF8 decoder is much faster than subarray+TextDecoder in V8
  let offset = advance(bb, count);
  let fromCharCode = String.fromCharCode;
  let bytes = bb.bytes;
  let invalid = '\uFFFD';
  let text = '';

  for (let i = 0; i < count; i++) {
    let c1 = bytes[i + offset], c2, c3, c4, c;

    // 1 byte
    if ((c1 & 0x80) === 0) {
      text += fromCharCode(c1);
    }

    // 2 bytes
    else if ((c1 & 0xE0) === 0xC0) {
      if (i + 1 >= count) text += invalid;
      else {
        c2 = bytes[i + offset + 1];
        if ((c2 & 0xC0) !== 0x80) text += invalid;
        else {
          c = ((c1 & 0x1F) << 6) | (c2 & 0x3F);
          if (c < 0x80) text += invalid;
          else {
            text += fromCharCode(c);
            i++;
          }
        }
      }
    }

    // 3 bytes
    else if ((c1 & 0xF0) == 0xE0) {
      if (i + 2 >= count) text += invalid;
      else {
        c2 = bytes[i + offset + 1];
        c3 = bytes[i + offset + 2];
        if (((c2 | (c3 << 8)) & 0xC0C0) !== 0x8080) text += invalid;
        else {
          c = ((c1 & 0x0F) << 12) | ((c2 & 0x3F) << 6) | (c3 & 0x3F);
          if (c < 0x0800 || (c >= 0xD800 && c <= 0xDFFF)) text += invalid;
          else {
            text += fromCharCode(c);
            i += 2;
          }
        }
      }
    }

    // 4 bytes
    else if ((c1 & 0xF8) == 0xF0) {
      if (i + 3 >= count) text += invalid;
      else {
        c2 = bytes[i + offset + 1];
        c3 = bytes[i + offset + 2];
        c4 = bytes[i + offset + 3];
        if (((c2 | (c3 << 8) | (c4 << 16)) & 0xC0C0C0) !== 0x808080) text += invalid;
        else {
          c = ((c1 & 0x07) << 0x12) | ((c2 & 0x3F) << 0x0C) | ((c3 & 0x3F) << 0x06) | (c4 & 0x3F);
          if (c < 0x10000 || c > 0x10FFFF) text += invalid;
          else {
            c -= 0x10000;
            text += fromCharCode((c >> 10) + 0xD800, (c & 0x3FF) + 0xDC00);
            i += 3;
          }
        }
      }
    }

    else text += invalid;
  }

  return text;
}

function readByte(bb) {
  return bb.bytes[advance(bb, 1)];
}

function readInt32(bb) {
  let offset = advance(bb, 4);
  let bytes = bb.bytes;
  return (
    bytes[offset] |
    (bytes[offset + 1] << 8) |
    (bytes[offset + 2] << 16) |
    (bytes[offset + 3] << 24)
  );
}

function readVarint32(bb) {
  let c = 0;
  let value = 0;
  let b;
  do {
    b = readByte(bb);
    if (c < 32) value |= (b & 0x7F) << c;
    c += 7;
  } while (b & 0x80);
  return value;
}


function readVarint64(bb, unsigned) {
  let result = 0n;
  let shift = 0;
  let b;

  while (true) {
    b = readByte(bb);
    
    // 使用 BigInt 来避免精度损失
    if (shift === 0) {
      result = BigInt(b & 0x7F);
    } else {
      result += BigInt(b & 0x7F) * (2n ** BigInt(shift));
    }
    
    if ((b & 0x80) === 0) {
      break;
    }
    
    shift += 7;
    if (shift >= 64) {
      throw new Error('Invalid varint64: too many bytes');
    }
  }

  // 对于有符号数，需要进行符号扩展
  if (!unsigned && (result & (1n << 63n)) !== 0n) {
    // 对于负数，需要设置高位
    result = result | (0xFFFFFFFFFFFFFFFFn << 64n);
  }

  return Number(result);
}

// ====================== Meteora DAMM V2 事件 ======================

export function decodeMeteoraDammV2SwapEvent(binary) {
  return _decodeMeteoraDammV2SwapEvent(wrapByteBuffer(binary));
}

function _decodeMeteoraDammV2SwapEvent(bb) {
  let message = {
    metadata: null,
    pool: "",
    trade_direction: 0,
    has_referral: false,
    amount_in: 0,
    minimum_amount_out: 0,
    output_amount: 0,
    next_sqrt_price: 0,
    lp_fee: 0,
    protocol_fee: 0,
    partner_fee: 0,
    referral_fee: 0,
    actual_amount_in: 0,
    current_timestamp: 0,
    token_a_vault: "",
    token_b_vault: "",
    token_a_mint: "",
    token_b_mint: "",
    token_a_program: "",
    token_b_program: ""
  };

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      case 1: {
        let limit = pushTemporaryLength(bb);
        message.metadata = _decodeEventMetadata(bb);
        bb.limit = limit;
        break;
      }

      case 2: {
        message.pool = readString(bb, readVarint32(bb));
        break;
      }

      case 3: {
        message.trade_direction = readVarint32(bb);
        break;
      }

      case 4: {
        message.has_referral = !!readByte(bb);
        break;
      }

      case 5: {
        message.amount_in = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 6: {
        message.minimum_amount_out = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 7: {
        message.output_amount = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 8: {
        message.next_sqrt_price = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 9: {
        message.lp_fee = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 10: {
        message.protocol_fee = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 11: {
        message.partner_fee = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 12: {
        message.referral_fee = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 13: {
        message.actual_amount_in = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 14: {
        message.current_timestamp = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 15: {
        message.token_a_vault = readString(bb, readVarint32(bb));
        break;
      }

      case 16: {
        message.token_b_vault = readString(bb, readVarint32(bb));
        break;
      }

      case 17: {
        message.token_a_mint = readString(bb, readVarint32(bb));
        break;
      }

      case 18: {
        message.token_b_mint = readString(bb, readVarint32(bb));
        break;
      }

      case 19: {
        message.token_a_program = readString(bb, readVarint32(bb));
        break;
      }

      case 20: {
        message.token_b_program = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export function decodeMeteoraDammV2AddLiquidityEvent(binary) {
  return _decodeMeteoraDammV2AddLiquidityEvent(wrapByteBuffer(binary));
}

function _decodeMeteoraDammV2AddLiquidityEvent(bb) {
  let message = {
    metadata: null,
    pool: "",
    position: "",
    owner: "",
    liquidity_delta: 0,
    token_a_amount_threshold: 0,
    token_b_amount_threshold: 0,
    token_a_amount: 0,
    token_b_amount: 0,
    total_amount_a: 0,
    total_amount_b: 0
  };

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      case 1: {
        let limit = pushTemporaryLength(bb);
        message.metadata = _decodeEventMetadata(bb);
        bb.limit = limit;
        break;
      }

      case 2: {
        message.pool = readString(bb, readVarint32(bb));
        break;
      }

      case 3: {
        message.position = readString(bb, readVarint32(bb));
        break;
      }

      case 4: {
        message.owner = readString(bb, readVarint32(bb));
        break;
      }

      case 5: {
        message.liquidity_delta = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 6: {
        message.token_a_amount_threshold = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 7: {
        message.token_b_amount_threshold = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 8: {
        message.token_a_amount = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 9: {
        message.token_b_amount = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 10: {
        message.total_amount_a = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 11: {
        message.total_amount_b = readVarint64(bb, /* unsigned */ true);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export function decodeMeteoraDammV2RemoveLiquidityEvent(binary) {
  return _decodeMeteoraDammV2RemoveLiquidityEvent(wrapByteBuffer(binary));
}

function _decodeMeteoraDammV2RemoveLiquidityEvent(bb) {
  let message = {
    metadata: null,
    pool: "",
    position: "",
    owner: "",
    liquidity_delta: 0,
    token_a_amount_threshold: 0,
    token_b_amount_threshold: 0,
    token_a_amount: 0,
    token_b_amount: 0
  };

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      case 1: {
        let limit = pushTemporaryLength(bb);
        message.metadata = _decodeEventMetadata(bb);
        bb.limit = limit;
        break;
      }

      case 2: {
        message.pool = readString(bb, readVarint32(bb));
        break;
      }

      case 3: {
        message.position = readString(bb, readVarint32(bb));
        break;
      }

      case 4: {
        message.owner = readString(bb, readVarint32(bb));
        break;
      }

      case 5: {
        message.liquidity_delta = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 6: {
        message.token_a_amount_threshold = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 7: {
        message.token_b_amount_threshold = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 8: {
        message.token_a_amount = readVarint64(bb, /* unsigned */ true);
        break;
      }

      case 9: {
        message.token_b_amount = readVarint64(bb, /* unsigned */ true);
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export function decodeMeteoraDammV2CreatePositionEvent(binary) {
  return _decodeMeteoraDammV2CreatePositionEvent(wrapByteBuffer(binary));
}

function _decodeMeteoraDammV2CreatePositionEvent(bb) {
  let message = {
    metadata: null,
    pool: "",
    owner: "",
    position: "",
    position_nft_mint: ""
  };

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      case 1: {
        let limit = pushTemporaryLength(bb);
        message.metadata = _decodeEventMetadata(bb);
        bb.limit = limit;
        break;
      }

      case 2: {
        message.pool = readString(bb, readVarint32(bb));
        break;
      }

      case 3: {
        message.owner = readString(bb, readVarint32(bb));
        break;
      }

      case 4: {
        message.position = readString(bb, readVarint32(bb));
        break;
      }

      case 5: {
        message.position_nft_mint = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}

export function decodeMeteoraDammV2ClosePositionEvent(binary) {
  return _decodeMeteoraDammV2ClosePositionEvent(wrapByteBuffer(binary));
}

function _decodeMeteoraDammV2ClosePositionEvent(bb) {
  let message = {
    metadata: null,
    pool: "",
    owner: "",
    position: "",
    position_nft_mint: ""
  };

  end_of_message: while (!isAtEnd(bb)) {
    let tag = readVarint32(bb);

    switch (tag >>> 3) {
      case 0:
        break end_of_message;

      case 1: {
        let limit = pushTemporaryLength(bb);
        message.metadata = _decodeEventMetadata(bb);
        bb.limit = limit;
        break;
      }

      case 2: {
        message.pool = readString(bb, readVarint32(bb));
        break;
      }

      case 3: {
        message.owner = readString(bb, readVarint32(bb));
        break;
      }

      case 4: {
        message.position = readString(bb, readVarint32(bb));
        break;
      }

      case 5: {
        message.position_nft_mint = readString(bb, readVarint32(bb));
        break;
      }

      default:
        skipUnknownField(bb, tag & 7);
    }
  }

  return message;
}