/**
 * 订单状态枚举
 */
export enum OrderStatus {
  /** 正在买入 */
  Buying = 'Buying',
  /** 已购买，等待出售 */
  Bought = 'Bought',
  /** 正在卖出 */
  Selling = 'Selling',
  /** 已出售 */
  Sold = 'Sold',
}

export interface Order {
  /** 代币 mint 地址 */
  mint: string;
  /** 代币数量 */
  token_amount: number;
  /** 价格 */
  price: number;
  /** 订单创建时间戳 */
  created_at: number;
  /** 订单状态 */
  status: OrderStatus;
  /** 交易平台 */
  platform: string;
}