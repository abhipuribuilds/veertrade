export interface Strategy {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  type: StrategyType;
  config: Record<string, unknown>;
  version: number;
  status: StrategyStatus;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export type StrategyType = "visual" | "code";

export type StrategyStatus = "draft" | "active" | "archived";

export interface StrategyVersion {
  id: string;
  strategyId: string;
  version: number;
  config: Record<string, unknown>;
  changelog: string;
  createdAt: string;
}
