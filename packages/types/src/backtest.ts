export interface Backtest {
  id: string;
  strategyId: string;
  userId: string;
  status: BacktestStatus;
  config: BacktestConfig;
  metrics: BacktestMetrics | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type BacktestStatus = "pending" | "running" | "completed" | "failed";

export interface BacktestConfig {
  startDate: string;
  endDate: string;
  initialCapital: number;
  slippage: number;
  instrumentTokens: string[];
}

export interface BacktestMetrics {
  totalReturns: number;
  annualizedReturns: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  profitFactor: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  avgWin: number;
  avgLoss: number;
  expectancy: number;
}
