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
  Play,
  Pause,
  Book,
  Code,
  Lightbulb,
  Trophy,
  Zap,
  Brain,
  Search,
  Filter,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useApp } from '@/components/providers/app-provider';
import { databases, ID } from '@/lib/appwrite';

interface SkillAssessment {
  $id: string;
  skill: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  score: number;
  lastAssessed: string;
  certificate?: string;
}

interface LearningResource {
  $id: string;
  title: string;
  description: string;
  type: 'video' | 'article' | 'course' | 'tutorial' | 'book' | 'project';
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration?: number;
  rating: number;
  provider: string;
  url: string;
  skills: string[];
  price?: number;
  isFree: boolean;
  thumbnail?: string;
}

interface SkillGap {
  skill: string;
  currentLevel: string;
  requiredLevel: string;
  gap: number;
  recommendations: LearningResource[];
}

export default function SkillsAndLearning() {
  const { user, userProfile } = useApp();
  const router = useRouter();
  
  const [assessments, setAssessments] = useState<SkillAssessment[]>([]);
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showAssessmentDialog, setShowAssessmentDialog] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [assessmentQuestions, setAssessmentQuestions] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [assessmentAnswers, setAssessmentAnswers] = useState<any[]>([]);

  useEffect(() => {
    if (user && userProfile) {
      loadSkillsData();
    }
  }, [user, userProfile]);

  const loadSkillsData = async () => {
    try {
      // Mock skill assessments data
      const mockAssessments: SkillAssessment[] = [
        {
          $id: '1',
          skill: 'JavaScript',
          level: 'intermediate',
          score: 75,
          lastAssessed: '2024-06-15',
          certificate: 'js-cert-2024'
        },
        {
          $id: '2',
          skill: 'React',
          level: 'intermediate',
          score: 68,
          lastAssessed: '2024-06-10'
        },
        {
          $id: '3',
          skill: 'Python',
          level: 'beginner',
          score: 45,
          lastAssessed: '2024-06-05'
        },
        {
          $id: '4',
          skill: 'Data Structures',
          level: 'intermediate',
          score: 72,
          lastAssessed: '2024-06-12'
        },
        {
          $id: '5',
          skill: 'Machine Learning',
          level: 'beginner',
          score: 35,
          lastAssessed: '2024-06-08'
        }
      ];

      // Mock learning resources data
      const mockResources: LearningResource[] = [
        {
          $id: '1',
          title: 'Complete JavaScript Fundamentals',
          description: 'Master JavaScript from basics to advanced concepts including ES6+, async programming, and modern frameworks.',
          type: 'course',
          category: 'Programming',
          difficulty: 'beginner',
          duration: 1200, // 20 hours
          rating: 4.8,
          provider: 'TechLearn',
          url: 'https://example.com/js-course',
          skills: ['JavaScript', 'ES6', 'DOM', 'Async Programming'],
          price: 99,
          isFree: false,
          thumbnail: '/images/js-course.jpg'
        },
        {
          $id: '2',
          title: 'React Development Bootcamp',
          description: 'Build modern web applications with React, including hooks, context, and state management.',
          type: 'course',
          category: 'Web Development',
          difficulty: 'intermediate',
          duration: 1800, // 30 hours
          rating: 4.9,
          provider: 'CodeAcademy',
          url: 'https://example.com/react-bootcamp',
          skills: ['React', 'JavaScript', 'JSX', 'State Management'],
          price: 149,
          isFree: false
        },
        {
          $id: '3',
          title: 'Python for Beginners',
          description: 'Learn Python programming from scratch with hands-on projects and real-world applications.',
          type: 'course',
          category: 'Programming',
          difficulty: 'beginner',
          duration: 900, // 15 hours
          rating: 4.7,
          provider: 'PyLearn',
          url: 'https://example.com/python-basics',
          skills: ['Python', 'Programming Basics', 'Data Types'],
          price: 0,
          isFree: true
        },
        {
          $id: '4',
          title: 'Advanced Data Structures and Algorithms',
          description: 'Master complex data structures and algorithmic thinking for technical interviews.',
          type: 'course',
          category: 'Computer Science',
          difficulty: 'advanced',
          duration: 2400, // 40 hours
          rating: 4.6,
          provider: 'AlgoMaster',
          url: 'https://example.com/advanced-dsa',
          skills: ['Data Structures', 'Algorithms', 'Problem Solving'],
          price: 199,
          isFree: false
        },
        {
          $id: '5',
          title: 'Introduction to Machine Learning',
          description: 'Learn the fundamentals of ML with practical examples using Python and popular libraries.',
          type: 'course',
          category: 'Data Science',
          difficulty: 'intermediate',
          duration: 1500, // 25 hours
          rating: 4.5,
          provider: 'DataSci Institute',
          url: 'https://example.com/ml-intro',
          skills: ['Machine Learning', 'Python', 'NumPy', 'Pandas'],
          price: 129,
          isFree: false
        },
        {
          $id: '6',
          title: 'Building REST APIs with Node.js',
          description: 'Create robust backend applications and RESTful APIs using Node.js and Express.',
          type: 'tutorial',
          category: 'Backend Development',
          difficulty: 'intermediate',
          duration: 480, // 8 hours
          rating: 4.4,
          provider: 'BackendPro',
          url: 'https://example.com/nodejs-api',
          skills: ['Node.js', 'Express', 'REST API', 'JavaScript'],
          price: 0,
          isFree: true
        },
        {
          $id: '7',
          title: 'System Design Interview Prep',
          description: 'Prepare for system design interviews with real-world examples and best practices.',
          type: 'book',
          category: 'Interview Prep',
          difficulty: 'advanced',
          rating: 4.7,
          provider: 'TechBooks',
          url: 'https://example.com/system-design-book',
          skills: ['System Design', 'Architecture', 'Scalability'],
          price: 45,
          isFree: false
        }
      ];

      // Calculate skill gaps based on mock job requirements
      const mockSkillGaps: SkillGap[] = [
        {
          skill: 'Python',
          currentLevel: 'beginner',
          requiredLevel: 'intermediate',
          gap: 30,
          recommendations: mockResources.filter(r => r.skills.includes('Python'))
        },
        {
          skill: 'Machine Learning',
          currentLevel: 'beginner',
          requiredLevel: 'intermediate',
          gap: 40,
          recommendations: mockResources.filter(r => r.skills.includes('Machine Learning'))
        },
        {
          skill: 'System Design',
          currentLevel: 'none',
          requiredLevel: 'intermediate',
          gap: 70,
          recommendations: mockResources.filter(r => r.skills.includes('System Design'))
        }
      ];

      setAssessments(mockAssessments);
      setResources(mockResources);
      setSkillGaps(mockSkillGaps);
      
    } catch (error) {
      console.error('Error loading skills data:', error);
    } finally {
      setLoading(false);
    }
  };

  const startSkillAssessment = (skill: string) => {
    setSelectedSkill(skill);
    
    // Mock assessment questions
    const mockQuestions = [
      {
        question: `What is your experience level with ${skill}?`,
        type: 'multiple_choice',
        options: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
        correct: 1
      },
      {
        question: `How many projects have you completed using ${skill}?`,
        type: 'multiple_choice',
        options: ['0-1', '2-5', '6-10', '10+'],
        correct: 2
      },
      {
        question: `Rate your confidence in ${skill} (1-10)`,
        type: 'range',
        min: 1,
        max: 10,
        correct: 7
      }
    ];
    
    setAssessmentQuestions(mockQuestions);
    setCurrentQuestionIndex(0);
    setAssessmentAnswers([]);
    setShowAssessmentDialog(true);
  };

  const submitAssessment = () => {
    // Calculate score based on answers
    let score = 0;
    assessmentAnswers.forEach((answer, index) => {
      if (assessmentQuestions[index]) {
        if (assessmentQuestions[index].type === 'range') {
          score += (answer / assessmentQuestions[index].max) * 100;
        } else {
          score += answer === assessmentQuestions[index].correct ? 100 : 0;
        }
      }
    });
    
    const finalScore = Math.round(score / assessmentQuestions.length);
    
    // Update assessments
    const newAssessment: SkillAssessment = {
      $id: Date.now().toString(),
      skill: selectedSkill,
      level: finalScore >= 80 ? 'advanced' : finalScore >= 60 ? 'intermediate' : 'beginner',
      score: finalScore,
      lastAssessed: new Date().toISOString().split('T')[0]
    };
    
    setAssessments(prev => [
      ...prev.filter(a => a.skill !== selectedSkill),
      newAssessment
    ]);
    
    setShowAssessmentDialog(false);
    alert(`Assessment completed! Your score: ${finalScore}/100`);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'advanced': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'beginner': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="h-4 w-4" />;
      case 'course': return <GraduationCap className="h-4 w-4" />;
      case 'article': return <FileText className="h-4 w-4" />;
      case 'tutorial': return <Code className="h-4 w-4" />;
      case 'book': return <Book className="h-4 w-4" />;
      case 'project': return <Lightbulb className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesSearch = searchTerm === '' || 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || resource.category === categoryFilter;
    const matchesDifficulty = difficultyFilter === 'all' || resource.difficulty === difficultyFilter;
    const matchesType = typeFilter === 'all' || resource.type === typeFilter;
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesType;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading skills and resources...</p>
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
            Please log in to access skills and learning resources.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Skills & Learning Hub</h1>
        <p className="text-muted-foreground">Assess your skills, discover learning resources, and track your progress.</p>
      </div>

      {/* Skills Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skills Assessed</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assessments.length}</div>
            <p className="text-xs text-muted-foreground">Skills evaluated</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Skill Gaps</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{skillGaps.length}</div>
            <p className="text-xs text-muted-foreground">Areas to improve</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resources Available</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resources.length}</div>
            <p className="text-xs text-muted-foreground">Learning materials</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="assessment" className="space-y-6">
        <TabsList>
          <TabsTrigger value="assessment">Skill Assessment</TabsTrigger>
          <TabsTrigger value="resources">Learning Resources</TabsTrigger>
          <TabsTrigger value="gaps">Skill Gaps</TabsTrigger>
          <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="assessment">
          <Card>
            <CardHeader>
              <CardTitle>Your Skill Assessments</CardTitle>
              <CardDescription>Take assessments to evaluate your current skill levels and get personalized recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Button onClick={() => startSkillAssessment('New Skill')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Take New Assessment
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assessments.map((assessment) => (
                  <div key={assessment.$id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{assessment.skill}</h3>
                        <Badge className={getLevelColor(assessment.level)} >
                          {assessment.level}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{assessment.score}</p>
                        <p className="text-xs text-muted-foreground">/ 100</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <Progress value={assessment.score} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Last assessed: {new Date(assessment.lastAssessed).toLocaleDateString()}
                      </span>
                      <Button 
                        variant="outline" 
                        
                        onClick={() => startSkillAssessment(assessment.skill)}
                      >
                        Retake
                      </Button>
                    </div>
                    
                    {assessment.certificate && (
                      <div className="mt-3 pt-3 border-t">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Trophy className="h-3 w-3" />
                          Certified
                        </Badge>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Assessment Dialog */}
          <Dialog open={showAssessmentDialog} onOpenChange={setShowAssessmentDialog}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Skill Assessment: {selectedSkill}</DialogTitle>
              </DialogHeader>
              
              {assessmentQuestions.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Question {currentQuestionIndex + 1} of {assessmentQuestions.length}
                    </p>
                    <Progress 
                      value={((currentQuestionIndex + 1) / assessmentQuestions.length) * 100} 
                      className="w-32 h-2" 
                    />
                  </div>
                  
                  <div className="py-4">
                    <h3 className="text-lg font-medium mb-4">
                      {assessmentQuestions[currentQuestionIndex]?.question}
                    </h3>
                    
                    {assessmentQuestions[currentQuestionIndex]?.type === 'multiple_choice' && (
                      <div className="space-y-2">
                        {assessmentQuestions[currentQuestionIndex]?.options.map((option: string, idx: number) => (
                          <Button
                            key={idx}
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => {
                              const newAnswers = [...assessmentAnswers];
                              newAnswers[currentQuestionIndex] = idx;
                              setAssessmentAnswers(newAnswers);
                            }}
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    )}
                    
                    {assessmentQuestions[currentQuestionIndex]?.type === 'range' && (
                      <div className="py-4">
                        <Input
                          type="range"
                          min={assessmentQuestions[currentQuestionIndex]?.min}
                          max={assessmentQuestions[currentQuestionIndex]?.max}
                          onChange={(e) => {
                            const newAnswers = [...assessmentAnswers];
                            newAnswers[currentQuestionIndex] = parseInt(e.target.value);
                            setAssessmentAnswers(newAnswers);
                          }}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground mt-2">
                          <span>{assessmentQuestions[currentQuestionIndex]?.min}</span>
                          <span>{assessmentQuestions[currentQuestionIndex]?.max}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    {currentQuestionIndex > 0 && (
                      <Button 
                        variant="outline" 
                        onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                      >
                        Previous
                      </Button>
                    )}
                    
                    {currentQuestionIndex < assessmentQuestions.length - 1 ? (
                      <Button 
                        onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                        disabled={assessmentAnswers[currentQuestionIndex] === undefined}
                      >
                        Next
                      </Button>
                    ) : (
                      <Button 
                        onClick={submitAssessment}
                        disabled={assessmentAnswers.length !== assessmentQuestions.length}
                      >
                        Submit Assessment
                      </Button>
                    )}
                    
                    <Button variant="outline" onClick={() => setShowAssessmentDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="resources">
          <Card>
            <CardHeader>
              <CardTitle>Learning Resources ({resources.length})</CardTitle>
              <CardDescription>Discover courses, tutorials, and materials to enhance your skills</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <Input
                    placeholder="Search resources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Programming">Programming</SelectItem>
                    <SelectItem value="Web Development">Web Development</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Backend Development">Backend Development</SelectItem>
                    <SelectItem value="Interview Prep">Interview Prep</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="course">Course</SelectItem>
                    <SelectItem value="tutorial">Tutorial</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="book">Book</SelectItem>
                    <SelectItem value="project">Project</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((resource) => (
                  <div key={resource.$id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    {resource.thumbnail && (
                      <div className="h-48 bg-gray-100">
                        {/* Placeholder for thumbnail */}
                        <div className="h-full flex items-center justify-center text-gray-400">
                          {getTypeIcon(resource.type)}
                        </div>
                      </div>
                    )}
                    
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(resource.type)}
                          <Badge variant="outline" className="text-xs">
                            {resource.type}
                          </Badge>
                        </div>
                        <Badge className={getLevelColor(resource.difficulty)} >
                          {resource.difficulty}
                        </Badge>
                      </div>
                      
                      <h3 className="font-semibold mb-2 line-clamp-2">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                        {resource.description}
                      </p>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{resource.rating}</span>
                        </div>
                        {resource.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {Math.round(resource.duration / 60)}h
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {resource.skills.slice(0, 3).map((skill, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {resource.skills.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{resource.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          {resource.isFree ? (
                            <Badge className="bg-green-100 text-green-800">FREE</Badge>
                          ) : (
                            <span className="font-semibold text-primary">
                              ${resource.price}
                            </span>
                          )}
                        </div>
                        <Button  asChild>
                          <a href={resource.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Start Learning
                          </a>
                        </Button>
                      </div>
                      
                      <div className="text-xs text-muted-foreground mt-2">
                        by {resource.provider}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredResources.length === 0 && (
                <div className="text-center py-16">
                  <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No resources found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search criteria or filters.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gaps">
          <Card>
            <CardHeader>
              <CardTitle>Skill Gap Analysis</CardTitle>
              <CardDescription>Identify areas for improvement and get personalized learning recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {skillGaps.map((gap, index) => (
                  <div key={index} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold mb-2">{gap.skill}</h3>
                        <div className="flex items-center gap-4">
                          <div className="text-sm">
                            <span className="text-muted-foreground">Current: </span>
                            <Badge className={getLevelColor(gap.currentLevel)} >
                              {gap.currentLevel}
                            </Badge>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          <div className="text-sm">
                            <span className="text-muted-foreground">Required: </span>
                            <Badge className={getLevelColor(gap.requiredLevel)} >
                              {gap.requiredLevel}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-500">{gap.gap}%</div>
                        <div className="text-xs text-muted-foreground">Gap</div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <Progress value={100 - gap.gap} className="h-2" />
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Recommended Resources:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {gap.recommendations.slice(0, 3).map((resource) => (
                          <div key={resource.$id} className="p-3 border rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              {getTypeIcon(resource.type)}
                              <span className="text-sm font-medium">{resource.title}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Badge className={getLevelColor(resource.difficulty)} >
                                  {resource.difficulty}
                                </Badge>
                                {resource.isFree && (
                                  <Badge className="bg-green-100 text-green-800" >
                                    FREE
                                  </Badge>
                                )}
                              </div>
                              <Button  variant="outline">
                                View
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
                
                {skillGaps.length === 0 && (
                  <div className="text-center py-16">
                    <Trophy className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Great job!</h3>
                    <p className="text-muted-foreground">
                      No significant skill gaps detected based on your assessments.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress">
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>Track your skill development journey over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-16">
                <TrendingUp className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Progress Tracking Coming Soon</h3>
                <p className="text-muted-foreground mb-6">
                  We're building comprehensive progress tracking features to help you monitor your learning journey.
                </p>
                <Button variant="outline">
                  <Target className="h-4 w-4 mr-2" />
                  Set Learning Goals
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}