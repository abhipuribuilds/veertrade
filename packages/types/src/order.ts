export interface Order {
  id: string;
  tradeId: string;
  brokerOrderId: string | null;
  instrumentToken: string;
  side: TradeSide;
  orderType: OrderType;
  quantity: number;
  filledQuantity: number;
  price: number;
  triggerPrice: number | null;
  averagePrice: number | null;
  status: OrderStatus;
  variety: OrderVariety;
  validity: OrderValidity;
  rejectedReason: string | null;
  placedAt: string | null;
  filledAt: string | null;
  canceledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

import type { TradeSide, OrderType } from "./trade";

export type OrderStatus =
  | "pending"
  | "open"
  | "trigger_pending"
  | "filled"
  | "partially_filled"
  | "canceled"
  | "rejected";

export type OrderVariety = "regular" | "amo" | "iceberg";

export type OrderValidity = "day" | "ioc" | "gtc";
