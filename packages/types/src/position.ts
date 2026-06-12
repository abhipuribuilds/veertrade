export interface Position {
  id: string;
  userId: string;
  brokerConnectionId: string;
  instrumentToken: string;
  side: PositionSide;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercentage: number;
  m2m: number;
  dayBuyQty: number;
  daySellQty: number;
  dayBuyAvg: number;
  daySellAvg: number;
  dayPnl: number;
  lastUpdatedAt: string;
  createdAt: string;
  updatedAt: string;
}

export type PositionSide = "long" | "short";

export interface PortfolioSummary {
  totalPnl: number;
  dayPnl: number;
  investedCapital: number;
  currentValue: number;
  freeMargin: number;
  usedMargin: number;
  totalReturns: number;
  dayReturns: number;
}
