export interface PaperTrade {
  id: string;
  strategyId: string;
  userId: string;
  instrumentToken: string;
  side: TradeSide;
  orderType: OrderType;
  quantity: number;
  price: number;
  triggerPrice: number | null;
  filledQty: number;
  avgFillPrice: number | null;
  status: TradeStatus;
  pnl: number | null;
  executedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LiveTrade {
  id: string;
  strategyId: string;
  userId: string;
  brokerConnectionId: string;
  instrumentToken: string;
  side: TradeSide;
  orderType: OrderType;
  quantity: number;
  price: number;
  triggerPrice: number | null;
  filledQty: number;
  avgFillPrice: number | null;
  status: TradeStatus;
  brokerOrderId: string | null;
  pnl: number | null;
  executedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type TradeSide = "buy" | "sell";

export type OrderType = "market" | "limit" | "sl" | "sl_m";

export type TradeStatus =
  | "pending"
  | "open"
  | "filled"
  | "partially_filled"
  | "canceled"
  | "rejected";
