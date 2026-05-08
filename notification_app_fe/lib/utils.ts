import { Notification, PRIORITY } from './types';

export function formatDate(date: string): string {
  const d = new Date(date);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function getPriorityNotifications(items: Notification[], limit = 5): Notification[] {
  return items
    .sort((a, b) => {
      const pA = PRIORITY[a.notification_type];
      const pB = PRIORITY[b.notification_type];
      if (pA !== pB) return pB - pA;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    })
    .slice(0, limit);
}

export function getTypeColor(type: string) {
  switch (type) {
    case 'Placement': return 'success';
    case 'Result': return 'warning';
    case 'Event': return 'info';
    default: return 'primary';
  }
}
