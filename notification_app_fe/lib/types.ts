export type NotificationType = 'Event' | 'Result' | 'Placement';

export interface Notification {
  id: string;
  message: string;
  notification_type: NotificationType;
  timestamp: string;
  read: boolean;
}

export interface NotificationsResponse {
  data: Notification[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export const PRIORITY: Record<NotificationType, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};
