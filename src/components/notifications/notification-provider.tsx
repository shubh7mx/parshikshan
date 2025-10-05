'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { databases, ID, Query } from '@/lib/appwrite';
import { useApp } from '@/components/providers/app-provider';
import { toast } from 'sonner';
import { 
  Bell, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  Calendar,
  FileText,
  Users,
  Trophy,
  Clock,
  Building,
  GraduationCap
} from 'lucide-react';

export interface Notification {
  $id: string;
  $createdAt: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'deadline' | 'application' | 'internship' | 'evaluation' | 'system';
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  actionLabel?: string;
  metadata?: {
    applicationId?: string;
    internshipId?: string;
    reportId?: string;
    companyId?: string;
    studentId?: string;
  };
  expiresAt?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  sendNotification: (notification: Omit<Notification, '$id' | '$createdAt' | 'isRead'>) => Promise<void>;
  getNotificationIcon: (type: string) => ReactNode;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

interface NotificationProviderProps {
  children: ReactNode;
}

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
      const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID!;
      
      // First try to load from database
      try {
        const result = await databases.listDocuments(
          DATABASE_ID,
          'notifications',
          [
            Query.equal('userId', user.$id),
            Query.orderDesc('$createdAt'),
            Query.limit(50)
          ]
        );
        
        const dbNotifications = result.documents.map(doc => ({
          $id: doc.$id,
          $createdAt: doc.$createdAt,
          userId: doc.userId,
          title: doc.title,
          message: doc.message,
          type: doc.type,
          isRead: doc.isRead,
          priority: doc.priority,
          actionUrl: doc.actionUrl,
          actionLabel: doc.actionLabel,
          metadata: doc.metadata,
          expiresAt: doc.expiresAt
        }));
        
        setNotifications(dbNotifications);
      } catch (dbError) {
        console.warn('Could not load from database, using mock notifications:', dbError);
        
        // Fallback to mock notifications
        const mockNotifications: Notification[] = [
          {
            $id: '1',
            $createdAt: new Date().toISOString(),
            userId: user.$id,
            title: 'New Internship Application',
            message: 'Your application for Frontend Developer at TechCorp has been received and is under review.',
            type: 'application',
            isRead: false,
            priority: 'medium',
            actionUrl: '/student/dashboard',
            actionLabel: 'View Application',
            metadata: {
              applicationId: 'app1',
              companyId: 'tech-corp'
            }
          },
          {
            $id: '2',
            $createdAt: new Date(Date.now() - 3600000).toISOString(),
            userId: user.$id,
            title: 'Application Status Update',
            message: 'Good news! You have been shortlisted for the Data Analyst position at DataCorp.',
            type: 'success',
            isRead: false,
            priority: 'high',
            actionUrl: '/student/applications',
            actionLabel: 'View Details',
            metadata: {
              applicationId: 'app2',
              companyId: 'data-corp'
            }
          },
          {
            $id: '3',
            $createdAt: new Date(Date.now() - 7200000).toISOString(),
            userId: user.$id,
            title: 'Weekly Report Reminder',
            message: 'Your weekly internship report is due in 2 days. Please submit it on time.',
            type: 'deadline',
            isRead: false,
            priority: 'medium',
            actionUrl: '/student/reports',
            actionLabel: 'Submit Report'
          },
          {
            $id: '4',
            $createdAt: new Date(Date.now() - 86400000).toISOString(),
            userId: user.$id,
            title: 'New Learning Resource',
            message: 'A new course on React Advanced Patterns has been added to your recommended learning resources.',
            type: 'info',
            isRead: true,
            priority: 'low',
            actionUrl: '/skills',
            actionLabel: 'View Course'
          },
          {
            $id: '5',
            $createdAt: new Date(Date.now() - 172800000).toISOString(),
            userId: user.$id,
            title: 'Skill Assessment Available',
            message: 'A new skill assessment for JavaScript is now available. Test your knowledge!',
            type: 'info',
            isRead: true,
            priority: 'low',
            actionUrl: '/skills',
            actionLabel: 'Take Assessment'
          }
        ];
        
        setNotifications(mockNotifications);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID!;
      
      try {
        await databases.updateDocument(
          DATABASE_ID,
          'notifications',
          notificationId,
          { isRead: true }
        );
      } catch (dbError) {
        console.warn('Could not update in database:', dbError);
      }
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.$id === notificationId ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      
      // Update local state first for immediate feedback
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true }))
      );
      
      // Try to update in database
      const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID!;
      
      for (const notification of unreadNotifications) {
        try {
          await databases.updateDocument(
            DATABASE_ID,
            'notifications',
            notification.$id,
            { isRead: true }
          );
        } catch (dbError) {
          console.warn('Could not update notification in database:', dbError);
        }
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID!;
      
      try {
        await databases.deleteDocument(
          DATABASE_ID,
          'notifications',
          notificationId
        );
      } catch (dbError) {
        console.warn('Could not delete from database:', dbError);
      }
      
      // Update local state
      setNotifications(prev => 
        prev.filter(n => n.$id !== notificationId)
      );
      
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const sendNotification = async (notification: Omit<Notification, '$id' | '$createdAt' | 'isRead'>) => {
    try {
      const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID!;
      
      const notificationData = {
        ...notification,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      
      let createdNotification;
      try {
        createdNotification = await databases.createDocument(
          DATABASE_ID,
          'notifications',
          ID.unique(),
          notificationData
        );
        
        // Add to local state with the created document data
        setNotifications(prev => [createdNotification, ...prev]);
        
      } catch (dbError) {
        console.warn('Could not save to database:', dbError);
        
        // Fallback: add to local state only with generated data
        const fallbackNotification = {
          $id: ID.unique(),
          $createdAt: new Date().toISOString(),
          ...notification,
          isRead: false
        };
        setNotifications(prev => [fallbackNotification, ...prev]);
      }
      
      // Show toast notification for high/urgent priority
      if (notification.priority === 'high' || notification.priority === 'urgent') {
        toast(notification.title, {
          description: notification.message,
          action: notification.actionUrl ? {
            label: notification.actionLabel || 'View',
            onClick: () => window.location.href = notification.actionUrl!
          } : undefined
        });
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Failed to send notification');
    }
  };

  const refreshNotifications = async () => {
    await loadNotifications();
  };

  // Load notifications when user changes
  useEffect(() => {
    if (user) {
      loadNotifications();
    } else {
      setNotifications([]);
    }
  }, [user]);

  // Set up polling for new notifications (every 30 seconds)
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
      loadNotifications();
    }, 30000); // 30 seconds
    
    return () => clearInterval(interval);
  }, [user]);

  // Show browser notifications for urgent items
  useEffect(() => {
    if (!user || typeof window === 'undefined') return;
    
    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
    
    // Show browser notification for new urgent notifications
    const urgentNotifications = notifications.filter(
      n => !n.isRead && n.priority === 'urgent'
    );
    
    urgentNotifications.forEach(notification => {
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico',
          tag: notification.$id
        });
      }
    });
  }, [notifications, user]);

  return (
    <NotificationContext.Provider 
      value={{
        notifications,
        unreadCount,
        isLoading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        sendNotification,
        getNotificationIcon,
        refreshNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}