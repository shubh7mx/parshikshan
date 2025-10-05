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
  MapPin,
  Clock,
  DollarSign,
  Search,
  Filter,
  Download,
  Mail,
  Phone,
  Building2
} from 'lucide-react';
import { useApp } from '@/components/providers/app-provider';
import { databases, ID } from '@/lib/appwrite';

interface CompanyStats {
  totalPrograms: number;
  activePrograms: number;
  totalApplications: number;
  selectedApplications: number;
}

interface InternshipProgram {
  $id: string;
  title: string;
  description: string;
  duration: number;
  stipend?: number;
  location: string;
  mode: 'onsite' | 'remote' | 'hybrid';
  requiredSkills: string[];
  applicationDeadline: string;
  startDate: string;
  endDate: string;
  status: 'draft' | 'published' | 'closed' | 'completed';
  maxPositions: number;
  applicantCount?: number;
}

interface Application {
  $id: string;
  studentId: string;
  programId: string;
  applicationDate: string;
  status: 'pending' | 'shortlisted' | 'selected' | 'rejected';
  coverLetter: string;
  student?: {
    name: string;
    email: string;
    rollNumber: string;
    cgpa?: number;
    course: string;
    semester: number;
    skills: string[];
  };
  program?: {
    title: string;
  };
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'published': return 'bg-green-100 text-green-800';
    case 'draft': return 'bg-gray-100 text-gray-800';
    case 'closed': return 'bg-red-100 text-red-800';
    case 'completed': return 'bg-blue-100 text-blue-800';
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'shortlisted': return 'bg-blue-100 text-blue-800';
    case 'selected': return 'bg-green-100 text-green-800';
    case 'rejected': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'selected': return 'default';
    case 'shortlisted': return 'secondary';
    case 'pending': return 'outline';
    case 'rejected': return 'destructive';
    default: return 'outline';
  }
};

export default function CompanyDashboard() {
  const { user, userProfile } = useApp();
  const router = useRouter();
  
  const [stats, setStats] = useState<CompanyStats>({
    totalPrograms: 0,
    activePrograms: 0,
    totalApplications: 0,
    selectedApplications: 0
  });
  
  const [programs, setPrograms] = useState<InternshipProgram[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateProgram, setShowCreateProgram] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Form state for creating programs
  const [programForm, setProgramForm] = useState({
    title: '',
    description: '',
    duration: 6,
    stipend: '',
    location: '',
    mode: 'hybrid' as 'onsite' | 'remote' | 'hybrid',
    requiredSkills: '',
    maxPositions: 1,
    applicationDeadline: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    if (user && userProfile) {
      loadDashboardData();
    }
  }, [user, userProfile]);

  const loadDashboardData = async () => {
    try {
      const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID!;
      
      if (!userProfile) return;
      
      // Load company's internship programs
      const programsResult = await databases.listDocuments(
        DATABASE_ID,
        'internship_programs',
        [`companyId="${userProfile.$id}"`]
      );
      
      const programsData = programsResult.documents.map(doc => ({
        $id: doc.$id,
        title: doc.title,
        description: doc.description,
        duration: doc.duration,
        stipend: doc.stipend,
        location: doc.location,
        mode: doc.mode,
        requiredSkills: doc.requiredSkills || [],
        applicationDeadline: doc.applicationDeadline,
        startDate: doc.startDate,
        endDate: doc.endDate,
        status: doc.status,
        maxPositions: doc.maxPositions
      }));
      
      setPrograms(programsData);
      
      // Load applications for company's programs
      let allApplications: Application[] = [];
      
      for (const program of programsData) {
        const applicationsResult = await databases.listDocuments(
          DATABASE_ID,
          'internship_applications',
          [`programId="${program.$id}"`]
        );
        
        const programApplications = await Promise.all(
          applicationsResult.documents.map(async (app) => {
            // Get student details
            try {
              const studentResult = await databases.getDocument(
                DATABASE_ID,
                'students',
                app.studentId
              );
              
              // Get user details for the student
              const userResult = await databases.getDocument(
                DATABASE_ID,
                'users',
                studentResult.userId
              );
              
              return {
                $id: app.$id,
                studentId: app.studentId,
                programId: app.programId,
                applicationDate: app.applicationDate,
                status: app.status,
                coverLetter: app.coverLetter,
                student: {
                  name: userResult.name,
                  email: userResult.email,
                  rollNumber: studentResult.rollNumber,
                  cgpa: studentResult.cgpa,
                  course: studentResult.course,
                  semester: studentResult.semester,
                  skills: studentResult.skills || []
                },
                program: {
                  title: program.title
                }
              };
            } catch (error) {
              console.error('Error fetching student details:', error);
              return {
                $id: app.$id,
                studentId: app.studentId,
                programId: app.programId,
                applicationDate: app.applicationDate,
                status: app.status,
                coverLetter: app.coverLetter,
                program: {
                  title: program.title
                }
              };
            }
          })
        );
        
        allApplications = [...allApplications, ...programApplications];
      }
      
      setApplications(allApplications);
      
      // Calculate stats
      setStats({
        totalPrograms: programsData.length,
        activePrograms: programsData.filter(p => p.status === 'published').length,
        totalApplications: allApplications.length,
        selectedApplications: allApplications.filter(a => a.status === 'selected').length
      });
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProgram = async () => {
    if (!user || !userProfile) return;
    
    try {
      const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID!;
      
      const skillsArray = programForm.requiredSkills
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);
      
      await databases.createDocument(
        DATABASE_ID,
        'internship_programs',
        ID.unique(),
        {
          ...programForm,
          companyId: userProfile.$id,
          companyName: userProfile.name || user.name,
          requiredSkills: skillsArray,
          stipend: programForm.stipend ? parseFloat(programForm.stipend) : 0,
          status: 'draft',
          eligibleCourses: ['computer_science', 'information_technology'] // Default
        }
      );
      
      alert('Internship program created successfully!');
      setShowCreateProgram(false);
      setProgramForm({
        title: '',
        description: '',
        duration: 6,
        stipend: '',
        location: '',
        mode: 'hybrid',
        requiredSkills: '',
        maxPositions: 1,
        applicationDeadline: '',
        startDate: '',
        endDate: ''
      });
      
      loadDashboardData();
      
    } catch (error) {
      console.error('Error creating program:', error);
      alert('Failed to create program. Please try again.');
    }
  };

  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID!;
      
      await databases.updateDocument(
        DATABASE_ID,
        'internship_applications',
        applicationId,
        { status: newStatus }
      );
      
      alert(`Application ${newStatus} successfully!`);
      loadDashboardData();
      
    } catch (error) {
      console.error('Error updating application:', error);
      alert('Failed to update application status.');
    }
  };

  const publishProgram = async (programId: string) => {
    try {
      const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID!;
      
      await databases.updateDocument(
        DATABASE_ID,
        'internship_programs',
        programId,
        { status: 'published' }
      );
      
      alert('Program published successfully!');
      loadDashboardData();
      
    } catch (error) {
      console.error('Error publishing program:', error);
      alert('Failed to publish program.');
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = searchTerm === '' || 
      (app.student?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       app.student?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
       app.student?.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
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
            Please log in to access your dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}!</h1>
        <p className="text-muted-foreground">Manage your internship programs and student applications.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Programs</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPrograms}</div>
            <p className="text-xs text-muted-foreground">All time programs</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Programs</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activePrograms}</div>
            <p className="text-xs text-muted-foreground">Currently published</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
            <p className="text-xs text-muted-foreground">Student applications</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Selected Students</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.selectedApplications}</div>
            <p className="text-xs text-muted-foreground">Confirmed interns</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="programs">Programs ({programs.length})</TabsTrigger>
          <TabsTrigger value="applications">Applications ({applications.length})</TabsTrigger>
          <TabsTrigger value="interns">Active Interns</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Dialog open={showCreateProgram} onOpenChange={setShowCreateProgram}>
                  <DialogTrigger asChild>
                    <Button className="w-full justify-start">
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Program
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create Internship Program</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="title">Program Title *</Label>
                          <Input
                            id="title"
                            value={programForm.title}
                            onChange={(e) => setProgramForm({...programForm, title: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Location *</Label>
                          <Input
                            id="location"
                            value={programForm.location}
                            onChange={(e) => setProgramForm({...programForm, location: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                          id="description"
                          value={programForm.description}
                          onChange={(e) => setProgramForm({...programForm, description: e.target.value})}
                          className="min-h-[80px]"
                        />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="duration">Duration (months) *</Label>
                          <Input
                            id="duration"
                            type="number"
                            value={programForm.duration}
                            onChange={(e) => setProgramForm({...programForm, duration: parseInt(e.target.value)})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="stipend">Stipend (₹/month)</Label>
                          <Input
                            id="stipend"
                            type="number"
                            value={programForm.stipend}
                            onChange={(e) => setProgramForm({...programForm, stipend: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="maxPositions">Max Positions *</Label>
                          <Input
                            id="maxPositions"
                            type="number"
                            value={programForm.maxPositions}
                            onChange={(e) => setProgramForm({...programForm, maxPositions: parseInt(e.target.value)})}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="mode">Work Mode *</Label>
                          <Select value={programForm.mode} onValueChange={(value: any) => setProgramForm({...programForm, mode: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="onsite">Onsite</SelectItem>
                              <SelectItem value="remote">Remote</SelectItem>
                              <SelectItem value="hybrid">Hybrid</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="requiredSkills">Required Skills *</Label>
                          <Input
                            id="requiredSkills"
                            placeholder="e.g. React, JavaScript, CSS"
                            value={programForm.requiredSkills}
                            onChange={(e) => setProgramForm({...programForm, requiredSkills: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="applicationDeadline">Application Deadline *</Label>
                          <Input
                            id="applicationDeadline"
                            type="datetime-local"
                            value={programForm.applicationDeadline}
                            onChange={(e) => setProgramForm({...programForm, applicationDeadline: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="startDate">Start Date *</Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={programForm.startDate}
                            onChange={(e) => setProgramForm({...programForm, startDate: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="endDate">End Date *</Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={programForm.endDate}
                            onChange={(e) => setProgramForm({...programForm, endDate: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div className="flex gap-2 pt-4">
                        <Button onClick={createProgram} disabled={!programForm.title || !programForm.description}>
                          Create Program
                        </Button>
                        <Button variant="outline" onClick={() => setShowCreateProgram(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button className="w-full justify-start" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Review Applications ({applications.filter(a => a.status === 'pending').length})
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Interviews
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Reports
                </Button>
              </CardContent>
            </Card>

            {/* Recent Applications */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
                <CardDescription>Latest student applications requiring review</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.slice(0, 5).map((application) => (
                    <div key={application.$id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{application.student?.name || 'Unknown Student'}</p>
                        <p className="text-sm text-muted-foreground">
                          {application.program?.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {application.student?.course} • Semester {application.student?.semester}
                        </p>
                        {application.student?.cgpa && (
                          <p className="text-xs text-muted-foreground">CGPA: {application.student.cgpa}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(application.status)}>
                          {application.status}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(application.applicationDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {applications.length === 0 && (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No applications yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="programs">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Internship Programs ({programs.length})</CardTitle>
                <CardDescription>Manage your internship offerings</CardDescription>
              </div>
              <Button onClick={() => setShowCreateProgram(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Program
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {programs.length > 0 ? (
                  programs.map((program) => (
                    <div key={program.$id} className="p-6 border rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{program.title}</h3>
                          <p className="text-gray-700 mb-3 line-clamp-2">{program.description}</p>
                          
                          <div className="flex items-center gap-6 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {program.location}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {program.duration} months
                            </div>
                            {program.stipend && (
                              <div className="flex items-center">
                                <DollarSign className="h-4 w-4 mr-1" />
                                ₹{program.stipend.toLocaleString()}/month
                              </div>
                            )}
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {program.maxPositions} positions
                            </div>
                          </div>
                          
                          <div className="flex gap-2 mb-3">
                            <Badge variant="outline" className="capitalize">{program.mode}</Badge>
                            {program.requiredSkills.slice(0, 3).map((skill, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {program.requiredSkills.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{program.requiredSkills.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <Badge className={getStatusColor(program.status)} >
                            {program.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-muted-foreground">
                          <p>Applications: {applications.filter(a => a.programId === program.$id).length}</p>
                          <p>Deadline: {new Date(program.applicationDeadline).toLocaleDateString()}</p>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" >
                            <Eye className="h-4 w-4 mr-1" />
                            View Applications
                          </Button>
                          <Button variant="outline" >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          {program.status === 'draft' && (
                            <Button  onClick={() => publishProgram(program.$id)}>
                              Publish
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16">
                    <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No programs yet</h3>
                    <p className="text-muted-foreground mb-6">Create your first internship program to start receiving applications from students.</p>
                    <Button onClick={() => setShowCreateProgram(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Program
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Student Applications ({applications.length})</CardTitle>
              <CardDescription>Review and manage student applications</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search by student name, email, or roll number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Applications</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="shortlisted">Shortlisted</SelectItem>
                    <SelectItem value="selected">Selected</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {filteredApplications.length > 0 ? (
                  filteredApplications.map((application) => (
                    <div key={application.$id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">{application.student?.name || 'Unknown Student'}</h3>
                            <Badge className={getStatusColor(application.status)} >
                              {application.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                            <div>
                              <p className="text-xs text-muted-foreground">Program</p>
                              <p className="text-sm">{application.program?.title}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Email</p>
                              <p className="text-sm">{application.student?.email}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Roll Number</p>
                              <p className="text-sm">{application.student?.rollNumber}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Course</p>
                              <p className="text-sm">{application.student?.course} (Sem {application.student?.semester})</p>
                            </div>
                          </div>
                          
                          {application.student?.cgpa && (
                            <div className="mb-3">
                              <p className="text-xs text-muted-foreground mb-1">CGPA</p>
                              <p className="text-sm font-medium">{application.student.cgpa}/10.0</p>
                            </div>
                          )}
                          
                          {application.student?.skills && application.student.skills.length > 0 && (
                            <div className="mb-3">
                              <p className="text-xs text-muted-foreground mb-1">Skills</p>
                              <div className="flex gap-1">
                                {application.student.skills.slice(0, 5).map((skill, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                                {application.student.skills.length > 5 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{application.student.skills.length - 5} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {application.coverLetter && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Cover Letter</p>
                              <p className="text-sm text-gray-700 line-clamp-2">{application.coverLetter}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground mb-4">
                            Applied {new Date(application.applicationDate).toLocaleDateString()}
                          </p>
                          
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <Button variant="outline" >
                                <Eye className="h-3 w-3 mr-1" />
                                View Full
                              </Button>
                              <Button variant="outline" >
                                <Mail className="h-3 w-3 mr-1" />
                                Contact
                              </Button>
                            </div>
                            
                            {application.status === 'pending' && (
                              <div className="flex gap-2">
                                <Button 
                                   
                                  onClick={() => updateApplicationStatus(application.$id, 'shortlisted')}
                                >
                                  Shortlist
                                </Button>
                                <Button 
                                   
                                  onClick={() => updateApplicationStatus(application.$id, 'selected')}
                                >
                                  Select
                                </Button>
                                <Button 
                                   
                                  variant="destructive"
                                  onClick={() => updateApplicationStatus(application.$id, 'rejected')}
                                >
                                  Reject
                                </Button>
                              </div>
                            )}
                            
                            {application.status === 'shortlisted' && (
                              <div className="flex gap-2">
                                <Button 
                                   
                                  onClick={() => updateApplicationStatus(application.$id, 'selected')}
                                >
                                  Select
                                </Button>
                                <Button 
                                   
                                  variant="destructive"
                                  onClick={() => updateApplicationStatus(application.$id, 'rejected')}
                                >
                                  Reject
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16">
                    <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      {searchTerm || statusFilter !== 'all' ? 'No matching applications' : 'No applications yet'}
                    </h3>
                    <p className="text-muted-foreground">
                      {searchTerm || statusFilter !== 'all' 
                        ? 'Try adjusting your search or filters.' 
                        : 'Applications will appear here once students start applying to your programs.'
                      }
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interns">
          <Card>
            <CardHeader>
              <CardTitle>Active Interns</CardTitle>
              <CardDescription>Monitor and manage your current interns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16">
                <UserCheck className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Active Interns</h3>
                <p className="text-muted-foreground mb-6">
                  Once you select students and internships begin, they will appear here for monitoring and management.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button variant="outline">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Interviews
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Templates
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
