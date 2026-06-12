export interface Broker {
  id: string;
  name: string;
  type: BrokerType;
  isActive: boolean;
  configTemplate: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export type BrokerType = "zerodha" | "angel_one" | "upstox" | "icici";

export interface BrokerConnection {
  id: string;
  userId: string;
  brokerId: string;
  broker: Broker;
  label: string;
  status: ConnectionStatus;
  expiresAt: string | null;
  lastSyncedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ConnectionStatus = "connected" | "expired" | "error" | "disconnected";
