"use client";

import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Notification } from '../types/notification';
import notificationService, { NotificationResponse } from '../lib/services/NotificationService';

interface NotificationsContextProps {
  notifications: Notification[];
  loadingNotifications: boolean;
  unreadCount: number;
  error: string | null;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  handleNotificationClick: (notification: Notification) => void;
  refreshNotifications: () => Promise<void>;
  loadMore: () => Promise<void>;
  hasMore: boolean;
}

// Export the context directly so it can be imported if needed
export const NotificationsContext = createContext<NotificationsContextProps | undefined>(undefined);

// Transform API response to frontend Notification type
const transformNotification = (apiNotification: NotificationResponse): Notification => {
  // Map API type to frontend type
  const typeMap: Record<string, Notification['type']> = {
    'appointment_reminder': 'appointment',
    'appointment_confirmed': 'appointment',
    'appointment_cancelled': 'appointment',
    'new_message': 'message',
    'prescription_ready': 'medication',
    'lab_results': 'record',
    'payment_received': 'info',
    'payment_due': 'warning',
    'system_alert': 'system',
    'general': 'info',
  };

  // Map priority
  const priorityMap: Record<string, Notification['priority']> = {
    'low': 'low',
    'normal': 'medium',
    'high': 'high',
    'urgent': 'high',
  };

  return {
    id: apiNotification.id,
    title: apiNotification.title,
    message: apiNotification.message,
    type: typeMap[apiNotification.type] || 'info',
    read: apiNotification.read,
    timestamp: new Date(apiNotification.created_at),
    actionUrl: apiNotification.action_url || undefined,
    actionLabel: apiNotification.action_label || undefined,
    priority: priorityMap[apiNotification.priority] || 'medium',
    category: apiNotification.type.includes('appointment') ? 'appointment' 
            : apiNotification.type.includes('message') ? 'general'
            : apiNotification.type.includes('payment') ? 'billing'
            : apiNotification.type.includes('prescription') || apiNotification.type.includes('lab') ? 'medical'
            : 'system',
    data: apiNotification.data,
    relatedItemId: apiNotification.data?.related_id as string | undefined,
  };
};

// Add export keyword here to create a named export
export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const isInitialized = useRef(false);

  // Get router reference lazily - only when needed
  const router = typeof window !== 'undefined' ? useRouter() : null;

  // Fetch notifications from API
  const fetchNotifications = useCallback(async (page: number = 1, append: boolean = false) => {
    try {
      setError(null);
      
      // Check if user is authenticated
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        setNotifications([]);
        setUnreadCount(0);
        setLoadingNotifications(false);
        return;
      }

      const response = await notificationService.getNotifications({
        page,
        per_page: 20,
      });

      const transformedNotifications = response.items.map(transformNotification);

      if (append) {
        setNotifications(prev => [...prev, ...transformedNotifications]);
      } else {
        setNotifications(transformedNotifications);
      }

      setCurrentPage(page);
      setHasMore(page < response.pages);

      // Get unread count
      const countResponse = await notificationService.getUnreadCount();
      setUnreadCount(countResponse.count);

    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
      // Set empty array on error instead of leaving previous state
      if (!append) {
        setNotifications([]);
      }
    } finally {
      setLoadingNotifications(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      fetchNotifications(1);
    }
  }, [fetchNotifications]);

  // Refresh notifications
  const refreshNotifications = useCallback(async () => {
    setLoadingNotifications(true);
    await fetchNotifications(1);
  }, [fetchNotifications]);

  // Load more notifications
  const loadMore = useCallback(async () => {
    if (!hasMore || loadingNotifications) return;
    await fetchNotifications(currentPage + 1, true);
  }, [currentPage, hasMore, loadingNotifications, fetchNotifications]);

  // Add a new notification (local only - for real-time updates)
  const addNotification = useCallback((notification: Notification) => {
    setNotifications(prev => [notification, ...prev]);
    if (!notification.read) {
      setUnreadCount(prev => prev + 1);
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback(async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
      setError(err instanceof Error ? err.message : 'Failed to mark as read');
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();
      
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      setError(err instanceof Error ? err.message : 'Failed to mark all as read');
    }
  }, []);

  // Delete a notification
  const deleteNotification = useCallback(async (id: string) => {
    try {
      await notificationService.deleteNotification(id);
      
      const deletedNotification = notifications.find(n => n.id === id);
      setNotifications(prev => prev.filter(notification => notification.id !== id));
      
      if (deletedNotification && !deletedNotification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete notification');
    }
  }, [notifications]);

  // Safe navigation function
  const navigateTo = useCallback((url: string) => {
    if (router) {
      router.push(url);
    } else if (typeof window !== 'undefined') {
      window.location.href = url;
    }
  }, [router]);

  // Handle notification click
  const handleNotificationClick = useCallback((notification: Notification) => {
    // Mark the notification as read
    markAsRead(notification.id);

    // Navigate based on actionUrl or notification type
    if (notification.actionUrl) {
      navigateTo(notification.actionUrl);
      return;
    }

    switch (notification.type) {
      case 'appointment':
        if (notification.relatedItemId) {
          sessionStorage.setItem('selectedAppointmentId', notification.relatedItemId.toString());
          navigateTo(`/patient/appointments/details/${notification.relatedItemId}`);
        } else {
          navigateTo('/patient/appointments');
        }
        break;
      case 'message':
        if (notification.relatedItemId) {
          sessionStorage.setItem('selectedMessageId', notification.relatedItemId.toString());
          navigateTo(`/patient/messages/${notification.relatedItemId}`);
        } else {
          navigateTo('/patient/messages');
        }
        break;
      case 'medication':
        if (notification.relatedItemId) {
          sessionStorage.setItem('selectedMedicationId', notification.relatedItemId.toString());
          navigateTo(`/patient/medications/${notification.relatedItemId}`);
        } else {
          navigateTo('/patient/medications');
        }
        break;
      case 'record':
        if (notification.relatedItemId) {
          sessionStorage.setItem('selectedRecordId', notification.relatedItemId.toString());
          navigateTo(`/patient/medical-records/${notification.relatedItemId}`);
        } else {
          navigateTo('/patient/medical-records');
        }
        break;
      case 'system':
      default:
        navigateTo('/patient/dashboard');
        break;
    }
  }, [markAsRead, navigateTo]);

  return (
    <NotificationsContext.Provider value={{
      notifications,
      loadingNotifications,
      unreadCount,
      error,
      addNotification,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      handleNotificationClick,
      refreshNotifications,
      loadMore,
      hasMore,
    }}>
      {children}
    </NotificationsContext.Provider>
  );
};

// Custom hook to use the notifications context
export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Add default export to support both import styles
export default NotificationProvider;
