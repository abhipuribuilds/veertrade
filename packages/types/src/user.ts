export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export type UserRole = "admin" | "user";

export interface UserPreferences {
  theme: "dark" | "light" | "system";
  timezone: string;
  notifications: NotificationPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  inApp: boolean;
  quietHoursStart: string | null;
  quietHoursEnd: string | null;
}
