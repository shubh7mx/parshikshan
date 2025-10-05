'use client';

import React, { useState } from 'react';
import { 
  Bell,
  BellOff,
  CheckCircle,
  Info,
  AlertTriangle,
  X,
  Filter,
  Search,
  MoreVertical,
  Calendar,
  Clock
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// Mock data - In real app, this would come from API
const mockNotifications = [
  {
    id: '1',
    title: 'New Internship Application',
    message: 'Your application for Software Engineer Intern at TechCorp has been submitted successfully.',
    type: 'success',
    isRead: false,
    timestamp: '2024-06-20T10:30:00Z',
    category: 'applications'
  },
  {
    id: '2',
    title: 'Mentor Feedback Available',
    message: 'John Smith has provided feedback on your latest logbook entry. Check your digital logbook to view the comments.',
    type: 'info',
    isRead: false,
    timestamp: '2024-06-20T09:15:00Z',
    category: 'mentoring'
  },
  {
    id: '3',
    title: 'Deadline Reminder',
    message: 'Your final project report is due in 3 days. Make sure to submit all required documentation.',
    type: 'warning',
    isRead: true,
    timestamp: '2024-06-19T14:00:00Z',
    category: 'deadlines'
  },
  {
    id: '4',
    title: 'Skills Assessment Completed',
    message: 'Congratulations! You have successfully completed the Technical Skills Assessment with a grade of A.',
    type: 'success',
    isRead: true,
    timestamp: '2024-06-18T16:45:00Z',
    category: 'assessments'
  },
  {
    id: '5',
    title: 'System Maintenance',
    message: 'Scheduled system maintenance will occur tonight from 11 PM to 2 AM. Some features may be temporarily unavailable.',
    type: 'info',
    isRead: false,
    timestamp: '2024-06-17T08:00:00Z',
    category: 'system'
  },
  {
    id: '6',
    title: 'Profile Update Required',
    message: 'Please update your profile information to ensure accurate matching with internship opportunities.',
    type: 'warning',
    isRead: true,
    timestamp: '2024-06-15T12:30:00Z',
    category: 'profile'
  }
];

const notificationSettings = [
  { id: 'applications', label: 'Application Updates', enabled: true },
  { id: 'mentoring', label: 'Mentor Feedback', enabled: true },
  { id: 'deadlines', label: 'Deadline Reminders', enabled: true },
  { id: 'assessments', label: 'Assessment Results', enabled: true },
  { id: 'system', label: 'System Notifications', enabled: false },
  { id: 'profile', label: 'Profile Reminders', enabled: true }
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [settings, setSettings] = useState(notificationSettings);
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500';
      case 'warning':
        return 'border-l-yellow-500';
      case 'info':
      default:
        return 'border-l-blue-500';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const toggleSetting = (id: string) => {
    setSettings(prev => 
      prev.map(setting => 
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesSearch = notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notif.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = selectedTab === 'all' || 
                      (selectedTab === 'unread' && !notif.isRead) ||
                      (selectedTab === 'read' && notif.isRead);
    return matchesSearch && matchesTab;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground mt-2">
            Stay updated with your internship progress and important updates.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
            Mark All Read
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge variant="secondary" className="flex items-center gap-1">
          <Bell className="h-3 w-3" />
          {unreadCount} unread
        </Badge>
      </div>

      {/* Notifications */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
          <TabsTrigger value="read">Read ({notifications.length - unreadCount})</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BellOff className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No notifications found</h3>
                <p className="text-muted-foreground text-center">
                  {searchTerm ? 'Try adjusting your search terms.' : 'You\'re all caught up!'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {filteredNotifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`border-l-4 ${getNotificationTypeColor(notification.type)} ${
                    !notification.isRead ? 'bg-muted/30' : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className={`font-medium ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                              {notification.title}
                              {!notification.isRead && <span className="ml-2 h-2 w-2 bg-blue-600 rounded-full inline-block" />}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {formatTime(notification.timestamp)}
                              <Badge variant="outline" className="text-xs">
                                {notification.category}
                              </Badge>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {!notification.isRead && (
                                <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Mark as read
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem 
                                onClick={() => deleteNotification(notification.id)}
                                className="text-destructive"
                              >
                                <X className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="unread" className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-12 w-12 text-green-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                <p className="text-muted-foreground text-center">
                  You have no unread notifications.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {filteredNotifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`border-l-4 ${getNotificationTypeColor(notification.type)} bg-muted/30`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground">
                              {notification.title}
                              <span className="ml-2 h-2 w-2 bg-blue-600 rounded-full inline-block" />
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {formatTime(notification.timestamp)}
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Mark Read
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="read" className="space-y-4">
          {filteredNotifications.map((notification) => (
            <Card key={notification.id} className={`border-l-4 ${getNotificationTypeColor(notification.type)}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-muted-foreground">{notification.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatTime(notification.timestamp)}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => deleteNotification(notification.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose which notifications you'd like to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {settings.map((setting) => (
                <div key={setting.id} className="flex items-center justify-between">
                  <Label htmlFor={setting.id} className="text-base font-normal">
                    {setting.label}
                  </Label>
                  <Switch
                    id={setting.id}
                    checked={setting.enabled}
                    onCheckedChange={() => toggleSetting(setting.id)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}