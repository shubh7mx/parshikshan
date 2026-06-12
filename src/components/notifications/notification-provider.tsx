'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useApp } from '@/components/providers/app-provider';
import { toast } from 'sonner';
import { 
  Bell, AlertCircle, CheckCircle, Info, Calendar,
  FileText, Users, Trophy, Clock, Building, GraduationCap
} from 'lucide-react';

export interface Notification {
  id: string;
  created_at: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'deadline' | 'application' | 'internship' | 'evaluation' | 'system';
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, string>;
  expiresAt?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  sendNotification: (notification: Omit<Notification, 'id' | 'created_at' | 'isRead'>) => Promise<void>;
  getNotificationIcon: (type: string) => ReactNode;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
  return context;
}

interface NotificationProviderProps { children: ReactNode; }

export function NotificationProvider({ children }: NotificationProviderProps) {
  const { user } = useApp();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'deadline': return <Clock className="h-4 w-4 text-orange-500" />;
      case 'application': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'internship': return <Building className="h-4 w-4 text-purple-500" />;
      case 'evaluation': return <Trophy className="h-4 w-4 text-gold-500" />;
      case 'system': return <Info className="h-4 w-4 text-gray-500" />;
      default: return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  const loadNotifications = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const mockNotifications: Notification[] = [
        {
          id: '1', created_at: new Date().toISOString(), userId: user.id,
          title: 'New Internship Application',
          message: 'Your application for Frontend Developer at TechCorp has been received.',
          type: 'application', isRead: false, priority: 'medium',
          actionUrl: '/student/dashboard', actionLabel: 'View Application',
        },
        {
          id: '2', created_at: new Date(Date.now() - 3600000).toISOString(), userId: user.id,
          title: 'Application Status Update',
          message: 'You have been shortlisted for the Data Analyst position at DataCorp.',
          type: 'success', isRead: false, priority: 'high',
          actionUrl: '/student/applications', actionLabel: 'View Details',
        },
        {
          id: '3', created_at: new Date(Date.now() - 7200000).toISOString(), userId: user.id,
          title: 'Weekly Report Reminder',
          message: 'Your weekly internship report is due in 2 days.',
          type: 'deadline', isRead: false, priority: 'medium',
          actionUrl: '/student/reports', actionLabel: 'Submit Report',
        },
        {
          id: '4', created_at: new Date(Date.now() - 86400000).toISOString(), userId: user.id,
          title: 'New Learning Resource',
          message: 'A new course on React Advanced Patterns has been added.',
          type: 'info', isRead: true, priority: 'low',
          actionUrl: '/skills', actionLabel: 'View Course',
        },
        {
          id: '5', created_at: new Date(Date.now() - 172800000).toISOString(), userId: user.id,
          title: 'Skill Assessment Available',
          message: 'A new skill assessment for JavaScript is now available.',
          type: 'info', isRead: true, priority: 'low',
          actionUrl: '/skills', actionLabel: 'Take Assessment',
        }
      ];
      setNotifications(mockNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = async (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    toast.success('Notification deleted');
  };

  const sendNotification = async (notification: Omit<Notification, 'id' | 'created_at' | 'isRead'>) => {
    const newNotification: Notification = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      ...notification,
      isRead: false,
    };
    setNotifications(prev => [newNotification, ...prev]);

    if (notification.priority === 'high' || notification.priority === 'urgent') {
      toast(notification.title, {
        description: notification.message,
        action: notification.actionUrl ? {
          label: notification.actionLabel || 'View',
          onClick: () => window.location.href = notification.actionUrl!
        } : undefined
      });
    }
  };

  const refreshNotifications = () => loadNotifications();

  useEffect(() => {
    if (user) loadNotifications();
    else setNotifications([]);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    if (!user || typeof window === 'undefined') return;
    if (Notification.permission === 'default') Notification.requestPermission();
    const urgentNotifications = notifications.filter(n => !n.isRead && n.priority === 'urgent');
    urgentNotifications.forEach(n => {
      if (Notification.permission === 'granted') {
        new Notification(n.title, { body: n.message, icon: '/favicon.ico', tag: n.id });
      }
    });
  }, [notifications, user]);

  return (
    <NotificationContext.Provider value={{
      notifications, unreadCount, isLoading, markAsRead, markAllAsRead,
      deleteNotification, sendNotification, getNotificationIcon, refreshNotifications,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}
