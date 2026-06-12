'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Calendar, 
  TrendingUp, 
  Building,
  UserCheck,
  Award,
  Plus,
  Edit,
  Eye,
  GraduationCap,
  Clock,
  BookOpen,
  Target,
  MessageSquare,
  Download,
  Star,
  ThumbsUp,
  ThumbsDown,
  User,
  Search,
  BarChart3
} from 'lucide-react';
import { useApp } from '@/components/providers/app-provider';
import { dbOperations } from '@/lib/database';

interface FacultyStats {
  totalStudents: number;
  activeInternships: number;
  pendingReports: number;
  completedSupervisions: number;
}

interface Student {
  $id: string;
  name: string;
  email: string;
  rollNumber: string;
  course: string;
  semester: number;
  cgpa?: number;
  skills: string[];
  internshipStatus?: 'active' | 'completed' | 'none';
  currentInternship?: {
    $id: string;
    companyName: string;
    position: string;
    startDate: string;
    endDate: string;
    progress: number;
    mentor?: string;
  };
}

interface Report {
  $id: string;
  studentId: string;
  title: string;
  type: 'weekly' | 'monthly' | 'final';
  submissionDate: string;
  status: 'pending' | 'reviewed' | 'approved' | 'needs_revision';
  content?: string;
  feedback?: string;
  grade?: number;
  student?: {
    name: string;
    rollNumber: string;
  };
}

export default function FacultyDashboard() {
  const { user, userProfile } = useApp();
  const router = useRouter();
  
  const [stats, setStats] = useState<FacultyStats>({
    totalStudents: 0,
    activeInternships: 0,
    pendingReports: 0,
    completedSupervisions: 0
  });
  
  const [students, setStudents] = useState<Student[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reportFeedback, setReportFeedback] = useState('');
  const [reportGrade, setReportGrade] = useState<number>(0);
  const [reportStatus, setReportStatus] = useState<'approved' | 'needs_revision'>('approved');

  useEffect(() => {
    if (user && userProfile) {
      loadFacultyData();
    }
  }, [user, userProfile]);

  const loadFacultyData = async () => {
    try {
      const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID!;
      
      if (!userProfile) return;
      
      // Load students supervised by this faculty (mock data for now)
      const mockStudents: Student[] = [
        {
          $id: '1',
          name: 'Rajesh Kumar',
          email: 'rajesh.kumar@example.com',
          rollNumber: '2021CS001',
          course: 'Computer Science',
          semester: 6,
          cgpa: 8.5,
          skills: ['React', 'JavaScript', 'Python', 'Machine Learning'],
          internshipStatus: 'active',
          currentInternship: {
            $id: 'int1',
            companyName: 'TechCorp Solutions',
            position: 'Frontend Developer',
            startDate: '2024-06-01',
            endDate: '2024-11-30',
            progress: 65,
            mentor: 'John Smith'
          }
        },
        {
          $id: '2',
          name: 'Priya Sharma',
          email: 'priya.sharma@example.com',
          rollNumber: '2021CS002',
          course: 'Computer Science',
          semester: 6,
          cgpa: 9.1,
          skills: ['Data Science', 'Python', 'SQL', 'Machine Learning', 'Statistics'],
          internshipStatus: 'active',
          currentInternship: {
            $id: 'int2',
            companyName: 'DataAnalytics Inc',
            position: 'Data Analyst',
            startDate: '2024-06-15',
            endDate: '2024-12-15',
            progress: 45,
            mentor: 'Sarah Johnson'
          }
        },
        {
          $id: '3',
          name: 'Amit Patel',
          email: 'amit.patel@example.com',
          rollNumber: '2021CS003',
          course: 'Computer Science',
          semester: 6,
          cgpa: 7.8,
          skills: ['Java', 'Spring Boot', 'SQL', 'REST APIs'],
          internshipStatus: 'completed'
        },
        {
          $id: '4',
          name: 'Sneha Reddy',
          email: 'sneha.reddy@example.com',
          rollNumber: '2021CS004',
          course: 'Computer Science',
          semester: 6,
          cgpa: 8.9,
          skills: ['UI/UX Design', 'Figma', 'Adobe XD', 'CSS', 'JavaScript'],
          internshipStatus: 'none'
        }
      ];
      
      // Mock reports data
      const mockReports: Report[] = [
        {
          $id: 'rep1',
          studentId: '1',
          title: 'Week 8 Progress Report - Frontend Development',
          type: 'weekly',
          submissionDate: '2024-07-20',
          status: 'pending',
          content: 'This week I worked on implementing the user dashboard...',
          student: {
            name: 'Rajesh Kumar',
            rollNumber: '2021CS001'
          }
        },
        {
          $id: 'rep2',
          studentId: '2',
          title: 'Monthly Report - Data Analysis Project',
          type: 'monthly',
          submissionDate: '2024-07-15',
          status: 'approved',
          content: 'This month I focused on analyzing customer data...',
          feedback: 'Excellent work on the statistical analysis. Good insights.',
          grade: 92,
          student: {
            name: 'Priya Sharma',
            rollNumber: '2021CS002'
          }
        },
        {
          $id: 'rep3',
          studentId: '1',
          title: 'Week 7 Progress Report - Frontend Development',
          type: 'weekly',
          submissionDate: '2024-07-13',
          status: 'needs_revision',
          content: 'This week I worked on component development...',
          feedback: 'Please provide more technical details about the implementation.',
          grade: 75,
          student: {
            name: 'Rajesh Kumar',
            rollNumber: '2021CS001'
          }
        }
      ];
      
      setStudents(mockStudents);
      setReports(mockReports);
      
      // Calculate stats
      setStats({
        totalStudents: mockStudents.length,
        activeInternships: mockStudents.filter(s => s.internshipStatus === 'active').length,
        pendingReports: mockReports.filter(r => r.status === 'pending').length,
        completedSupervisions: mockStudents.filter(s => s.internshipStatus === 'completed').length
      });
      
    } catch (error) {
      console.error('Error loading faculty data:', error);
    } finally {
      setLoading(false);
    }
  };

  const reviewReport = async () => {
    if (!selectedReport) return;
    
    try {
      // Update the report in the local state for demo purposes
      const updatedReports = reports.map(report => 
        report.$id === selectedReport.$id 
          ? {
              ...report,
              status: reportStatus,
              feedback: reportFeedback,
              grade: reportGrade
            }
          : report
      );
      
      setReports(updatedReports);
      
      // Update stats
      setStats(prev => ({
        ...prev,
        pendingReports: updatedReports.filter(r => r.status === 'pending').length
      }));
      
      alert('Report reviewed successfully!');
      setShowReviewDialog(false);
      setSelectedReport(null);
      setReportFeedback('');
      setReportGrade(0);
      
    } catch (error) {
      console.error('Error reviewing report:', error);
      alert('Failed to review report. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'needs_revision': return 'bg-red-100 text-red-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'none': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = searchTerm === '' || 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || student.internshipStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const filteredReports = reports.filter(report => {
    const matchesSearch = searchTerm === '' || 
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.student?.rollNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading faculty dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please log in to access your faculty dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome, Prof. {user.name}!</h1>
        <p className="text-muted-foreground">Monitor your students' internship progress and evaluate their performance.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Supervised Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Under your guidance</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Internships</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeInternships}</div>
            <p className="text-xs text-muted-foreground">Currently ongoing</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReports}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedSupervisions}</div>
            <p className="text-xs text-muted-foreground">Successfully supervised</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="students" className="space-y-6">
        <TabsList>
          <TabsTrigger value="students">Students ({students.length})</TabsTrigger>
          <TabsTrigger value="reports">Reports ({reports.length})</TabsTrigger>
          <TabsTrigger value="supervision">Supervision Log</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="students">
          <Card>
            <CardHeader>
              <CardTitle>Supervised Students ({students.length})</CardTitle>
              <CardDescription>Monitor your students' internship progress and performance</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search by student name, roll number, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    <SelectItem value="active">Active Internship</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="none">No Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <div key={student.$id} className="p-6 border rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{student.name}</h3>
                            <Badge className={getStatusColor(student.internshipStatus || 'none')}>
                              {student.internshipStatus === 'active' ? 'Active Internship' :
                               student.internshipStatus === 'completed' ? 'Completed' : 'No Internship'}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-muted-foreground">Roll Number</p>
                              <p className="text-sm font-medium">{student.rollNumber}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Course</p>
                              <p className="text-sm">{student.course} (Sem {student.semester})</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Email</p>
                              <p className="text-sm">{student.email}</p>
                            </div>
                            {student.cgpa && (
                              <div>
                                <p className="text-xs text-muted-foreground">CGPA</p>
                                <p className="text-sm font-medium">{student.cgpa}/10.0</p>
                              </div>
                            )}
                          </div>
                          
                          {student.currentInternship && (
                            <div className="bg-blue-50 p-4 rounded-lg mb-4">
                              <h4 className="font-medium mb-2">Current Internship</h4>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-3">
                                <div>
                                  <p className="text-xs text-muted-foreground">Company</p>
                                  <p className="text-sm font-medium">{student.currentInternship.companyName}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Position</p>
                                  <p className="text-sm">{student.currentInternship.position}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Duration</p>
                                  <p className="text-sm">
                                    {new Date(student.currentInternship.startDate).toLocaleDateString()} - 
                                    {new Date(student.currentInternship.endDate).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Progress</span>
                                  <span>{student.currentInternship.progress}%</span>
                                </div>
                                <Progress value={student.currentInternship.progress} />
                              </div>
                            </div>
                          )}
                          
                          {student.skills && student.skills.length > 0 && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-2">Skills</p>
                              <div className="flex gap-1 flex-wrap">
                                {student.skills.slice(0, 5).map((skill, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                                {student.skills.length > 5 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{student.skills.length - 5} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <Button variant="outline" >
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Contact
                          </Button>
                          <Button variant="outline" >
                            <Eye className="h-3 w-3 mr-1" />
                            View Profile
                          </Button>
                          {student.currentInternship && (
                            <Button >
                              <FileText className="h-3 w-3 mr-1" />
                              View Reports
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16">
                    <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      {searchTerm || statusFilter !== 'all' ? 'No matching students' : 'No students assigned'}
                    </h3>
                    <p className="text-muted-foreground">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'Try adjusting your search or filters.' 
                        : 'Students will appear here once they are assigned to your supervision.'}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Student Reports ({reports.length})</CardTitle>
              <CardDescription>Review and evaluate internship reports submitted by your students</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search by report title or student name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reports</SelectItem>
                    <SelectItem value="pending">Pending Review</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="needs_revision">Needs Revision</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {filteredReports.length > 0 ? (
                  filteredReports.map((report) => (
                    <div key={report.$id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{report.title}</h3>
                            <Badge className={getStatusColor(report.status)}>
                              {report.status.replace('_', ' ')}
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {report.type}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                            <div>
                              <p className="text-xs text-muted-foreground">Student</p>
                              <p className="text-sm">{report.student?.name}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Roll Number</p>
                              <p className="text-sm">{report.student?.rollNumber}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Submitted</p>
                              <p className="text-sm">{new Date(report.submissionDate).toLocaleDateString()}</p>
                            </div>
                            {report.grade && (
                              <div>
                                <p className="text-xs text-muted-foreground">Grade</p>
                                <p className="text-sm font-medium">{report.grade}/100</p>
                              </div>
                            )}
                          </div>
                          
                          {report.feedback && (
                            <div className="bg-gray-50 p-3 rounded mb-3">
                              <p className="text-xs text-muted-foreground mb-1">Your Feedback</p>
                              <p className="text-sm">{report.feedback}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-4">
                          <Button variant="outline" >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                          {report.status === 'pending' && (
                            <Button 
                              
                              onClick={() => {
                                setSelectedReport(report);
                                setShowReviewDialog(true);
                              }}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Review
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16">
                    <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      {searchTerm || statusFilter !== 'all' ? 'No matching reports' : 'No reports submitted'}
                    </h3>
                    <p className="text-muted-foreground">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'Try adjusting your search or filters.' 
                        : 'Student reports will appear here once submitted for review.'}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Review Report Dialog */}
          <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Review Report: {selectedReport?.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Student: {selectedReport?.student?.name} ({selectedReport?.student?.rollNumber})</Label>
                </div>
                
                <div>
                  <Label htmlFor="grade">Grade (out of 100)</Label>
                  <Input
                    id="grade"
                    type="number"
                    min="0"
                    max="100"
                    value={reportGrade}
                    onChange={(e) => setReportGrade(parseInt(e.target.value) || 0)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={reportStatus} onValueChange={(value: any) => setReportStatus(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approved">Approve</SelectItem>
                      <SelectItem value="needs_revision">Needs Revision</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="feedback">Feedback</Label>
                  <Textarea
                    id="feedback"
                    value={reportFeedback}
                    onChange={(e) => setReportFeedback(e.target.value)}
                    placeholder="Provide detailed feedback on the report..."
                    className="min-h-[100px]"
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button onClick={reviewReport}>
                    Submit Review
                  </Button>
                  <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="supervision">
          <Card>
            <CardHeader>
              <CardTitle>Supervision Log</CardTitle>
              <CardDescription>Track your supervision meetings and student progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16">
                <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Supervision Features</h3>
                <p className="text-muted-foreground mb-6">
                  Schedule meetings, track progress, and maintain supervision logs with your students.
                </p>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Supervision Analytics</CardTitle>
              <CardDescription>Analyze student performance and supervision effectiveness</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16">
                <TrendingUp className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
                <p className="text-muted-foreground mb-6">
                  View detailed analytics on student performance, internship completion rates, and supervision metrics.
                </p>
                <Button variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
