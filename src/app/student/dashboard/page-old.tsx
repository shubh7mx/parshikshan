'use client';

import React from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  FileText, 
  Search, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Calendar,
  Users,
  TrendingUp,
  Plus
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Mock data - In real app, this would come from API
const dashboardData = {
  stats: {
    totalApplications: 5,
    activeInternships: 1,
    completedInternships: 0,
    logbookEntries: 12,
  },
  currentInternship: {
    id: '1',
    title: 'Frontend Developer Intern',
    company: 'TechCorp Solutions',
    duration: 12,
    progress: 45,
    startDate: '2024-07-01',
    endDate: '2024-09-30',
    mentor: 'John Smith',
  },
  recentApplications: [
    { id: '1', title: 'Backend Developer Intern', company: 'StartupXYZ', status: 'pending', appliedDate: '2024-06-15' },
    { id: '2', title: 'Data Analyst Intern', company: 'DataCorp', status: 'rejected', appliedDate: '2024-06-10' },
    { id: '3', title: 'UI/UX Designer Intern', company: 'DesignHub', status: 'shortlisted', appliedDate: '2024-06-05' },
  ],
  upcomingDeadlines: [
    { id: '1', title: 'Weekly Report Submission', date: '2024-06-20', type: 'report' },
    { id: '2', title: 'Internship Application Deadline', company: 'TechGiant', date: '2024-06-25', type: 'application' },
    { id: '3', title: 'Logbook Entry Review', date: '2024-06-22', type: 'logbook' },
  ],
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'selected':
      return 'bg-green-500';
    case 'shortlisted':
      return 'bg-blue-500';
    case 'pending':
      return 'bg-yellow-500';
    case 'rejected':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'selected':
      return 'default';
    case 'shortlisted':
      return 'secondary';
    case 'pending':
      return 'outline';
    case 'rejected':
      return 'destructive';
    default:
      return 'outline';
  }
};

export default function StudentDashboard() {
  const { stats, currentInternship, recentApplications, upcomingDeadlines } = dashboardData;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here's an overview of your internship journey.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">Across all programs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Internships</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeInternships}</div>
            <p className="text-xs text-muted-foreground">Currently ongoing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedInternships}</div>
            <p className="text-xs text-muted-foreground">Successfully finished</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Logbook Entries</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.logbookEntries}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Internship */}
        {currentInternship && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Current Internship
              </CardTitle>
              <CardDescription>Your active internship progress</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{currentInternship.title}</h3>
                <p className="text-sm text-muted-foreground">{currentInternship.company}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{currentInternship.progress}%</span>
                </div>
                <Progress value={currentInternship.progress} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Duration:</span>
                  <p className="font-medium">{currentInternship.duration} weeks</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Mentor:</span>
                  <p className="font-medium">{currentInternship.mentor}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Start Date:</span>
                  <p className="font-medium">{new Date(currentInternship.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">End Date:</span>
                  <p className="font-medium">{new Date(currentInternship.endDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button  asChild>
                  <Link href="/student/logbook">Update Logbook</Link>
                </Button>
                <Button  variant="outline" asChild>
                  <Link href="/student/reports">Submit Report</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" asChild>
              <Link href="/student/internships">
                <Search className="mr-2 h-4 w-4" />
                Find New Internships
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/student/applications">
                <FileText className="mr-2 h-4 w-4" />
                View My Applications
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/student/logbook">
                <BookOpen className="mr-2 h-4 w-4" />
                Daily Logbook Entry
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/student/reports">
                <Plus className="mr-2 h-4 w-4" />
                Create Report
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>Your latest internship applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentApplications.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{app.title}</p>
                    <p className="text-xs text-muted-foreground">{app.company}</p>
                    <p className="text-xs text-muted-foreground">
                      Applied: {new Date(app.appliedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={getStatusVariant(app.status)}>
                    {app.status}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="pt-4">
              <Button variant="outline"  asChild>
                <Link href="/student/applications">View All Applications</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>Don't miss these important dates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingDeadlines.map((deadline) => (
                <div key={deadline.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 space-y-1">
                    <p className="font-medium text-sm">{deadline.title}</p>
                    {deadline.company && (
                      <p className="text-xs text-muted-foreground">{deadline.company}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Due: {new Date(deadline.date).toLocaleDateString()}
                    </p>
                  </div>
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}