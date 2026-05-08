import { NotificationsResponse } from './types';

export async function fetchNotifications(
  page: number,
  limit: number,
  type?: string
): Promise<NotificationsResponse> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (type && type !== 'All') params.set('notification_type', type);

  const url = `/api/notifications?${params.toString()}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(txt || 'Failed to load notifications');
    }

    // try to parse JSON, fall back to empty shape
    let data: any;
    try {
      data = await res.json();
    } catch (e) {
      const txt = await res.text();
      try {
        data = JSON.parse(txt);
      } catch (_) {
        data = { data: [], total: 0, page: 1, limit: Number(limit), total_pages: 1 };
      }
    }

    // normalize various upstream shapes to our NotificationsResponse
    let items: any[] = [];

    if (Array.isArray(data.data)) {
      items = data.data;
    } else if (Array.isArray(data.notifications)) {
      items = data.notifications;
    } else if (Array.isArray(data)) {
      items = data;
    }

    // map upstream item shapes (e.g., Type/Message/Timestamp) to our Notification shape
    const mapped = items.map((it: any, idx: number) => {
      const notification_type = it.notification_type || it.Type || it.type || 'Event';
      const message = it.message || it.Message || it.msg || '';
      const timestamp = it.timestamp || it.Timestamp || it.time || new Date().toISOString();
      const read = typeof it.read === 'boolean' ? it.read : (it.Read === true);
      const id = it.id || it.ID || it.uuid || `${idx}-${notification_type}-${Date.parse(timestamp) || Date.now()}`;

      return {
        id: String(id),
        notification_type,
        message,
        timestamp,
        read: !!read,
      };
    });

    return {
      data: mapped,
      total: typeof data.total === 'number' ? data.total : mapped.length,
      page: typeof data.page === 'number' ? data.page : 1,
      limit: typeof data.limit === 'number' ? data.limit : Number(limit),
      total_pages: typeof data.total_pages === 'number' ? data.total_pages : 1,
    } as NotificationsResponse;
  } catch (err: any) {
    throw new Error(err.message || 'Failed to load notifications');
  }
}
