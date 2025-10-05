'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3,
  TrendingUp,
  Target,
  Clock,
  Award,
  BookOpen,
  Brain,
  Upload,
  Calendar,
  Users,
  Activity,
  PieChart,
  LineChart,
  Download,
  RefreshCw,
  Filter
} from 'lucide-react';

// Mock analytics data
const analyticsData = {
  overview: {
    totalInternshipDays: 90,
    completedDays: 45,
    logbookEntries: 42,
    skillsAssessments: 3,
    averageScore: 87,
    filesUploaded: 15,
    creditsEarned: 16,
    weeklyProgress: [
      { week: 1, entries: 5, hours: 40, score: 85 },
      { week: 2, entries: 6, hours: 42, score: 88 },
      { week: 3, entries: 5, hours: 38, score: 82 },
      { week: 4, entries: 7, hours: 44, score: 91 },
      { week: 5, entries: 6, hours: 40, score: 89 },
      { week: 6, entries: 8, hours: 45, score: 93 },
      { week: 7, entries: 5, hours: 35, score: 86 }
    ]
  },
  skillsBreakdown: {
    technical: { score: 92, assessments: 2, improvement: +8 },
    communication: { score: 85, assessments: 1, improvement: +5 },
    problemSolving: { score: 89, assessments: 2, improvement: +12 },
    teamwork: { score: 78, assessments: 1, improvement: +3 },
    leadership: { score: 82, assessments: 1, improvement: +15 }
  },
  activityPattern: {
    daily: [
      { day: 'Mon', entries: 8, hours: 7.2 },
      { day: 'Tue', entries: 6, hours: 6.8 },
      { day: 'Wed', entries: 7, hours: 8.1 },
      { day: 'Thu', entries: 5, hours: 7.5 },
      { day: 'Fri', entries: 9, hours: 8.0 },
      { day: 'Sat', entries: 4, hours: 4.2 },
      { day: 'Sun', entries: 3, hours: 2.8 }
    ],
    hourly: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      activity: Math.max(0, Math.round(Math.sin((i - 9) * Math.PI / 8) * 5 + 3))
    }))
  },
  fileCategories: {
    resume: { count: 2, percentage: 13 },
    certificate: { count: 5, percentage: 33 },
    report: { count: 4, percentage: 27 },
    document: { count: 3, percentage: 20 },
    image: { count: 1, percentage: 7 }
  },
  goals: [
    { title: 'Complete 50 Logbook Entries', current: 42, target: 50, percentage: 84 },
    { title: 'Achieve 85% Average Score', current: 87, target: 85, percentage: 100 },
    { title: 'Finish 5 Skills Assessments', current: 3, target: 5, percentage: 60 },
    { title: 'Upload 20 Documents', current: 15, target: 20, percentage: 75 }
  ],
  predictions: {
    internshipCompletion: '2024-03-15',
    expectedFinalScore: 89,
    creditsOnTrack: true,
    riskFactors: ['Low weekend activity', 'Inconsistent daily entries']
  }
};

export default function AnalyticsPage() {
  const [data, setData] = useState(analyticsData);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getImprovementIndicator = (improvement: number) => {
    if (improvement > 0) {
      return <span className="text-green-600 text-xs">↗ +{improvement}%</span>;
    } else if (improvement < 0) {
      return <span className="text-red-600 text-xs">↘ {improvement}%</span>;
    }
    return <span className="text-gray-600 text-xs">→ 0%</span>;
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into your internship progress and performance
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline"  onClick={refreshData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Progress</p>
                <p className="text-2xl font-bold">
                  {Math.round((data.overview.completedDays / data.overview.totalInternshipDays) * 100)}%
                </p>
                <p className="text-xs text-green-600">
                  {data.overview.completedDays}/{data.overview.totalInternshipDays} days
                </p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
            <Progress 
              value={(data.overview.completedDays / data.overview.totalInternshipDays) * 100} 
              className="mt-3 h-2" 
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Score</p>
                <p className={`text-2xl font-bold ${getScoreColor(data.overview.averageScore)}`}>
                  {data.overview.averageScore}%
                </p>
                <p className="text-xs text-green-600">↗ +5% from last week</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Entries</p>
                <p className="text-2xl font-bold">{data.overview.logbookEntries}</p>
                <p className="text-xs text-blue-600">+6 this week</p>
              </div>
              <BookOpen className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Credits</p>
                <p className="text-2xl font-bold">{data.overview.creditsEarned}</p>
                <p className="text-xs text-purple-600">80% of requirement</p>
              </div>
              <Award className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Weekly Progress Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Weekly Progress Trend
              </CardTitle>
              <CardDescription>Your performance over the past 7 weeks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-7 gap-2 text-center">
                  {data.overview.weeklyProgress.map((week) => (
                    <div key={week.week} className="space-y-2">
                      <div className="text-xs font-medium">Week {week.week}</div>
                      <div className="space-y-1">
                        <div className="bg-blue-100 rounded-full h-16 flex items-end justify-center">
                          <div 
                            className="bg-blue-500 rounded-full w-full transition-all"
                            style={{ height: `${(week.entries / 10) * 100}%` }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground">{week.entries} entries</div>
                        <div className="text-xs font-semibold">{week.score}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* File Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                File Distribution
              </CardTitle>
              <CardDescription>Breakdown of your uploaded documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(data.fileCategories).map(([category, info]) => (
                  <div key={category} className="text-center space-y-2">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                      {info.count}
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium capitalize">{category}</div>
                      <div className="text-sm text-muted-foreground">{info.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Skills Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Skills Assessment Results
                </CardTitle>
                <CardDescription>Your performance across different skill areas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(data.skillsBreakdown).map(([skill, info]) => (
                  <div key={skill} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium capitalize">{skill.replace(/([A-Z])/g, ' $1')}</span>
                        <Badge variant="outline">{info.assessments} tests</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${getScoreColor(info.score)}`}>{info.score}%</span>
                        {getImprovementIndicator(info.improvement)}
                      </div>
                    </div>
                    <Progress value={info.score} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Skills Radar Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Skills Radar</CardTitle>
                <CardDescription>Visual representation of your skill levels</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 mx-auto rounded-full border-4 border-dashed border-gray-300 flex items-center justify-center">
                    <Brain className="h-12 w-12 text-gray-400" />
                  </div>
                  <p className="text-muted-foreground">Interactive radar chart would appear here</p>
                  <Button variant="outline" >View Detailed Analysis</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          {/* Daily Activity Pattern */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Daily Activity Pattern
              </CardTitle>
              <CardDescription>Your activity levels throughout the week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {data.activityPattern.daily.map((day) => (
                  <div key={day.day} className="text-center space-y-2">
                    <div className="text-sm font-medium">{day.day}</div>
                    <div className="space-y-1">
                      <div className="bg-gray-100 rounded h-24 flex items-end justify-center">
                        <div 
                          className="bg-blue-500 rounded w-full transition-all"
                          style={{ height: `${(day.entries / 10) * 100}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">{day.entries} entries</div>
                      <div className="text-xs font-medium">{day.hours}h</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Time Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Hourly Activity Distribution
              </CardTitle>
              <CardDescription>When you're most active during the day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-12 gap-1">
                {data.activityPattern.hourly.map((hour) => (
                  <div key={hour.hour} className="text-center space-y-1">
                    <div className="text-xs">{hour.hour}</div>
                    <div className="bg-gray-100 rounded h-16 flex items-end">
                      <div 
                        className="bg-green-500 rounded w-full transition-all"
                        style={{ height: `${(hour.activity / 8) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.goals.map((goal, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{goal.title}</CardTitle>
                  <CardDescription>
                    {goal.current} of {goal.target} ({goal.percentage}% complete)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Progress value={goal.percentage} className="h-3" />
                    <div className="flex justify-between text-sm">
                      <span>Current: {goal.current}</span>
                      <span>Target: {goal.target}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    {goal.percentage >= 100 ? (
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    ) : goal.percentage >= 80 ? (
                      <Badge className="bg-yellow-100 text-yellow-800">On Track</Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">Needs Attention</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {/* Predictions and Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Performance Insights
                </CardTitle>
                <CardDescription>AI-powered analysis of your progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Expected Completion</h4>
                  <p className="text-blue-800">
                    Based on your current pace, you're likely to complete your internship on{' '}
                    <strong>{new Date(data.predictions.internshipCompletion).toLocaleDateString()}</strong>
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Projected Final Score</h4>
                  <p className="text-green-800">
                    Your expected final score is <strong>{data.predictions.expectedFinalScore}%</strong>, 
                    which exceeds the minimum requirement.
                  </p>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 mb-2">Areas for Improvement</h4>
                  <ul className="text-yellow-800 space-y-1">
                    {data.predictions.riskFactors.map((risk, index) => (
                      <li key={index}>• {risk}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Achievements & Milestones
                </CardTitle>
                <CardDescription>Your accomplishments so far</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Award className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">Consistency Champion</div>
                      <div className="text-sm text-muted-foreground">7 consecutive weeks of entries</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <Brain className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">Skill Master</div>
                      <div className="text-sm text-muted-foreground">Scored 90+ in technical skills</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <Target className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium">Goal Achiever</div>
                      <div className="text-sm text-muted-foreground">Completed 50% of internship</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}