'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Brain,
  Clock,
  CheckCircle,
  AlertCircle,
  Award,
  BookOpen,
  Code,
  Zap,
  Target,
  TrendingUp,
  Play,
  Pause,
  RotateCcw,
  Star,
  Trophy
} from 'lucide-react';
import { SkillOperations } from '@/lib/database-operations';

interface Question {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer';
  options?: string[];
  correctAnswer?: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface Assessment {
  $id: string;
  title: string;
  description: string;
  category: string;
  duration: number; // in minutes
  totalQuestions: number;
  totalPoints: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  questions: Question[];
  status: 'not-started' | 'in-progress' | 'completed';
  score?: number;
  startedAt?: string;
  completedAt?: string;
}

interface UserAnswer {
  questionId: string;
  answer: string;
  points: number;
}

// Mock assessment data
const mockAssessments: Assessment[] = [
  {
    $id: '1',
    title: 'JavaScript Fundamentals',
    description: 'Test your knowledge of JavaScript basics, variables, functions, and control structures',
    category: 'Programming',
    duration: 30,
    totalQuestions: 20,
    totalPoints: 100,
    difficulty: 'beginner',
    status: 'not-started',
    questions: [
      {
        id: '1',
        question: 'What is the correct way to declare a variable in JavaScript?',
        type: 'multiple-choice',
        options: ['var x = 5;', 'variable x = 5;', 'v x = 5;', 'declare x = 5;'],
        correctAnswer: 'var x = 5;',
        points: 5,
        difficulty: 'easy'
      },
      {
        id: '2',
        question: 'JavaScript is a case-sensitive language.',
        type: 'true-false',
        options: ['True', 'False'],
        correctAnswer: 'True',
        points: 5,
        difficulty: 'easy'
      },
      {
        id: '3',
        question: 'Explain the difference between let, const, and var in JavaScript.',
        type: 'short-answer',
        points: 10,
        difficulty: 'medium'
      }
    ]
  },
  {
    $id: '2',
    title: 'React Development',
    description: 'Assess your React skills including components, hooks, and state management',
    category: 'Frontend',
    duration: 45,
    totalQuestions: 25,
    totalPoints: 125,
    difficulty: 'intermediate',
    status: 'completed',
    score: 92,
    completedAt: '2024-01-10T14:30:00Z',
    questions: []
  },
  {
    $id: '3',
    title: 'Database Design',
    description: 'Test your knowledge of database concepts, SQL, and normalization',
    category: 'Backend',
    duration: 60,
    totalQuestions: 30,
    totalPoints: 150,
    difficulty: 'advanced',
    status: 'in-progress',
    startedAt: '2024-01-15T10:00:00Z',
    questions: []
  }
];

export default function SkillsAssessmentPage() {
  const [assessments, setAssessments] = useState<Assessment[]>(mockAssessments);
  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsTimerActive(false);
            handleSubmitAssessment();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isTimerActive, timeRemaining]);

  const startAssessment = (assessment: Assessment) => {
    setCurrentAssessment(assessment);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setTimeRemaining(assessment.duration * 60);
    setIsTimerActive(true);
    setShowResults(false);
    
    // Update assessment status
    setAssessments(prev => prev.map(a => 
      a.$id === assessment.$id 
        ? { ...a, status: 'in-progress', startedAt: new Date().toISOString() }
        : a
    ));
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    const question = currentAssessment?.questions.find(q => q.id === questionId);
    if (!question) return;

    let points = 0;
    if (question.type === 'multiple-choice' || question.type === 'true-false') {
      points = answer === question.correctAnswer ? question.points : 0;
    } else {
      // For short answer, we'll give partial credit based on length
      points = answer.length > 20 ? Math.round(question.points * 0.8) : Math.round(question.points * 0.5);
    }

    setUserAnswers(prev => {
      const existing = prev.find(ua => ua.questionId === questionId);
      if (existing) {
        return prev.map(ua => 
          ua.questionId === questionId 
            ? { ...ua, answer, points }
            : ua
        );
      } else {
        return [...prev, { questionId, answer, points }];
      }
    });
  };

  const nextQuestion = () => {
    if (currentAssessment && currentQuestionIndex < currentAssessment.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitAssessment = async () => {
    if (!currentAssessment) return;

    setIsTimerActive(false);
    
    const totalScore = userAnswers.reduce((sum, answer) => sum + answer.points, 0);
    const percentage = Math.round((totalScore / currentAssessment.totalPoints) * 100);
    
    // Update assessment status
    setAssessments(prev => prev.map(a => 
      a.$id === currentAssessment.$id 
        ? { 
            ...a, 
            status: 'completed',
            score: percentage,
            completedAt: new Date().toISOString()
          }
        : a
    ));

    setShowResults(true);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (showResults && currentAssessment) {
    const totalScore = userAnswers.reduce((sum, answer) => sum + answer.points, 0);
    const percentage = Math.round((totalScore / currentAssessment.totalPoints) * 100);
    
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              {percentage >= 80 ? (
                <Trophy className="h-16 w-16 text-yellow-500 mx-auto" />
              ) : percentage >= 60 ? (
                <Award className="h-16 w-16 text-blue-500 mx-auto" />
              ) : (
                <Target className="h-16 w-16 text-gray-500 mx-auto" />
              )}
            </div>
            <CardTitle className="text-2xl">Assessment Complete!</CardTitle>
            <CardDescription>
              {currentAssessment.title}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className={`text-4xl font-bold mb-2 ${getScoreColor(percentage)}`}>
                {percentage}%
              </div>
              <p className="text-muted-foreground">
                {totalScore} out of {currentAssessment.totalPoints} points
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="font-semibold">Correct</div>
                  <div className="text-2xl font-bold text-green-600">
                    {userAnswers.filter(a => a.points > 0).length}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <div className="font-semibold">Incorrect</div>
                  <div className="text-2xl font-bold text-red-600">
                    {userAnswers.filter(a => a.points === 0).length}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="font-semibold">Time Taken</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatTime((currentAssessment.duration * 60) - timeRemaining)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={() => {
                setCurrentAssessment(null);
                setShowResults(false);
              }}>
                Back to Assessments
              </Button>
              <Button variant="outline" onClick={() => startAssessment(currentAssessment)}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentAssessment && !showResults) {
    const currentQuestion = currentAssessment.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / currentAssessment.questions.length) * 100;
    
    return (
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">{currentAssessment.title}</h2>
                <p className="text-sm text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {currentAssessment.questions.length}
                </p>
              </div>
              
              <div className="text-right">
                <div className={`text-2xl font-mono font-bold ${timeRemaining < 300 ? 'text-red-600' : 'text-blue-600'}`}>
                  {formatTime(timeRemaining)}
                </div>
                <p className="text-xs text-muted-foreground">Time Remaining</p>
              </div>
            </div>
            
            <Progress value={progress} className="mb-2" />
            <p className="text-xs text-muted-foreground">Progress: {Math.round(progress)}%</p>
          </CardContent>
        </Card>

        {/* Question */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                {currentQuestion.question}
              </CardTitle>
              <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                {currentQuestion.difficulty}
              </Badge>
            </div>
            <CardDescription>
              Points: {currentQuestion.points}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentQuestion.type === 'multiple-choice' && (
              <RadioGroup
                value={userAnswers.find(a => a.questionId === currentQuestion.id)?.answer || ''}
                onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
              >
                {currentQuestion.options?.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer p-2 rounded hover:bg-muted">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {currentQuestion.type === 'true-false' && (
              <RadioGroup
                value={userAnswers.find(a => a.questionId === currentQuestion.id)?.answer || ''}
                onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="True" id="true" />
                  <Label htmlFor="true" className="cursor-pointer">True</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="False" id="false" />
                  <Label htmlFor="false" className="cursor-pointer">False</Label>
                </div>
              </RadioGroup>
            )}

            {currentQuestion.type === 'short-answer' && (
              <Textarea
                placeholder="Enter your answer here..."
                value={userAnswers.find(a => a.questionId === currentQuestion.id)?.answer || ''}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                className="min-h-32"
              />
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>
              
              <div className="flex gap-2">
                {currentQuestionIndex === currentAssessment.questions.length - 1 ? (
                  <Button onClick={handleSubmitAssessment} className="bg-green-600 hover:bg-green-700">
                    Submit Assessment
                  </Button>
                ) : (
                  <Button onClick={nextQuestion}>
                    Next
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Skills Assessment</h1>
          <p className="text-muted-foreground">
            Evaluate and improve your technical skills with comprehensive assessments
          </p>
        </div>
        <Brain className="h-12 w-12 text-blue-500" />
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{assessments.length}</p>
                <p className="text-sm text-muted-foreground">Available</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {assessments.filter(a => a.status === 'completed').length}
                </p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">
                  {assessments.filter(a => a.status === 'in-progress').length}
                </p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">
                  {Math.round(
                    assessments
                      .filter(a => a.score !== undefined)
                      .reduce((sum, a) => sum + (a.score || 0), 0) /
                    assessments.filter(a => a.score !== undefined).length || 0
                  )}%
                </p>
                <p className="text-sm text-muted-foreground">Avg Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="available" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="available">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessments.filter(a => a.status === 'not-started').map((assessment) => (
              <Card key={assessment.$id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{assessment.title}</CardTitle>
                    <Badge className={getDifficultyColor(assessment.difficulty)}>
                      {assessment.difficulty}
                    </Badge>
                  </div>
                  <CardDescription>{assessment.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {assessment.duration} min
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      {assessment.totalQuestions} questions
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {assessment.totalPoints} points
                    </span>
                  </div>
                  
                  <Badge variant="outline">{assessment.category}</Badge>
                  
                  <Button 
                    className="w-full"
                    onClick={() => startAssessment(assessment)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Assessment
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <div className="space-y-4">
            {assessments.filter(a => a.status === 'completed').map((assessment) => (
              <Card key={assessment.$id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{assessment.title}</h3>
                      <p className="text-muted-foreground mb-2">{assessment.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <Badge className={getDifficultyColor(assessment.difficulty)}>
                          {assessment.difficulty}
                        </Badge>
                        <span>{assessment.category}</span>
                        <span>
                          Completed: {new Date(assessment.completedAt!).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${getScoreColor(assessment.score!)}`}>
                        {assessment.score}%
                      </div>
                      <p className="text-sm text-muted-foreground">Score</p>
                      <Button 
                        variant="outline" 
                         
                        className="mt-2"
                        onClick={() => startAssessment(assessment)}
                      >
                        Retake
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progress">
          <div className="space-y-4">
            {assessments.filter(a => a.status === 'in-progress').map((assessment) => (
              <Card key={assessment.$id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{assessment.title}</h3>
                      <p className="text-muted-foreground mb-2">{assessment.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <Badge className={getDifficultyColor(assessment.difficulty)}>
                          {assessment.difficulty}
                        </Badge>
                        <span>{assessment.category}</span>
                        <span>
                          Started: {new Date(assessment.startedAt!).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Alert className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Assessment in progress
                        </AlertDescription>
                      </Alert>
                      <Button 
                        onClick={() => startAssessment(assessment)}
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}