'use client';

import React, { useState } from 'react';
import { 
  Settings as SettingsIcon,
  Bell,
  Shield,
  Palette,
  Globe,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Key,
  Smartphone,
  Mail,
  Save
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';

// Mock data - In real app, this would come from API
const mockSettings = {
  notifications: {
    emailNotifications: true,
    pushNotifications: true,
    applicationUpdates: true,
    mentorFeedback: true,
    deadlineReminders: true,
    systemAlerts: false,
    weeklyDigest: true
  },
  privacy: {
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowInternshipInvites: true,
    allowMentorRequests: true
  },
  appearance: {
    theme: 'system',
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timezone: 'Asia/Kathmandu'
  },
  security: {
    twoFactorEnabled: false,
    lastPasswordChange: '2024-05-15',
    activeSessions: 3
  }
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(mockSettings);
  const [selectedTab, setSelectedTab] = useState('notifications');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const updateNotificationSetting = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value }
    }));
  };

  const updatePrivacySetting = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      privacy: { ...prev.privacy, [key]: value }
    }));
  };

  const updateAppearanceSetting = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      appearance: { ...prev.appearance, [key]: value }
    }));
  };

  const handleExportData = () => {
    console.log('Exporting user data...');
    // Here you would implement data export functionality
  };

  const handleDeleteAccount = () => {
    console.log('Deleting account...');
    // Here you would implement account deletion
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account preferences and privacy settings.
          </p>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose what notifications you'd like to receive and how you'd like to receive them.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Delivery Methods</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={settings.notifications.emailNotifications}
                      onCheckedChange={(value) => updateNotificationSetting('emailNotifications', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                    </div>
                    <Switch
                      checked={settings.notifications.pushNotifications}
                      onCheckedChange={(value) => updateNotificationSetting('pushNotifications', value)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Notification Types</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Application Updates</Label>
                      <p className="text-sm text-muted-foreground">Updates about your internship applications</p>
                    </div>
                    <Switch
                      checked={settings.notifications.applicationUpdates}
                      onCheckedChange={(value) => updateNotificationSetting('applicationUpdates', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Mentor Feedback</Label>
                      <p className="text-sm text-muted-foreground">Notifications when mentors provide feedback</p>
                    </div>
                    <Switch
                      checked={settings.notifications.mentorFeedback}
                      onCheckedChange={(value) => updateNotificationSetting('mentorFeedback', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Deadline Reminders</Label>
                      <p className="text-sm text-muted-foreground">Reminders about upcoming deadlines</p>
                    </div>
                    <Switch
                      checked={settings.notifications.deadlineReminders}
                      onCheckedChange={(value) => updateNotificationSetting('deadlineReminders', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>System Alerts</Label>
                      <p className="text-sm text-muted-foreground">Important system-wide announcements</p>
                    </div>
                    <Switch
                      checked={settings.notifications.systemAlerts}
                      onCheckedChange={(value) => updateNotificationSetting('systemAlerts', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Weekly Digest</Label>
                      <p className="text-sm text-muted-foreground">Weekly summary of your activity</p>
                    </div>
                    <Switch
                      checked={settings.notifications.weeklyDigest}
                      onCheckedChange={(value) => updateNotificationSetting('weeklyDigest', value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy Settings
              </CardTitle>
              <CardDescription>
                Control who can see your information and contact you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Profile Visibility</h4>
                <div className="space-y-2">
                  <Label htmlFor="profileVisibility">Who can see your profile</Label>
                  <Select
                    value={settings.privacy.profileVisibility}
                    onValueChange={(value) => updatePrivacySetting('profileVisibility', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Everyone</SelectItem>
                      <SelectItem value="members">Platform Members Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Contact Information</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Show Email Address</Label>
                      <p className="text-sm text-muted-foreground">Allow others to see your email</p>
                    </div>
                    <Switch
                      checked={settings.privacy.showEmail}
                      onCheckedChange={(value) => updatePrivacySetting('showEmail', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Show Phone Number</Label>
                      <p className="text-sm text-muted-foreground">Allow others to see your phone number</p>
                    </div>
                    <Switch
                      checked={settings.privacy.showPhone}
                      onCheckedChange={(value) => updatePrivacySetting('showPhone', value)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Communication</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Allow Internship Invites</Label>
                      <p className="text-sm text-muted-foreground">Let companies invite you to internships</p>
                    </div>
                    <Switch
                      checked={settings.privacy.allowInternshipInvites}
                      onCheckedChange={(value) => updatePrivacySetting('allowInternshipInvites', value)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Allow Mentor Requests</Label>
                      <p className="text-sm text-muted-foreground">Allow mentors to reach out to you</p>
                    </div>
                    <Switch
                      checked={settings.privacy.allowMentorRequests}
                      onCheckedChange={(value) => updatePrivacySetting('allowMentorRequests', value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance & Localization
              </CardTitle>
              <CardDescription>
                Customize how the application looks and behaves for you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={settings.appearance.theme}
                    onValueChange={(value) => updateAppearanceSetting('theme', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={settings.appearance.language}
                    onValueChange={(value) => updateAppearanceSetting('language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ne">नेपाली (Nepali)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Select
                    value={settings.appearance.dateFormat}
                    onValueChange={(value) => updateAppearanceSetting('dateFormat', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={settings.appearance.timezone}
                    onValueChange={(value) => updateAppearanceSetting('timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kathmandu">Asia/Kathmandu</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">America/New_York</SelectItem>
                      <SelectItem value="Europe/London">Europe/London</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Password & Security
              </CardTitle>
              <CardDescription>
                Manage your account security and authentication settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Change Password</h4>
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Enter current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter new password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Update Password
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Enable 2FA</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {settings.security.twoFactorEnabled && (
                      <Badge variant="default">Enabled</Badge>
                    )}
                    <Button variant="outline">
                      <Smartphone className="mr-2 h-4 w-4" />
                      {settings.security.twoFactorEnabled ? 'Manage' : 'Enable'} 2FA
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Security Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Last password change:</span>
                    <span className="text-muted-foreground">
                      {new Date(settings.security.lastPasswordChange).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Active sessions:</span>
                    <span className="text-muted-foreground">{settings.security.activeSessions}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data & Account Management */}
          <Card>
            <CardHeader>
              <CardTitle>Data & Account Management</CardTitle>
              <CardDescription>
                Export your data or delete your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Export Your Data</Label>
                  <p className="text-sm text-muted-foreground">Download a copy of all your data</p>
                </div>
                <Button variant="outline" onClick={handleExportData}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-destructive">Delete Account</Label>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Account</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove all your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDeleteAccount}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}