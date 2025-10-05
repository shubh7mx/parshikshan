'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  BookOpen,
  Upload,
  Brain,
  Award,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Calendar,
  FileText,
  Bell,
  Target,
  Users,
  Star,
  ArrowRight,
  Plus,
  Activity
} from 'lucide-react';
import { NotificationProvider } from '@/components/notifications/notification-provider';

// Mock data for dashboard overview
const dashboardData = {
  user: {
    name: 'John Doe',
    role: 'Student',
    program: 'Computer Science',
    semester: 'Semester 6',
    profileImage: '/api/placeholder/32/32'
  },
  internshipProgress: {
    totalDays: 90,
    completedDays: 45,
    currentWeek: 7,
    remainingDays: 45
  },
  logbookEntries: {
    total: 45,
    thisWeek: 5,
    pending: 2,
    approved: 40
  },
  files: {
    total: 12,
    thisWeek: 3,
    categories: {
      resume: 2,
      certificate: 4,
      report: 3,
      document: 2,
      image: 1
    }
  },
  skillsAssessments: {
    available: 8,
    completed: 3,
    inProgress: 1,
    averageScore: 85
  },
  credits: {
    required: 20,
    earned: 15,
    pending: 3,
    remaining: 2
  },
  upcomingDeadlines: [
    {
      title: 'Weekly Report Submission',
      date: '2024-01-20',
      type: 'report',
      urgent: true
    },
    {
      title: 'Skills Assessment: React',
      date: '2024-01-22',
      type: 'assessment',
      urgent: false
    },
    {
      title: 'Mid-term Evaluation',
      date: '2024-01-25',
      type: 'evaluation',
      urgent: false
    }
  ],
  recentActivity: [
    {
      action: 'Submitted weekly report for Week 6',
      timestamp: '2024-01-15T10:30:00Z',
      type: 'report'
    },
    {
      action: 'Completed JavaScript Skills Assessment (Score: 92%)',
      timestamp: '2024-01-14T15:45:00Z',
      type: 'assessment'
    },
    {
      action: 'Uploaded certificate: Python Basics',
      timestamp: '2024-01-13T09:20:00Z',
      type: 'file'
    },
    {
      action: 'Added 3 logbook entries for this week',
      timestamp: '2024-01-12T14:15:00Z',
      type: 'logbook'
    }
  ]
};

function DashboardContent() {
  const { user } = useAuth();
  const [data, setData] = useState(dashboardData);

  const progressPercentage = (data.internshipProgress.completedDays / data.internshipProgress.totalDays) * 100;
  const creditProgress = (data.credits.earned / data.credits.required) * 100;

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'report': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'assessment': return <Brain className="h-4 w-4 text-purple-500" />;
      case 'file': return <Upload className="h-4 w-4 text-green-500" />;
      case 'logbook': return <BookOpen className="h-4 w-4 text-orange-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getDeadlineUrgency = (date: string) => {
    const deadline = new Date(date);
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return { color: 'text-red-600', badge: 'urgent' };
    if (diffDays <= 3) return { color: 'text-yellow-600', badge: 'soon' };
    return { color: 'text-green-600', badge: 'upcoming' };
  };

  return (
    <NotificationProvider>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6 lg:space-y-8">
        {/* Welcome Header */}
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight">
              Welcome back, {user?.name || 'Student'}! 👋
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <p className="text-muted-foreground text-xs sm:text-sm">
                {data.user.program} • {data.user.semester} • Week {data.internshipProgress.currentWeek}
              </p>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-lg sm:text-xl font-bold text-primary">Day {data.internshipProgress.completedDays}</span>
                <span className="text-muted-foreground">of {data.internshipProgress.totalDays}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Internship Progress
            </CardTitle>
            <CardDescription>Your overall internship completion status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Overall Progress</span>
                  <span className="font-medium">{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-3" />
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-green-600">{data.internshipProgress.completedDays}</div>
                  <div className="text-xs text-muted-foreground">Days Completed</div>
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-blue-600">{data.internshipProgress.currentWeek}</div>
                  <div className="text-xs text-muted-foreground">Current Week</div>
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-bold text-orange-600">{data.internshipProgress.remainingDays}</div>
                  <div className="text-xs text-muted-foreground">Days Remaining</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Logbook Entries</p>
                  <p className="text-2xl font-bold">{data.logbookEntries.total}</p>
                  <p className="text-xs text-green-600">+{data.logbookEntries.thisWeek} this week</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-500" />
              </div>
              <div className="mt-4">
                <Link href="/logbook">
                  <Button variant="outline"  className="w-full">
                    View Logbook <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Files Uploaded</p>
                  <p className="text-2xl font-bold">{data.files.total}</p>
                  <p className="text-xs text-green-600">+{data.files.thisWeek} this week</p>
                </div>
                <Upload className="h-8 w-8 text-green-500" />
              </div>
              <div className="mt-4">
                <Link href="/files">
                  <Button variant="outline"  className="w-full">
                    Manage Files <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Skills Score</p>
                  <p className="text-2xl font-bold">{data.skillsAssessments.averageScore}%</p>
                  <p className="text-xs text-blue-600">{data.skillsAssessments.completed} completed</p>
                </div>
                <Brain className="h-8 w-8 text-purple-500" />
              </div>
              <div className="mt-4">
                <Link href="/skills-assessment">
                  <Button variant="outline"  className="w-full">
                    Take Assessment <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Credits Progress</p>
                  <p className="text-2xl font-bold">{Math.round(creditProgress)}%</p>
                  <p className="text-xs text-orange-600">{data.credits.earned}/{data.credits.required} earned</p>
                </div>
                <Award className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="mt-4">
                <Link href="/credits">
                  <Button variant="outline"  className="w-full">
                    View Credits <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Upcoming Deadlines
              </CardTitle>
              <CardDescription>Important dates and submissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.upcomingDeadlines.map((deadline, index) => {
                const urgency = getDeadlineUrgency(deadline.date);
                return (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{deadline.title}</h4>
                      <p className={`text-xs ${urgency.color}`}>
                        {new Date(deadline.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge 
                      variant={urgency.badge === 'urgent' ? 'destructive' : urgency.badge === 'soon' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {urgency.badge}
                    </Badge>
                  </div>
                );
              })}
              <Button variant="outline" className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                View All Deadlines
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Your latest actions and updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <BookOpen className="h-4 w-4 mr-2" />
                Add Logbook Entry
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Brain className="h-4 w-4 mr-2" />
                Start Assessment
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Bell className="h-4 w-4 mr-2" />
                View Notifications
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* File Categories Overview */}
        <Card>
          <CardHeader>
            <CardTitle>File Management Overview</CardTitle>
            <CardDescription>Your documents organized by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(data.files.categories).map(([category, count]) => (
                <div key={category} className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-sm text-muted-foreground capitalize">{category}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status Alerts */}
        <div className="space-y-4">
          {data.logbookEntries.pending > 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You have {data.logbookEntries.pending} pending logbook entries that need approval.
              </AlertDescription>
            </Alert>
          )}
          
          {data.skillsAssessments.inProgress > 0 && (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                You have {data.skillsAssessments.inProgress} assessment(s) in progress. Complete them to track your progress.
              </AlertDescription>
            </Alert>
          )}
          
          {data.credits.pending > 0 && (
            <Alert>
              <Award className="h-4 w-4" />
              <AlertDescription>
                {data.credits.pending} credits are pending approval. Contact your academic advisor for updates.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </NotificationProvider>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
