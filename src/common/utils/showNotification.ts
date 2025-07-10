import { notification } from 'antd';

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export interface ShowNotificationOptions {
  type?: NotificationType;
  message?: string;
  description?: string;
  duration?: number;
  placement?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  error?: unknown;
}

/**
 * Shows a generic notification (success, error, info, warning).
 */
export function showNotification({
  type = 'info',
  message = 'Notification',
  description = '',
  duration = 3,
  placement = 'topRight',
}: ShowNotificationOptions) {
  notification[type]({
    message,
    description,
    duration,
    placement,
  });
} 