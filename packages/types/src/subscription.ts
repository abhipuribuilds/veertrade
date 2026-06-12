export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  canceledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type SubscriptionPlan = "free" | "pro" | "enterprise";

export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "past_due"
  | "expired";
