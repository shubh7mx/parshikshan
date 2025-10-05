'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  BookOpen, 
  Calendar, 
  FileText, 
  GraduationCap, 
  MapPin, 
  Clock,
  Users,
  TrendingUp,
  AlertCircle,
  Search,
  Plus,
  Download,
  Upload,
  Edit,
  Eye,
  Star,
  Building,
  Send
} from 'lucide-react';
import { useApp } from '@/components/providers/app-provider';
import { databases, storage, ID, Query } from '@/lib/appwrite';
import { dbOperations } from '@/lib/database';

interface DashboardStats {
  totalInternships: number;
  activeApplications: number;
  completedInternships: number;
  totalHours: number;
}

interface InternshipProgram {
  $id: string;
  title: string;
  companyName: string;
  location: string;
  mode: 'onsite' | 'remote' | 'hybrid';
  duration: number;
  stipend?: number;
  requiredSkills: string[];
  applicationDeadline: string;
  description: string;
  status: string;
}

interface StudentProfile {
  rollNumber: string;
  semester: number;
  course: string;
  cgpa?: number;
  skills: string[];
  resume?: string;
  bio?: string;
}

export default function StudentDashboard() {
  const { user, userProfile, refreshUser } = useApp();
  const router = useRouter();
  
  const [stats, setStats] = useState<DashboardStats>({
    totalInternships: 0,
    activeApplications: 0,
    completedInternships: 0,
    totalHours: 0
  });
  
  const [applications, setApplications] = useState<any[]>([]);
  const [availableInternships, setAvailableInternships] = useState<InternshipProgram[]>([]);
  const [activeInternship, setActiveInternship] = useState<any | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [profileEditing, setProfileEditing] = useState(false);
  const [profileForm, setProfileForm] = useState<Partial<StudentProfile>>({});

  // Load real data from database
  useEffect(() => {
    if (user) {
      loadDashboardData();
    } else {
      // Create demo data for testing if no user
      createDemoData();
    }
  }, [user]);

  const createDemoData = async () => {
    try {
      const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID!;
      
      // Check if demo data already exists
      const existingPrograms = await databases.listDocuments(
        DATABASE_ID,
        'internship_programs',
        [Query.equal('status', 'published')]
      );
      
      // If demo data exists, just load it
      if (existingPrograms.documents.length > 0) {
        console.log('Demo data already exists, loading existing programs...');
        loadDashboardData();
        return;
      }
      
      console.log('Creating demo internship programs...');
      
      // Create demo internship programs only if none exist
      const demoPrograms = [
        {
          title: 'Frontend Developer Intern',
          companyId: 'demo-company-1',
          companyName: 'TechCorp Solutions',
          duration: 6,
          stipend: 25000,
          location: 'Bangalore',
          mode: 'hybrid',
          requiredSkills: ['React', 'JavaScript', 'CSS'],
          eligibleCourses: ['computer_science', 'information_technology'],
          minimumCGPA: 7.0,
          maxPositions: 5,
          applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          startDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 240 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'published',
          description: 'Join our dynamic team as a Frontend Developer Intern and work on cutting-edge web applications using React and modern JavaScript frameworks.'
        },
        {
          title: 'Data Science Intern',
          companyId: 'demo-company-2',
          companyName: 'Analytics Pro',
          duration: 4,
          stipend: 30000,
          location: 'Mumbai',
          mode: 'onsite',
          requiredSkills: ['Python', 'Machine Learning', 'SQL'],
          eligibleCourses: ['computer_science', 'data_science'],
          minimumCGPA: 7.5,
          maxPositions: 3,
          applicationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
          startDate: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 195 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'published',
          description: 'Work with real-world data and build machine learning models to solve business problems in our data science team.'
        },
        {
          title: 'Full Stack Developer Intern',
          companyId: 'demo-company-3',
          companyName: 'StartupHub',
          duration: 8,
          stipend: 35000,
          location: 'Remote',
          mode: 'remote',
          requiredSkills: ['Node.js', 'React', 'MongoDB'],
          eligibleCourses: ['computer_science', 'information_technology'],
          minimumCGPA: 6.5,
          maxPositions: 2,
          applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
          startDate: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() + 290 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'published',
          description: 'Build end-to-end web applications in a fast-paced startup environment and gain experience with the full development lifecycle.'
        }
      ];

      // Create demo programs in database
      let createdCount = 0;
      for (const program of demoPrograms) {
        try {
          await databases.createDocument(
            DATABASE_ID,
            'internship_programs',
            ID.unique(),
            program
          );
          createdCount++;
          console.log(`Created demo program: ${program.title}`);
        } catch (error: any) {
          console.log(`Demo program '${program.title}' may already exist or error occurred:`, error.message);
        }
      }
      
      console.log(`Created ${createdCount} demo programs`);
      
      // Load the data (whether newly created or existing)
      loadDashboardData();
      
    } catch (error) {
      console.error('Error in createDemoData:', error);
      // Even if demo data creation fails, try to load existing data
      loadDashboardData();
    }
  };

  const loadDashboardData = async () => {
    try {
      const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID!;
      
      // Load student profile
      if (userProfile) {
        setProfile({
          rollNumber: userProfile.rollNumber,
          semester: userProfile.semester,
          course: userProfile.course,
          cgpa: userProfile.cgpa,
          skills: userProfile.skills || [],
          resume: userProfile.resume,
          bio: userProfile.bio
        });
        setProfileForm({
          rollNumber: userProfile.rollNumber,
          semester: userProfile.semester,
          course: userProfile.course,
          cgpa: userProfile.cgpa,
          skills: userProfile.skills || [],
          bio: userProfile.bio
        });
      }
      
      // Load applications
      if (user) {
        try {
          const applicationsResult = await databases.listDocuments(
            DATABASE_ID,
            'internship_applications',
            [Query.equal('studentId', user.$id)]
          );
          setApplications(applicationsResult.documents || []);
        } catch (error) {
          console.error('Error loading applications:', error);
        }
      }
      
      // Load available internship programs
      const programsResult = await databases.listDocuments(
        DATABASE_ID,
        'internship_programs',
        [Query.equal('status', 'published')]
      );
      
      if (programsResult.documents.length > 0) {
        const programs = programsResult.documents.map(doc => ({
          $id: doc.$id,
          title: doc.title,
          companyName: doc.companyName || 'Company Name',
          location: doc.location,
          mode: doc.mode,
          duration: doc.duration,
          stipend: doc.stipend,
          requiredSkills: doc.requiredSkills || [],
          applicationDeadline: doc.applicationDeadline,
          description: doc.description,
          status: doc.status
        }));
        setAvailableInternships(programs);
      }
      
      // Load active internship (if any)
      if (user) {
        try {
          const internshipsResult = await databases.listDocuments(
            DATABASE_ID,
            'internships',
            [
              Query.equal('studentId', user.$id),
              Query.equal('status', 'ongoing')
            ]
          );
          if (internshipsResult.documents.length > 0) {
            setActiveInternship(internshipsResult.documents[0]);
          }
        } catch (error) {
          console.error('Error loading internships:', error);
        }
      }
      
      // Calculate stats
      setStats({
        totalInternships: applications.length,
        activeApplications: applications.filter(app => app.status === 'pending').length,
        completedInternships: applications.filter(app => app.status === 'selected').length,
        totalHours: activeInternship?.hoursCompleted || 0
      });
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyToInternship = async (programId: string) => {
    if (!user) {
      alert('Please log in to apply for internships!');
      return;
    }
    
    try {
      const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID!;
      
      // Check if already applied
      const existingApplication = applications.find(app => app.programId === programId);
      if (existingApplication) {
        alert('You have already applied to this internship!');
        return;
      }
      
      // Create application
      await databases.createDocument(
        DATABASE_ID,
        'internship_applications',
        ID.unique(),
        {
          studentId: user.$id,
          programId: programId,
          applicationDate: new Date().toISOString(),
          status: 'pending',
          coverLetter: `Application from ${user.name} for this internship position.`,
          additionalDocuments: []
        }
      );
      
      alert('Application submitted successfully!');
      
      // Refresh applications
      loadDashboardData();
      
    } catch (error) {
      console.error('Error applying to internship:', error);
      alert('Failed to submit application. Please try again.');
    }
  };

  const updateProfile = async () => {
    if (!user) return;
    
    try {
      const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID!;
      
      // For demo purposes, just update local state
      // In a real app, you'd update the user's student record
      console.log('Profile update for user:', user.$id, profileForm);
      
      setProfile(prev => prev ? ({ ...prev, ...profileForm }) : null);
      setProfileEditing(false);
      alert('Profile updated successfully!');
      
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'shortlisted': return 'bg-blue-100 text-blue-800';
      case 'selected': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredInternships = availableInternships.filter(internship =>
    searchTerm === '' || 
    internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    internship.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    internship.requiredSkills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
        <p className="text-muted-foreground">Here's your internship overview and opportunities.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInternships}</div>
            <p className="text-xs text-muted-foreground">All time applications</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeApplications}</div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accepted</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedInternships}</div>
            <p className="text-xs text-muted-foreground">Internships secured</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Programs</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableInternships.length}</div>
            <p className="text-xs text-muted-foreground">Ready to apply</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="opportunities" className="space-y-6">
        <TabsList>
          <TabsTrigger value="opportunities">Find Internships</TabsTrigger>
          <TabsTrigger value="applications">My Applications ({applications.length})</TabsTrigger>
          <TabsTrigger value="internship">Current Internship</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="logbook">Logbook</TabsTrigger>
        </TabsList>

        <TabsContent value="opportunities">
          <div className="space-y-6">
            {/* Search Bar */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="Search internships by title, company, or skills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Available Internships */}
            <Card>
              <CardHeader>
                <CardTitle>Available Internships ({filteredInternships.length})</CardTitle>
                <CardDescription>Latest opportunities matching your profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredInternships.length > 0 ? (
                    filteredInternships.map((internship) => (
                      <div key={internship.$id} className="p-6 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-lg mb-1">{internship.title}</h3>
                            <div className="flex items-center gap-2 mb-2">
                              <Building className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">{internship.companyName}</span>
                            </div>
                          </div>
                          <Badge variant="outline" className="capitalize">{internship.mode}</Badge>
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {internship.location}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {internship.duration} months
                          </div>
                          {internship.stipend && (
                            <div className="flex items-center">
                              <Star className="h-4 w-4 mr-1" />
                              ₹{internship.stipend.toLocaleString()}/month
                            </div>
                          )}
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            Apply by {new Date(internship.applicationDeadline).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <p className="text-sm mb-4 text-gray-700 line-clamp-2">{internship.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <span className="text-sm font-medium text-gray-600">Skills:</span>
                            <div className="flex gap-2">
                              {internship.requiredSkills?.slice(0, 4).map((skill, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {internship.requiredSkills?.length > 4 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{internship.requiredSkills.length - 4} more
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              
                              onClick={() => {
                                // Show full details modal
                                alert(`Full details for: ${internship.title}\n\n${internship.description}\n\nRequired Skills: ${internship.requiredSkills.join(', ')}`);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                            <Button
                              
                              onClick={() => applyToInternship(internship.$id)}
                              disabled={applications.some(app => app.programId === internship.$id)}
                            >
                              {applications.some(app => app.programId === internship.$id) ? (
                                <>Already Applied</>
                              ) : (
                                <>
                                  <Send className="h-4 w-4 mr-1" />
                                  Apply Now
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        {searchTerm ? 'No matching internships found' : 'No internships available'}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {searchTerm 
                          ? 'Try adjusting your search terms or check back later for new opportunities.' 
                          : 'Check back later for new opportunities or contact your coordinator.'
                        }
                      </p>
                      {searchTerm && (
                        <Button onClick={() => setSearchTerm('')}>
                          Clear Search
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>My Applications ({applications.length})</CardTitle>
              <CardDescription>Track your internship applications and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applications.length > 0 ? (
                  applications.map((application) => (
                    <div key={application.$id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">Application #{application.$id.slice(-8)}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          Applied on {new Date(application.applicationDate).toLocaleDateString()}
                        </p>
                        {application.coverLetter && (
                          <p className="text-sm line-clamp-2 text-gray-600">{application.coverLetter}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(application.status)}>
                          {application.status}
                        </Badge>
                        <div className="mt-2 flex gap-2">
                          <Button variant="outline" >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          {application.status === 'pending' && (
                            <Button variant="outline" >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
                    <p className="text-muted-foreground mb-6">Start applying to internships to track your progress here.</p>
                    <Button onClick={() => router.push('#opportunities')}>
                      <Search className="h-4 w-4 mr-2" />
                      Browse Internships
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="internship">
          {activeInternship ? (
            <Card>
              <CardHeader>
                <CardTitle>Current Internship</CardTitle>
                <CardDescription>Track your active internship progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Progress</h3>
                    <Progress value={65} className="mb-2" />
                    <p className="text-sm text-muted-foreground">65% Complete</p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Hours Logged</h3>
                    <p className="text-2xl font-bold">208/320</p>
                    <p className="text-sm text-muted-foreground">hours completed</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button onClick={() => router.push('/student/logbook')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Logbook Entry
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                  <Button variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Contact Mentor
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Active Internship</h3>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  You don't have an active internship right now. Browse available opportunities and apply to get started on your career journey!
                </p>
                <Button size="lg">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Browse Internships
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Manage your academic and personal details</CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={() => setProfileEditing(!profileEditing)}
              >
                <Edit className="h-4 w-4 mr-2" />
                {profileEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </CardHeader>
            <CardContent>
              {profileEditing ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="rollNumber">Roll Number</Label>
                      <Input
                        id="rollNumber"
                        value={profileForm.rollNumber || ''}
                        onChange={(e) => setProfileForm({...profileForm, rollNumber: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="semester">Semester</Label>
                      <Input
                        id="semester"
                        type="number"
                        value={profileForm.semester || ''}
                        onChange={(e) => setProfileForm({...profileForm, semester: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="course">Course</Label>
                      <Input
                        id="course"
                        value={profileForm.course || ''}
                        onChange={(e) => setProfileForm({...profileForm, course: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cgpa">CGPA</Label>
                      <Input
                        id="cgpa"
                        type="number"
                        step="0.01"
                        value={profileForm.cgpa || ''}
                        onChange={(e) => setProfileForm({...profileForm, cgpa: parseFloat(e.target.value)})}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself, your interests, and career goals..."
                      value={profileForm.bio || ''}
                      onChange={(e) => setProfileForm({...profileForm, bio: e.target.value})}
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={updateProfile}>
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setProfileEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {profile ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div>
                        <h3 className="font-semibold mb-4 text-lg">Academic Information</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Roll Number:</span>
                            <span>{profile.rollNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Course:</span>
                            <span>{profile.course}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium text-gray-600">Semester:</span>
                            <span>{profile.semester}</span>
                          </div>
                          {profile.cgpa && (
                            <div className="flex justify-between">
                              <span className="font-medium text-gray-600">CGPA:</span>
                              <span>{profile.cgpa}/10.0</span>
                            </div>
                          )}
                        </div>
                        
                        {profile.bio && (
                          <div className="mt-6">
                            <h4 className="font-medium text-gray-600 mb-2">About Me</h4>
                            <p className="text-gray-700">{profile.bio}</p>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-4 text-lg">Skills & Expertise</h3>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {profile.skills?.length > 0 ? (
                            profile.skills.map((skill, idx) => (
                              <Badge key={idx} variant="secondary" className="px-3 py-1">
                                {skill}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-muted-foreground">No skills added yet</p>
                          )}
                        </div>

                        <h4 className="font-semibold mb-4">Documents</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-gray-500" />
                              <span className="text-sm">Resume</span>
                            </div>
                            {profile.resume ? (
                              <div className="flex gap-2">
                                <Button variant="outline" >
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                                <Button variant="outline" >
                                  <Upload className="h-3 w-3 mr-1" />
                                  Update
                                </Button>
                              </div>
                            ) : (
                              <Button variant="outline" >
                                <Upload className="h-3 w-3 mr-1" />
                                Upload
                              </Button>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center">
                              <GraduationCap className="h-4 w-4 mr-2 text-gray-500" />
                              <span className="text-sm">Certificates</span>
                            </div>
                            <Button variant="outline" >
                              <Upload className="h-3 w-3 mr-1" />
                              Upload
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <AlertCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Profile Not Complete</h3>
                      <p className="text-muted-foreground mb-6">Please complete your profile to get better internship matches and increase your chances of selection.</p>
                      <Button onClick={() => setProfileEditing(true)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Complete Profile
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logbook">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Internship Logbook</CardTitle>
                <CardDescription>Track your daily internship activities and learning progress</CardDescription>
              </div>
              <Button onClick={() => router.push('/student/logbook')}>
                <Plus className="h-4 w-4 mr-2" />
                Add Entry
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No logbook entries yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Start logging your daily internship activities to track your progress and create comprehensive reports.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => router.push('/student/logbook')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Entry
                  </Button>
                  <Button variant="outline">
                    <BookOpen className="h-4 w-4 mr-2" />
                    View Sample
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