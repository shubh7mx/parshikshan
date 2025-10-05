'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Users, 
  GraduationCap, 
  BarChart3, 
  Shield, 
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Mock data - In real app, this would come from API
const adminDashboardData = {
  systemStats: {
    totalUsers: 2847,
    totalColleges: 45,
    totalCompanies: 156,
    totalInternships: 892,
    activeInternships: 234,
    completedInternships: 658,
  },
  pendingApprovals: [
    { id: '1', type: 'College', name: 'MIT College of Engineering', submittedDate: '2024-06-18' },
    { id: '2', type: 'Company', name: 'TechStart Solutions Pvt Ltd', submittedDate: '2024-06-17' },
    { id: '3', type: 'College', name: 'Delhi Technical University', submittedDate: '2024-06-16' },
  ],
  recentActivities: [
    { id: '1', action: 'New college registered', entity: 'Bangalore Institute of Technology', time: '2 hours ago' },
    { id: '2', action: 'Company verified', entity: 'DataCorp Analytics', time: '4 hours ago' },
    { id: '3', action: 'Internship program created', entity: 'Frontend Developer - TechCorp', time: '6 hours ago' },
    { id: '4', action: 'User role updated', entity: 'Dr. Priya Sharma (Faculty)', time: '1 day ago' },
  ],
  complianceMetrics: {
    nepCompliance: 95,
    dataPrivacy: 100,
    securityScore: 88,
    systemHealth: 97,
  }
};

export default function AdminDashboard() {
  const { systemStats, pendingApprovals, recentActivities, complianceMetrics } = adminDashboardData;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          System overview and management controls.
        </p>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All roles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Colleges</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalColleges}</div>
            <p className="text-xs text-muted-foreground">Registered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalCompanies}</div>
            <p className="text-xs text-muted-foreground">Verified partners</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Internships</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.totalInternships}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.activeInternships}</div>
            <p className="text-xs text-muted-foreground">Ongoing now</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemStats.completedInternships}</div>
            <p className="text-xs text-muted-foreground">Successfully finished</p>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            System Compliance & Health
          </CardTitle>
          <CardDescription>NEP 2020 compliance and system performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">NEP 2020 Compliance</span>
                <span className="text-sm text-muted-foreground">{complianceMetrics.nepCompliance}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${complianceMetrics.nepCompliance}%` }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Data Privacy</span>
                <span className="text-sm text-muted-foreground">{complianceMetrics.dataPrivacy}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${complianceMetrics.dataPrivacy}%` }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Security Score</span>
                <span className="text-sm text-muted-foreground">{complianceMetrics.securityScore}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full" 
                  style={{ width: `${complianceMetrics.securityScore}%` }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">System Health</span>
                <span className="text-sm text-muted-foreground">{complianceMetrics.systemHealth}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${complianceMetrics.systemHealth}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Admin Actions</CardTitle>
            <CardDescription>System management and oversight</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" asChild>
              <Link href="/admin/approvals">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Review Pending Approvals
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/users">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/colleges">
                <Building2 className="mr-2 h-4 w-4" />
                College Management
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/companies">
                <Building2 className="mr-2 h-4 w-4" />
                Company Verification
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/analytics">
                <BarChart3 className="mr-2 h-4 w-4" />
                System Analytics
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/settings">
                <Settings className="mr-2 h-4 w-4" />
                System Settings
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Pending Approvals
            </CardTitle>
            <CardDescription>Items requiring your approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApprovals.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Submitted: {new Date(item.submittedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {item.type}
                    </Badge>
                    <Button >
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-4">
              <Button variant="outline"  asChild>
                <Link href="/admin/approvals">View All Pending</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>System Activity Log</CardTitle>
          <CardDescription>Recent system-wide activities and changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.action}:</span>
                    {' '}
                    <span className="text-muted-foreground">{activity.entity}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}