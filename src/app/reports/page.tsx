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
import { Calendar } from '@/components/ui/calendar';
import { 
  FileText, 
  Plus, 
  Download, 
  Edit, 
  Eye, 
  Calendar as CalendarIcon,
  Clock,
  CheckCircle,
  AlertCircle,
  Award,
  Zap,
  BookOpen,
  Target,
  PieChart,
  BarChart3,
  TrendingUp,
  Save,
  Send,
  FileDown,
  Printer,
  Share
} from 'lucide-react';
import { useApp } from '@/components/providers/app-provider';
import { ReportOperations } from '@/lib/database-operations';

interface LogbookEntry {
  $id: string;
  date: string;
  tasksCompleted: string[];
  learningsGained: string;
  challenges: string;
  hoursWorked: number;
  mentorFeedback?: string;
  attachments?: string[];
  createdAt: string;
}

interface Report {
  $id: string;
  type: 'weekly' | 'monthly' | 'final';
  title: string;
  period: {
    startDate: string;
    endDate: string;
  };
  content: {
    summary: string;
    achievements: string[];
    learnings: string[];
    challenges: string[];
    futureGoals: string[];
    skillsGained: string[];
    feedback: string;
  };
  status: 'draft' | 'submitted' | 'reviewed' | 'approved';
  submissionDate?: string;
  grade?: number;
  facultyFeedback?: string;
}

interface ReportTemplate {
  id: string;
  name: string;
  type: 'weekly' | 'monthly' | 'final';
  sections: {
    title: string;
    fields: {
      name: string;
      type: 'text' | 'textarea' | 'list' | 'number';
      required: boolean;
      placeholder?: string;
    }[];
  }[];
}

export default function ReportsAndLogbook() {
  const { user, userProfile } = useApp();
  const router = useRouter();
  
  const [logbookEntries, setLogbookEntries] = useState<LogbookEntry[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateEntry, setShowCreateEntry] = useState(false);
  const [showCreateReport, setShowCreateReport] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  
  // Form states
  const [entryForm, setEntryForm] = useState({
    date: new Date().toISOString().split('T')[0],
    tasksCompleted: [''],
    learningsGained: '',
    challenges: '',
    hoursWorked: 8,
    mentorFeedback: '',
  });
  
  const [reportForm, setReportForm] = useState({
    type: 'weekly' as 'weekly' | 'monthly' | 'final',
    title: '',
    summary: '',
    achievements: [''],
    learnings: [''],
    challenges: [''],
    futureGoals: [''],
    skillsGained: [''],
    feedback: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    if (user && userProfile) {
      loadReportData();
    }
  }, [user, userProfile]);

  const loadReportData = async () => {
    try {
      // Mock data for demonstration
      const mockLogbookEntries: LogbookEntry[] = [
        {
          $id: '1',
          date: '2024-07-22',
          tasksCompleted: ['Implemented user authentication', 'Fixed UI bugs', 'Code review'],
          learningsGained: 'Learned about JWT tokens and session management',
          challenges: 'Understanding complex authentication flows took time',
          hoursWorked: 8,
          mentorFeedback: 'Good progress on authentication implementation',
          createdAt: '2024-07-22T18:00:00Z'
        },
        {
          $id: '2',
          date: '2024-07-21',
          tasksCompleted: ['Database schema design', 'API endpoint creation'],
          learningsGained: 'Database optimization techniques',
          challenges: 'Complex query optimization',
          hoursWorked: 7,
          createdAt: '2024-07-21T17:30:00Z'
        }
      ];

      const mockReports: Report[] = [
        {
          $id: '1',
          type: 'weekly',
          title: 'Week 3 Progress Report',
          period: {
            startDate: '2024-07-15',
            endDate: '2024-07-21'
          },
          content: {
            summary: 'Focused on backend development and API implementation',
            achievements: ['Completed user authentication system', 'Implemented 5 API endpoints'],
            learnings: ['JWT authentication', 'Database optimization', 'RESTful API design'],
            challenges: ['Complex authentication flows', 'Database performance issues'],
            futureGoals: ['Frontend integration', 'Testing implementation'],
            skillsGained: ['Node.js', 'Express.js', 'MongoDB'],
            feedback: 'Productive week with significant backend progress'
          },
          status: 'submitted',
          submissionDate: '2024-07-21T23:59:00Z'
        },
        {
          $id: '2',
          type: 'monthly',
          title: 'July Monthly Report',
          period: {
            startDate: '2024-07-01',
            endDate: '2024-07-31'
          },
          content: {
            summary: 'First month of internship focused on learning and initial development',
            achievements: ['Set up development environment', 'Completed onboarding', 'Built authentication system'],
            learnings: ['Company workflow', 'Tech stack mastery', 'Agile methodology'],
            challenges: ['Steep learning curve', 'Adapting to team practices'],
            futureGoals: ['Complete MVP', 'Improve testing coverage'],
            skillsGained: ['React', 'Node.js', 'Git workflow'],
            feedback: 'Great start to the internship with solid foundation building'
          },
          status: 'draft'
        }
      ];

      const mockTemplates: ReportTemplate[] = [
        {
          id: 'weekly-standard',
          name: 'Standard Weekly Report',
          type: 'weekly',
          sections: [
            {
              title: 'Overview',
              fields: [
                { name: 'summary', type: 'textarea', required: true, placeholder: 'Summarize your week...' },
                { name: 'hoursWorked', type: 'number', required: true, placeholder: 'Total hours worked' }
              ]
            },
            {
              title: 'Achievements & Progress',
              fields: [
                { name: 'achievements', type: 'list', required: true, placeholder: 'List your key achievements...' },
                { name: 'tasksCompleted', type: 'list', required: true, placeholder: 'Tasks completed this week...' }
              ]
            },
            {
              title: 'Learning & Development',
              fields: [
                { name: 'learnings', type: 'list', required: true, placeholder: 'What did you learn?' },
                { name: 'skillsGained', type: 'list', required: false, placeholder: 'New skills acquired...' }
              ]
            },
            {
              title: 'Challenges & Solutions',
              fields: [
                { name: 'challenges', type: 'list', required: true, placeholder: 'Challenges faced...' },
                { name: 'solutions', type: 'textarea', required: false, placeholder: 'How did you solve them?' }
              ]
            },
            {
              title: 'Future Plans',
              fields: [
                { name: 'futureGoals', type: 'list', required: true, placeholder: 'Goals for next week...' }
              ]
            }
          ]
        }
      ];

      setLogbookEntries(mockLogbookEntries);
      setReports(mockReports);
      setTemplates(mockTemplates);
      
    } catch (error) {
      console.error('Error loading report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createLogbookEntry = async () => {
    try {
      const newEntry: LogbookEntry = {
        $id: Date.now().toString(),
        date: entryForm.date,
        tasksCompleted: entryForm.tasksCompleted.filter(task => task.trim() !== ''),
        learningsGained: entryForm.learningsGained,
        challenges: entryForm.challenges,
        hoursWorked: entryForm.hoursWorked,
        mentorFeedback: entryForm.mentorFeedback,
        createdAt: new Date().toISOString()
      };

      setLogbookEntries(prev => [newEntry, ...prev]);
      
      // Reset form
      setEntryForm({
        date: new Date().toISOString().split('T')[0],
        tasksCompleted: [''],
        learningsGained: '',
        challenges: '',
        hoursWorked: 8,
        mentorFeedback: '',
      });
      
      setShowCreateEntry(false);
      alert('Logbook entry created successfully!');
      
    } catch (error) {
      console.error('Error creating logbook entry:', error);
      alert('Failed to create logbook entry');
    }
  };

  const generateReport = async (type: 'weekly' | 'monthly' | 'final') => {
    try {
      // Auto-generate report based on logbook entries
      const relevantEntries = logbookEntries.filter(entry => {
        const entryDate = new Date(entry.date);
        const now = new Date();
        
        switch (type) {
          case 'weekly':
            return (now.getTime() - entryDate.getTime()) <= 7 * 24 * 60 * 60 * 1000;
          case 'monthly':
            return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });

      const autoReport: Report = {
        $id: Date.now().toString(),
        type,
        title: `Auto-generated ${type} report - ${new Date().toLocaleDateString()}`,
        period: {
          startDate: type === 'weekly' 
            ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            : new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0]
        },
        content: {
          summary: `Summary of ${type} activities and progress`,
          achievements: relevantEntries.flatMap(entry => entry.tasksCompleted).slice(0, 5),
          learnings: relevantEntries.map(entry => entry.learningsGained).filter(Boolean).slice(0, 3),
          challenges: relevantEntries.map(entry => entry.challenges).filter(Boolean).slice(0, 3),
          futureGoals: ['Continue current projects', 'Improve efficiency', 'Learn new technologies'],
          skillsGained: ['Technical skills', 'Problem solving', 'Communication'],
          feedback: `Total hours worked: ${relevantEntries.reduce((sum, entry) => sum + entry.hoursWorked, 0)}`
        },
        status: 'draft'
      };

      setReports(prev => [autoReport, ...prev]);
      alert('Report generated successfully!');
      
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report');
    }
  };

  const submitReport = async (reportId: string) => {
    try {
      setReports(prev => prev.map(report => 
        report.$id === reportId 
          ? { ...report, status: 'submitted', submissionDate: new Date().toISOString() }
          : report
      ));
      
      alert('Report submitted successfully!');
      
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report');
    }
  };

  const exportReport = async (report: Report, format: 'pdf' | 'docx' = 'pdf') => {
    try {
      // In a real implementation, this would generate and download the report
      const reportContent = `
        ${report.title}
        
        Period: ${report.period.startDate} to ${report.period.endDate}
        
        Summary:
        ${report.content.summary}
        
        Achievements:
        ${report.content.achievements.map(a => `• ${a}`).join('\n')}
        
        Learnings:
        ${report.content.learnings.map(l => `• ${l}`).join('\n')}
        
        Challenges:
        ${report.content.challenges.map(c => `• ${c}`).join('\n')}
        
        Future Goals:
        ${report.content.futureGoals.map(g => `• ${g}`).join('\n')}
      `;
      
      // Create a downloadable text file for demo
      const element = document.createElement('a');
      const file = new Blob([reportContent], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${report.title.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      alert(`Report exported as ${format.toUpperCase()}`);
      
    } catch (error) {
      console.error('Error exporting report:', error);
      alert('Failed to export report');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'reviewed': return 'bg-purple-100 text-purple-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading reports and logbook...</p>
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
            Please log in to access reports and logbook.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Reports & Digital Logbook</h1>
        <p className="text-muted-foreground">Track your daily progress and generate comprehensive reports</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Logbook Entries</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{logbookEntries.length}</div>
            <p className="text-xs text-muted-foreground">Total entries</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports Generated</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
            <p className="text-xs text-muted-foreground">All time reports</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours Logged</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {logbookEntries.reduce((sum, entry) => sum + entry.hoursWorked, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total hours</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((reports.filter(r => r.status !== 'draft').length / Math.max(reports.length, 1)) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">Reports submitted</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="logbook" className="space-y-6">
        <TabsList>
          <TabsTrigger value="logbook">Daily Logbook</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="logbook">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Daily Logbook ({logbookEntries.length})</CardTitle>
                <CardDescription>Record your daily activities, learnings, and progress</CardDescription>
              </div>
              <Button onClick={() => setShowCreateEntry(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Entry
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {logbookEntries.length > 0 ? (
                  logbookEntries.map((entry) => (
                    <div key={entry.$id} className="p-6 border rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{new Date(entry.date).toLocaleDateString()}</h3>
                            <Badge variant="outline">{entry.hoursWorked}h worked</Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="font-medium text-sm mb-2">Tasks Completed</h4>
                              <ul className="text-sm space-y-1">
                                {entry.tasksCompleted.map((task, idx) => (
                                  <li key={idx} className="flex items-center gap-2">
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                    {task}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-sm mb-2">Key Learnings</h4>
                              <p className="text-sm text-muted-foreground">{entry.learningsGained}</p>
                            </div>
                          </div>
                          
                          {entry.challenges && (
                            <div className="mb-4">
                              <h4 className="font-medium text-sm mb-2">Challenges Faced</h4>
                              <p className="text-sm text-muted-foreground">{entry.challenges}</p>
                            </div>
                          )}
                          
                          {entry.mentorFeedback && (
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <h4 className="font-medium text-sm mb-1">Mentor Feedback</h4>
                              <p className="text-sm text-blue-700">{entry.mentorFeedback}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" >
                            <Download className="h-3 w-3 mr-1" />
                            Export
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16">
                    <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No logbook entries yet</h3>
                    <p className="text-muted-foreground mb-6">Start recording your daily progress and activities.</p>
                    <Button onClick={() => setShowCreateEntry(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Entry
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Create Entry Dialog */}
          <Dialog open={showCreateEntry} onOpenChange={setShowCreateEntry}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Logbook Entry</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={entryForm.date}
                      onChange={(e) => setEntryForm({...entryForm, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hours">Hours Worked</Label>
                    <Input
                      id="hours"
                      type="number"
                      min="1"
                      max="24"
                      value={entryForm.hoursWorked}
                      onChange={(e) => setEntryForm({...entryForm, hoursWorked: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Tasks Completed</Label>
                  {entryForm.tasksCompleted.map((task, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <Input
                        placeholder="Enter task completed..."
                        value={task}
                        onChange={(e) => {
                          const newTasks = [...entryForm.tasksCompleted];
                          newTasks[idx] = e.target.value;
                          setEntryForm({...entryForm, tasksCompleted: newTasks});
                        }}
                      />
                      {idx === entryForm.tasksCompleted.length - 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          
                          onClick={() => setEntryForm({...entryForm, tasksCompleted: [...entryForm.tasksCompleted, '']})}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                
                <div>
                  <Label htmlFor="learnings">Key Learnings</Label>
                  <Textarea
                    id="learnings"
                    placeholder="What did you learn today?"
                    value={entryForm.learningsGained}
                    onChange={(e) => setEntryForm({...entryForm, learningsGained: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="challenges">Challenges Faced</Label>
                  <Textarea
                    id="challenges"
                    placeholder="Any challenges or difficulties encountered?"
                    value={entryForm.challenges}
                    onChange={(e) => setEntryForm({...entryForm, challenges: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="feedback">Mentor Feedback (Optional)</Label>
                  <Textarea
                    id="feedback"
                    placeholder="Any feedback from your mentor?"
                    value={entryForm.mentorFeedback}
                    onChange={(e) => setEntryForm({...entryForm, mentorFeedback: e.target.value})}
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button onClick={createLogbookEntry}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Entry
                  </Button>
                  <Button variant="outline" onClick={() => setShowCreateEntry(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Generated Reports ({reports.length})</CardTitle>
                <CardDescription>View and manage your internship reports</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => generateReport('weekly')}>
                  <Zap className="h-4 w-4 mr-2" />
                  Generate Weekly
                </Button>
                <Button variant="outline" onClick={() => generateReport('monthly')}>
                  <Zap className="h-4 w-4 mr-2" />
                  Generate Monthly
                </Button>
                <Button onClick={() => setShowCreateReport(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Custom
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.length > 0 ? (
                  reports.map((report) => (
                    <div key={report.$id} className="p-6 border rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{report.title}</h3>
                            <Badge className={getStatusColor(report.status)}>
                              {report.status}
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {report.type}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3">
                            Period: {new Date(report.period.startDate).toLocaleDateString()} - 
                            {new Date(report.period.endDate).toLocaleDateString()}
                          </p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="font-medium text-sm mb-2">Summary</h4>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {report.content.summary}
                              </p>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm mb-2">Key Achievements</h4>
                              <ul className="text-sm space-y-1">
                                {report.content.achievements.slice(0, 3).map((achievement, idx) => (
                                  <li key={idx} className="flex items-center gap-2">
                                    <Award className="h-3 w-3 text-gold-500" />
                                    {achievement}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          
                          {report.facultyFeedback && (
                            <div className="bg-green-50 p-3 rounded-lg mb-4">
                              <h4 className="font-medium text-sm mb-1">Faculty Feedback</h4>
                              <p className="text-sm text-green-700">{report.facultyFeedback}</p>
                              {report.grade && (
                                <p className="text-sm font-medium text-green-800 mt-1">
                                  Grade: {report.grade}/100
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <Button variant="outline" >
                            <Eye className="h-3 w-3 mr-1" />
                            View Full
                          </Button>
                          <Button variant="outline"  onClick={() => exportReport(report)}>
                            <Download className="h-3 w-3 mr-1" />
                            Export PDF
                          </Button>
                          {report.status === 'draft' && (
                            <Button  onClick={() => submitReport(report.$id)}>
                              <Send className="h-3 w-3 mr-1" />
                              Submit
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16">
                    <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No reports generated yet</h3>
                    <p className="text-muted-foreground mb-6">Generate your first report from logbook entries.</p>
                    <div className="flex gap-4 justify-center">
                      <Button onClick={() => generateReport('weekly')}>
                        <Zap className="h-4 w-4 mr-2" />
                        Generate Weekly Report
                      </Button>
                      <Button variant="outline" onClick={() => generateReport('monthly')}>
                        <Zap className="h-4 w-4 mr-2" />
                        Generate Monthly Report
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Report Templates</CardTitle>
              <CardDescription>Pre-defined templates for different types of reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <div key={template.id} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">{template.name}</h3>
                      <Badge variant="outline" className="capitalize">
                        {template.type}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-muted-foreground">Sections included:</p>
                      <ul className="text-sm space-y-1">
                        {template.sections.map((section, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {section.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline"  className="flex-1">
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </Button>
                      <Button  className="flex-1">
                        Use Template
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Progress Analytics</CardTitle>
              <CardDescription>Visualize your internship progress and productivity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16">
                <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
                <p className="text-muted-foreground mb-6">
                  Detailed analytics and charts showing your progress over time will be displayed here.
                </p>
                <Button variant="outline">
                  <PieChart className="h-4 w-4 mr-2" />
                  Generate Analytics Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}