import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Bell, Check, CheckSquare } from 'lucide-react';
import notificationsApi, { type AppNotification } from '../api/notifications';
import { type PaginatedResponse } from '../api/client';
import Pagination from '../components/Pagination';

const NotificationsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  // React Query to fetch notifications
  const { data: paginatedData, isLoading } = useQuery<PaginatedResponse<AppNotification>>({
    queryKey: ['notifications', page, searchTerm],
    queryFn: () => notificationsApi.getMyNotifications(page, limit, searchTerm),
  });

  const notifications = paginatedData?.data || [];
  const meta = paginatedData?.meta;

  // Reset page when search term changes
  React.useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  // Mutation to mark single notification as read
  const readMutation = useMutation({
    mutationFn: (id: string) => notificationsApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Mutation to mark all notifications as read
  const readAllMutation = useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const formatTime = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusStyles = (type: string) => {
    switch (type) {
      case 'success':
        return {
          bg: '#e6fffa',
          color: '#319795',
          border: '1px solid #b2f5ea',
        };
      case 'warning':
        return {
          bg: '#fffaf0',
          color: '#dd6b20',
          border: '1px solid #feebc8',
        };
      case 'error':
        return {
          bg: '#fff5f5',
          color: '#e53e3e',
          border: '1px solid #fed7d7',
        };
      case 'info':
      default:
        return {
          bg: '#ebf8ff',
          color: '#3182ce',
          border: '1px solid #bee3f8',
        };
    }
  };

  const getNotificationLabel = (type: string) => {
    switch (type) {
      case 'success':
        return 'Thành công';
      case 'warning':
        return 'Cảnh báo';
      case 'error':
        return 'Lỗi';
      case 'info':
      default:
        return 'Thông tin';
    }
  };

  return (
    <div>
      {/* Header section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Bell size={28} color="var(--primary)" />
            Lịch sử thông báo
          </h1>
          <p style={{ color: '#64748b' }}>Xem và quản lý tất cả các thông báo trong hệ thống của bạn</p>
        </div>

        <button
          className="btn-primary"
          onClick={() => readAllMutation.mutate()}
          disabled={readAllMutation.isPending || notifications.length === 0}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            opacity: readAllMutation.isPending || notifications.length === 0 ? 0.7 : 1,
          }}
        >
          <CheckSquare size={18} />
          Đánh dấu đã đọc tất cả
        </button>
      </div>

      {/* Main card */}
      <div className="card" style={{ padding: '0' }}>
        {/* Search Bar */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Tìm kiếm nội dung thông báo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 1rem 0.6rem 2.5rem',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* List content */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
              <tr>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#64748b', fontSize: '0.875rem', width: '150px' }}>Loại</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#64748b', fontSize: '0.875rem' }}>Nội dung thông báo</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#64748b', fontSize: '0.875rem', width: '220px' }}>Thời gian</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#64748b', fontSize: '0.875rem', width: '120px' }}>Trạng thái</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: '#64748b', fontSize: '0.875rem', textAlign: 'right', width: '120px' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Đang tải dữ liệu...</td>
                </tr>
              ) : notifications.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Không tìm thấy thông báo nào</td>
                </tr>
              ) : (
                notifications.map((notification) => {
                  const styles = getStatusStyles(notification.type);
                  return (
                    <tr
                      key={notification.id}
                      style={{
                        borderBottom: '1px solid var(--border)',
                        transition: 'background-color 0.2s',
                        backgroundColor: !notification.read ? 'rgba(99, 102, 241, 0.02)' : 'transparent',
                      }}
                    >
                      {/* Type Badge */}
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '0.25rem 0.6rem',
                            borderRadius: '0.375rem',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            backgroundColor: styles.bg,
                            color: styles.color,
                            border: styles.border,
                            textAlign: 'center',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {getNotificationLabel(notification.type)}
                        </span>
                      </td>

                      {/* Message */}
                      <td style={{ padding: '1.25rem 1.5rem', verticalAlign: 'middle' }}>
                        <div
                          style={{
                            fontSize: '0.9rem',
                            color: '#1e293b',
                            fontWeight: !notification.read ? '600' : '400',
                            lineHeight: '1.5',
                            wordBreak: 'break-word',
                          }}
                        >
                          {notification.message}
                        </div>
                      </td>

                      {/* Created At */}
                      <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.85rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                        {formatTime(notification.createdAt)}
                      </td>

                      {/* Read Status */}
                      <td style={{ padding: '1.25rem 1.5rem' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            color: notification.read ? '#64748b' : 'var(--primary)',
                          }}
                        >
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              backgroundColor: notification.read ? '#94a3b8' : 'var(--primary)',
                            }}
                          />
                          {notification.read ? 'Đã đọc' : 'Chưa đọc'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                        {!notification.read && (
                          <button
                            onClick={() => readMutation.mutate(notification.id)}
                            disabled={readMutation.isPending}
                            title="Đánh dấu đã đọc"
                            style={{
                              padding: '0.4rem',
                              backgroundColor: '#f1f5f9',
                              color: '#475569',
                              cursor: 'pointer',
                              border: 'none',
                              borderRadius: '0.375rem',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'var(--primary)';
                              e.currentTarget.style.color = '#ffffff';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = '#f1f5f9';
                              e.currentTarget.style.color = '#475569';
                            }}
                          >
                            <Check size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        {meta && meta.totalPages > 1 && (
          <Pagination
            currentPage={meta.page}
            totalPages={meta.totalPages}
            onPageChange={setPage}
            totalItems={meta.total}
          />
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
