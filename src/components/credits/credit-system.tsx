'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Award, 
  BookOpen, 
  Calendar, 
  CheckCircle, 
  Clock,
  FileText,
  GraduationCap,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Zap
} from 'lucide-react';
import { CreditOperations } from '@/lib/database-operations';

interface CreditRecord {
  $id: string;
  internshipId: string;
  studentId: string;
  internshipTitle: string;
  companyName: string;
  duration: number; // months
  workHours: number;
  assessmentScores: number[];
  skillsGained: string[];
  credits: number;
  status: 'pending' | 'approved' | 'certified';
  certificationDate?: string;
  grade: string;
  nepCompliant: boolean;
}

interface CreditSummary {
  totalCredits: number;
  approvedCredits: number;
  pendingCredits: number;
  requiredCredits: number;
  completionPercentage: number;
}

export function CreditSystem({ userId }: { userId: string }) {
  const [creditRecords, setCreditRecords] = useState<CreditRecord[]>([]);
  const [creditSummary, setCreditSummary] = useState<CreditSummary>({
    totalCredits: 0,
    approvedCredits: 0,
    pendingCredits: 0,
    requiredCredits: 20, // NEP 2020 requirement
    completionPercentage: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCreditData();
  }, [userId]);

  const loadCreditData = async () => {
    try {
      // Mock data for NEP 2020 compliant credit system
      const mockRecords: CreditRecord[] = [
        {
          $id: '1',
          internshipId: 'int1',
          studentId: userId,
          internshipTitle: 'Software Development Intern',
          companyName: 'TechCorp Solutions',
          duration: 6,
          workHours: 960, // 160 hours/month * 6 months
          assessmentScores: [85, 90, 88, 92],
          skillsGained: ['React', 'Node.js', 'Database Design', 'API Development'],
          credits: 6,
          status: 'approved',
          certificationDate: '2024-07-15',
          grade: 'A',
          nepCompliant: true
        },
        {
          $id: '2',
          internshipId: 'int2',
          studentId: userId,
          internshipTitle: 'Data Analytics Intern',
          companyName: 'DataCorp Inc',
          duration: 3,
          workHours: 480,
          assessmentScores: [78, 82, 80],
          skillsGained: ['Python', 'SQL', 'Data Visualization', 'Machine Learning'],
          credits: 4,
          status: 'pending',
          grade: 'B+',
          nepCompliant: true
        }
      ];

      setCreditRecords(mockRecords);
      
      // Calculate summary
      const totalCredits = mockRecords.reduce((sum, record) => sum + record.credits, 0);
      const approvedCredits = mockRecords
        .filter(record => record.status === 'approved')
        .reduce((sum, record) => sum + record.credits, 0);
      const pendingCredits = mockRecords
        .filter(record => record.status === 'pending')
        .reduce((sum, record) => sum + record.credits, 0);
      
      setCreditSummary({
        totalCredits,
        approvedCredits,
        pendingCredits,
        requiredCredits: 20,
        completionPercentage: Math.round((approvedCredits / 20) * 100)
      });
      
    } catch (error) {
      console.error('Error loading credit data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateNEPCredits = async (internshipData: any) => {
    const result = await CreditOperations.calculateCredits(internshipData);
    return result.success ? result.data : 0;
  };

  const getGradeColor = (grade: string) => {
    switch (grade.charAt(0)) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-blue-100 text-blue-800';
      case 'C': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'certified': return 'bg-purple-100 text-purple-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Credit Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            NEP 2020 Credit Summary
          </CardTitle>
          <CardDescription>
            Your academic credit progress under the National Education Policy 2020
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {creditSummary.approvedCredits}
              </div>
              <div className="text-sm text-muted-foreground">Approved Credits</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500 mb-2">
                {creditSummary.pendingCredits}
              </div>
              <div className="text-sm text-muted-foreground">Pending Credits</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {creditSummary.requiredCredits}
              </div>
              <div className="text-sm text-muted-foreground">Required Credits</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {creditSummary.completionPercentage}%
              </div>
              <div className="text-sm text-muted-foreground">Completion</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Credit Progress</span>
              <span>{creditSummary.approvedCredits}/{creditSummary.requiredCredits} credits</span>
            </div>
            <Progress 
              value={creditSummary.completionPercentage} 
              className="h-3"
            />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>NEP 2020 Compliant</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Credit Records */}
      <Card>
        <CardHeader>
          <CardTitle>Credit Records ({creditRecords.length})</CardTitle>
          <CardDescription>
            Detailed breakdown of credits earned from internships
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {creditRecords.length > 0 ? (
              creditRecords.map((record) => (
                <div key={record.$id} className="p-6 border rounded-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{record.internshipTitle}</h3>
                        <Badge className={getStatusColor(record.status)}>
                          {record.status}
                        </Badge>
                        {record.nepCompliant && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            NEP 2020
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">
                        {record.companyName} • {record.duration} months • {record.workHours} hours
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-2xl font-bold text-primary">{record.credits}</div>
                          <div className="text-xs text-muted-foreground">Credits Earned</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold">{record.grade}</div>
                          <div className="text-xs text-muted-foreground">Grade</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold">
                            {Math.round(record.assessmentScores.reduce((a, b) => a + b, 0) / record.assessmentScores.length)}%
                          </div>
                          <div className="text-xs text-muted-foreground">Avg Score</div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-lg font-bold">{record.skillsGained.length}</div>
                          <div className="text-xs text-muted-foreground">Skills</div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-medium text-sm mb-2">Skills Gained</h4>
                        <div className="flex flex-wrap gap-1">
                          {record.skillsGained.map((skill, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-medium text-sm mb-2">Assessment Scores</h4>
                        <div className="flex gap-2">
                          {record.assessmentScores.map((score, idx) => (
                            <Badge key={idx} variant="outline">
                              {score}%
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2 ml-6">
                      <div className="text-center">
                        <Trophy className="h-8 w-8 text-gold-500 mx-auto mb-1" />
                        <Badge className={getGradeColor(record.grade)}>
                          {record.grade}
                        </Badge>
                      </div>
                      
                      {record.status === 'approved' && (
                        <div className="text-center">
                          <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-1" />
                          <div className="text-xs text-muted-foreground">
                            {record.certificationDate && 
                              new Date(record.certificationDate).toLocaleDateString()
                            }
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Credit Calculation: Base ({record.duration} months) + Performance + Skills
                      </div>
                      <Button variant="outline" >
                        View Certificate
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Award className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No credit records yet</h3>
                <p className="text-muted-foreground">
                  Complete internships to earn NEP 2020 compliant credits
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* NEP 2020 Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            NEP 2020 Credit Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Credit Calculation</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  1 credit per month minimum
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Bonus credits for {'>'}160 hours/month
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Performance-based additional credits
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Maximum 6 credits per internship
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Requirements</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-500" />
                  Minimum 160 work hours per credit
                </li>
                <li className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-500" />
                  Regular assessment submissions
                </li>
                <li className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-500" />
                  Faculty supervision required
                </li>
                <li className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-500" />
                  Industry mentor evaluation
                </li>
              </ul>
            </div>
          </div>
          
          <Alert className="mt-6">
            <AlertDescription>
              <strong>Note:</strong> All internships must be approved by academic institutions and meet NEP 2020 
              guidelines for credit recognition. Credits are transferable across institutions following NEP 2020 protocols.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}