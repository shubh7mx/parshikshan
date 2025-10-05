'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  Check, 
  Info, 
  AlertTriangle, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import type { Notification, NotificationType } from '@/types';

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return CheckCircle;
    case 'error':
      return XCircle;
    case 'warning':
      return AlertTriangle;
    case 'info':
    default:
      return Info;
  }
};

const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case 'success':
      return 'text-green-500';
    case 'error':
      return 'text-red-500';
    case 'warning':
      return 'text-orange-500';
    case 'info':
    default:
      return 'text-blue-500';
  }
};

function NotificationItem({ 
  notification, 
  onMarkAsRead 
}: { 
  notification: Notification; 
  onMarkAsRead: (id: string) => void; 
}) {
  const Icon = getNotificationIcon(notification.type);
  const iconColor = getNotificationColor(notification.type);

  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.$id);
    }
    
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  return (
    <div 
      className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
        !notification.isRead ? 'bg-primary/5' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex items-start gap-3">
        <Icon className={`h-5 w-5 mt-0.5 ${iconColor}`} />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className={`font-medium text-sm truncate ${
              !notification.isRead ? 'text-foreground' : 'text-muted-foreground'
            }`}>
              {notification.title}
            </h4>
            {!notification.isRead && (
              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 ml-2" />
            )}
          </div>
          
          <p className={`text-sm ${
            !notification.isRead ? 'text-foreground' : 'text-muted-foreground'
          }`}>
            {notification.message}
          </p>
          
          <p className="text-xs text-muted-foreground mt-1">
            {new Date(notification.$createdAt).toLocaleString()}
          </p>
        </div>
        
        <Button
          variant="ghost"
          
          className="h-6 w-6 p-0"
          onClick={(e) => {
            e.stopPropagation();
            onMarkAsRead(notification.$id);
          }}
        >
          {notification.isRead ? (
            <Check className="h-3 w-3" />
          ) : (
            <X className="h-3 w-3" />
          )}
        </Button>
      </div>
    </div>
  );
}

export default function NotificationCenter({ 
  notifications, 
  onMarkAsRead, 
  onMarkAllAsRead 
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const recentNotifications = notifications
    .sort((a, b) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime())
    .slice(0, 10);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost"  className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-96 p-0">
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle>Notifications</SheetTitle>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                
                onClick={onMarkAllAsRead}
              >
                Mark all as read
              </Button>
            )}
          </div>
        </SheetHeader>
        
        <div className="overflow-y-auto h-full">
          {recentNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="font-medium text-muted-foreground mb-1">No notifications</h3>
              <p className="text-sm text-muted-foreground">
                You're all caught up!
              </p>
            </div>
          ) : (
            <div>
              {recentNotifications.map((notification) => (
                <NotificationItem
                  key={notification.$id}
                  notification={notification}
                  onMarkAsRead={onMarkAsRead}
                />
              ))}
              
              {notifications.length > 10 && (
                <div className="p-4 text-center border-t">
                  <Button variant="outline" >
                    View all notifications
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// Hook for managing notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load notifications from API
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      // Replace with actual API call
      // const result = await dbOperations.getNotificationsForUser(userId);
      // setNotifications(result.data || []);
      
      // Mock data for now
      setNotifications([
        {
          $id: '1',
          userId: 'user1',
          title: 'Application Approved',
          message: 'Your internship application for Frontend Developer position has been approved.',
          type: 'success',
          isRead: false,
          actionUrl: '/student/applications/1',
          $createdAt: new Date().toISOString(),
          $updatedAt: new Date().toISOString(),
        },
        {
          $id: '2',
          userId: 'user1',
          title: 'Report Due Soon',
          message: 'Your weekly report is due in 2 days. Please submit it on time.',
          type: 'warning',
          isRead: false,
          $createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          $updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
      ]);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      // Replace with actual API call
      // await dbOperations.markNotificationAsRead(notificationId);
      
      setNotifications(prev =>
        prev.map(n => n.$id === notificationId ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Replace with actual API call to mark all as read
      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      );
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  return {
    notifications,
    loading,
    markAsRead,
    markAllAsRead,
    reload: loadNotifications,
  };
}