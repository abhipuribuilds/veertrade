export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data: Record<string, unknown> | null;
  readAt: string | null;
  createdAt: string;
}

export type NotificationType =
  | "order_fill"
  | "order_rejected"
  | "position_alert"
  | "pnl_alert"
  | "risk_breach"
  | "system"
  | "ai_insight"
  | "subscription";
