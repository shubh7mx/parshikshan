'use client';

import React, { useState } from 'react';
import { 
  Award,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  GraduationCap,
  Star,
  TrendingUp,
  Upload
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Mock data - In real app, this would come from API
const mockCreditData = {
  totalCreditsEarned: 12,
  totalCreditsRequired: 15,
  currentGPA: 3.75,
  completedActivities: [
    {
      id: '1',
      title: 'Technical Skills Assessment',
      type: 'Assessment',
      credits: 3,
      status: 'completed',
      completedDate: '2024-06-15',
      grade: 'A',
      feedback: 'Excellent understanding of web development concepts and practical implementation.'
    },
    {
      id: '2',
      title: 'Project Deliverables',
      type: 'Project Work',
      credits: 6,
      status: 'completed',
      completedDate: '2024-06-10',
      grade: 'A-',
      feedback: 'High-quality code delivery and good documentation practices.'
    },
    {
      id: '3',
      title: 'Logbook Maintenance',
      type: 'Documentation',
      credits: 2,
      status: 'completed',
      completedDate: '2024-06-05',
      grade: 'B+',
      feedback: 'Consistent documentation with room for more detailed learning reflections.'
    },
    {
      id: '4',
      title: 'Industry Presentation',
      type: 'Presentation',
      credits: 1,
      status: 'completed',
      completedDate: '2024-05-30',
      grade: 'A',
      feedback: 'Clear communication and professional presentation delivery.'
    }
  ],
  pendingActivities: [
    {
      id: '5',
      title: 'Final Project Report',
      type: 'Report',
      credits: 3,
      status: 'pending',
      dueDate: '2024-07-01',
      description: 'Comprehensive report on internship experience and technical achievements.'
    }
  ],
  creditRequirements: [
    { category: 'Technical Skills', required: 4, earned: 3, percentage: 75 },
    { category: 'Project Work', required: 6, earned: 6, percentage: 100 },
    { category: 'Documentation', required: 2, earned: 2, percentage: 100 },
    { category: 'Professional Skills', required: 3, earned: 1, percentage: 33 }
  ]
};

export default function CreditIntegration() {
  const [selectedTab, setSelectedTab] = useState('overview');

  const completionPercentage = (mockCreditData.totalCreditsEarned / mockCreditData.totalCreditsRequired) * 100;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Credit Integration</h1>
          <p className="text-muted-foreground mt-2">
            Track your academic credits earned through internship activities.
          </p>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Submit Work
        </Button>
      </div>

      {/* Credit Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credits Earned</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockCreditData.totalCreditsEarned}/{mockCreditData.totalCreditsRequired}
            </div>
            <p className="text-xs text-muted-foreground">Academic credits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current GPA</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCreditData.currentGPA}</div>
            <p className="text-xs text-muted-foreground">Grade point average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(completionPercentage)}%</div>
            <p className="text-xs text-muted-foreground">Overall progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activities</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockCreditData.completedActivities.length}
            </div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Credit Progress</CardTitle>
          <CardDescription>Progress towards completing required credits by category</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {mockCreditData.creditRequirements.map((requirement) => (
            <div key={requirement.category} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{requirement.category}</span>
                <span className="text-sm text-muted-foreground">
                  {requirement.earned}/{requirement.required} credits
                </span>
              </div>
              <Progress value={requirement.percentage} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Detailed Activities */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Recent Completions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockCreditData.completedActivities.slice(0, 3).map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{activity.title}</h4>
                      <p className="text-sm text-muted-foreground">{activity.type}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{activity.credits} credits</Badge>
                      <p className="text-xs text-muted-foreground mt-1">Grade: {activity.grade}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  Upcoming Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockCreditData.pendingActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{activity.title}</h4>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{activity.credits} credits</Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        Due: {new Date(activity.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Completed Activities</CardTitle>
              <CardDescription>All completed credit-earning activities with grades and feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Activity</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Completed</TableHead>
                    <TableHead>Feedback</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCreditData.completedActivities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">{activity.title}</TableCell>
                      <TableCell>{activity.type}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{activity.credits}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">{activity.grade}</Badge>
                      </TableCell>
                      <TableCell>{new Date(activity.completedDate).toLocaleDateString()}</TableCell>
                      <TableCell className="max-w-xs truncate" title={activity.feedback}>
                        {activity.feedback}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Activities</CardTitle>
              <CardDescription>Outstanding activities required for credit completion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCreditData.pendingActivities.map((activity) => (
                  <div key={activity.id} className="border rounded-lg p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{activity.title}</h3>
                        <p className="text-muted-foreground">{activity.type}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="mb-2">{activity.credits} credits</Badge>
                        <p className="text-sm text-muted-foreground">
                          Due: {new Date(activity.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm">{activity.description}</p>
                    <div className="flex gap-2">
                      <Button size="sm">
                        <Upload className="mr-2 h-4 w-4" />
                        Submit Work
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        View Requirements
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}