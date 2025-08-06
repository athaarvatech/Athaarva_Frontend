export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'appointment' | 'medical' | 'message' | 'medication' | 'record' | 'system';
  read: boolean;
  timestamp: Date;
  actionUrl?: string;
  actionLabel?: string;
  priority?: 'low' | 'medium' | 'high';
  category?: 'system' | 'appointment' | 'medical' | 'billing' | 'general';
  data?: Record<string, unknown>;
  relatedItemId?: string | number;
}
