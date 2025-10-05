'use client';

import React, { useState } from 'react';
import { 
  Users,
  Search,
  Filter,
  UserCheck,
  MessageSquare,
  Calendar,
  Award,
  BookOpen,
  TrendingUp,
  Mail,
  Phone,
  MapPin,
  GraduationCap
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

// Mock data - In real app, this would come from API
const mockStudents = [
  {
    id: '1',
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '+977-9841234567',
    profileImage: '',
    program: 'Computer Engineering',
    semester: '7th',
    internship: {
      company: 'TechCorp Nepal',
      position: 'Software Engineer Intern',
      status: 'active',
      startDate: '2024-06-01',
      progress: 75
    },
    logbook: {
      totalEntries: 15,
      verifiedEntries: 12,
      lastEntry: '2024-06-20'
    },
    performance: {
      overallGrade: 'A-',
      attendanceRate: 95,
      taskCompletion: 88
    }
  },
  {
    id: '2',
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    phone: '+977-9812345678',
    profileImage: '',
    program: 'Information Technology',
    semester: '6th',
    internship: {
      company: 'Digital Solutions',
      position: 'Web Developer Intern',
      status: 'active',
      startDate: '2024-05-15',
      progress: 60
    },
    logbook: {
      totalEntries: 18,
      verifiedEntries: 15,
      lastEntry: '2024-06-19'
    },
    performance: {
      overallGrade: 'B+',
      attendanceRate: 90,
      taskCompletion: 82
    }
  },
  {
    id: '3',
    name: 'Anita Thapa',
    email: 'anita.thapa@example.com',
    phone: '+977-9823456789',
    profileImage: '',
    program: 'Computer Engineering',
    semester: '8th',
    internship: {
      company: 'Innovation Hub',
      position: 'Full Stack Developer Intern',
      status: 'completed',
      startDate: '2024-04-01',
      progress: 100
    },
    logbook: {
      totalEntries: 45,
      verifiedEntries: 45,
      lastEntry: '2024-06-15'
    },
    performance: {
      overallGrade: 'A',
      attendanceRate: 98,
      taskCompletion: 96
    }
  }
];

const statusColors = {
  active: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  pending: 'bg-yellow-100 text-yellow-800',
  cancelled: 'bg-red-100 text-red-800'
};

export default function FacultyStudents() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.internship.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.internship.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Student Management</h1>
          <p className="text-muted-foreground mt-2">
            Monitor and support your students during their internships.
          </p>
        </div>
        <Button>
          <MessageSquare className="mr-2 h-4 w-4" />
          Send Message
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStudents.length}</div>
            <p className="text-xs text-muted-foreground">Under supervision</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Internships</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockStudents.filter(s => s.internship.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(mockStudents.reduce((acc, s) => acc + s.performance.attendanceRate, 0) / mockStudents.length)}%
            </div>
            <p className="text-xs text-muted-foreground">Attendance rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Logbook Entries</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockStudents.reduce((acc, s) => acc + s.logbook.totalEntries, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total entries</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Students Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="logbooks">Logbooks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={student.profileImage} alt={student.name} />
                      <AvatarFallback>
                        {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{student.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <GraduationCap className="h-3 w-3" />
                            {student.program} - {student.semester} Semester
                          </div>
                        </div>
                        <Badge className={statusColors[student.internship.status]}>
                          {student.internship.status}
                        </Badge>
                      </div>
                      
                      <div className="mt-3 space-y-2">
                        <div className="text-sm">
                          <strong>Internship:</strong> {student.internship.position}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <strong>Company:</strong> {student.internship.company}
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Progress</span>
                            <span>{student.internship.progress}%</span>
                          </div>
                          <Progress value={student.internship.progress} className="h-1" />
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            {student.logbook.verifiedEntries}/{student.logbook.totalEntries} entries
                          </div>
                          <div className="flex items-center gap-1">
                            <Award className="h-3 w-3" />
                            Grade: {student.performance.overallGrade}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline">
                          <MessageSquare className="mr-1 h-3 w-3" />
                          Message
                        </Button>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>Student performance metrics and grades</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Internship</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Attendance</TableHead>
                    <TableHead>Task Completion</TableHead>
                    <TableHead>Progress</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={student.profileImage} alt={student.name} />
                            <AvatarFallback className="text-xs">
                              {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{student.name}</div>
                            <div className="text-xs text-muted-foreground">{student.semester} Semester</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{student.program}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{student.internship.company}</div>
                          <div className="text-xs text-muted-foreground">{student.internship.position}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{student.performance.overallGrade}</Badge>
                      </TableCell>
                      <TableCell>{student.performance.attendanceRate}%</TableCell>
                      <TableCell>{student.performance.taskCompletion}%</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={student.internship.progress} className="h-2 w-16" />
                          <span className="text-xs">{student.internship.progress}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logbooks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Logbook Status</CardTitle>
              <CardDescription>Monitor student logbook submissions and verification status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Total Entries</TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead>Pending</TableHead>
                    <TableHead>Last Entry</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => {
                    const pendingEntries = student.logbook.totalEntries - student.logbook.verifiedEntries;
                    return (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={student.profileImage} alt={student.name} />
                              <AvatarFallback className="text-xs">
                                {student.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{student.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{student.logbook.totalEntries}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{student.logbook.verifiedEntries}</Badge>
                        </TableCell>
                        <TableCell>
                          {pendingEntries > 0 ? (
                            <Badge variant="outline">{pendingEntries}</Badge>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(student.logbook.lastEntry).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            Review Entries
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}