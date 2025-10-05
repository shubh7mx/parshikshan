'use client';

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  Building2, 
  GraduationCap,
  Calendar,
  Download,
  Filter
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock data for charts
const monthlyInternships = [
  { month: 'Jan', total: 45, completed: 38, active: 7 },
  { month: 'Feb', total: 52, completed: 41, active: 11 },
  { month: 'Mar', total: 67, completed: 55, active: 12 },
  { month: 'Apr', total: 78, completed: 62, active: 16 },
  { month: 'May', total: 89, completed: 71, active: 18 },
  { month: 'Jun', total: 94, completed: 76, active: 18 },
];

const applicationTrends = [
  { month: 'Jan', applications: 120, accepted: 45, rejected: 35, pending: 40 },
  { month: 'Feb', applications: 135, accepted: 52, rejected: 38, pending: 45 },
  { month: 'Mar', applications: 156, accepted: 67, rejected: 42, pending: 47 },
  { month: 'Apr', applications: 178, accepted: 78, rejected: 48, pending: 52 },
  { month: 'May', applications: 198, accepted: 89, rejected: 54, pending: 55 },
  { month: 'Jun', applications: 212, accepted: 94, rejected: 58, pending: 60 },
];

const industryDistribution = [
  { name: 'Technology', value: 35, color: '#0088FE' },
  { name: 'Finance', value: 18, color: '#00C49F' },
  { name: 'Healthcare', value: 15, color: '#FFBB28' },
  { name: 'Manufacturing', value: 12, color: '#FF8042' },
  { name: 'Education', value: 10, color: '#8884D8' },
  { name: 'Others', value: 10, color: '#82CA9D' },
];

const collegePerformance = [
  { college: 'IIT Delhi', students: 45, completed: 42, rating: 4.8 },
  { college: 'IIT Mumbai', students: 38, completed: 35, rating: 4.7 },
  { college: 'BITS Pilani', students: 32, completed: 30, rating: 4.6 },
  { college: 'NIT Trichy', students: 28, completed: 25, rating: 4.5 },
  { college: 'VIT Vellore', students: 25, completed: 22, rating: 4.4 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export default function AnalyticsDashboard() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive insights into internship program performance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="6months">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Internships</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">425</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partner Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+15%</span> from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84.2%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2.1%</span> from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="industries">Industries</TabsTrigger>
          <TabsTrigger value="colleges">Colleges</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Internship Trends</CardTitle>
                <CardDescription>Total, completed, and active internships over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyInternships}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="total" 
                      stackId="1"
                      stroke="#8884d8" 
                      fill="#8884d8" 
                      fillOpacity={0.6}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="completed" 
                      stackId="1"
                      stroke="#82ca9d" 
                      fill="#82ca9d" 
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Application Success Rate</CardTitle>
                <CardDescription>Monthly application processing trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={applicationTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="applications" 
                      stroke="#8884d8" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="accepted" 
                      stroke="#82ca9d" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Processing Trends</CardTitle>
              <CardDescription>Detailed breakdown of application status over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={applicationTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="accepted" stackId="a" fill="#82ca9d" />
                  <Bar dataKey="rejected" stackId="a" fill="#ff8042" />
                  <Bar dataKey="pending" stackId="a" fill="#ffbb28" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="industries" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Industry Distribution</CardTitle>
                <CardDescription>Internship distribution across different industries</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={industryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(props: any) => {
                        const percent = props.percent || 0;
                        const name = props.name || '';
                        return `${name} ${(percent * 100).toFixed(0)}%`;
                      }}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {industryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Industry Growth</CardTitle>
                <CardDescription>Year-over-year growth by industry</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {industryDistribution.map((industry, index) => (
                    <div key={industry.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: industry.color }}
                        />
                        <span className="font-medium">{industry.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{industry.value}%</div>
                        <div className="text-xs text-green-600">+{Math.floor(Math.random() * 10 + 1)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="colleges" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Colleges</CardTitle>
              <CardDescription>College-wise internship completion rates and ratings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {collegePerformance.map((college, index) => (
                  <div key={college.college} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{college.college}</div>
                        <div className="text-sm text-muted-foreground">
                          {college.students} students • {college.completed} completed
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{((college.completed / college.students) * 100).toFixed(1)}%</div>
                      <div className="text-sm text-muted-foreground">★ {college.rating}</div>
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