import api, { type PaginatedResponse } from './client';

export interface AppNotification {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  read: boolean;
  data: Record<string, any> | null;
  createdAt: string;
}

const notificationsApi = {
  getMyNotifications: (page: number = 1, limit: number = 10, q: string = ''): Promise<PaginatedResponse<AppNotification>> =>
    api.get(`/notifications?page=${page}&limit=${limit}&q=${encodeURIComponent(q)}`).then((r) => r.data),

  markAsRead: (id: string): Promise<void> =>
    api.patch(`/notifications/${id}/read`).then((r) => r.data),

  markAllAsRead: (): Promise<void> =>
    api.patch('/notifications/read-all').then((r) => r.data),
};

export default notificationsApi;
