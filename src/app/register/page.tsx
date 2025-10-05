'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, User, Building2, GraduationCap, Users } from 'lucide-react';

type UserRole = 'student' | 'faculty' | 'company' | 'admin';

interface FormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  phone: string;
  role: UserRole;
  // Student specific
  rollNumber?: string;
  collegeId?: string;
  department?: string;
  semester?: string;
  cgpa?: string;
  // Faculty specific
  employeeId?: string;
  designation?: string;
  // Company specific
  companyName?: string;
  companyType?: string;
  industry?: string;
  website?: string;
  address?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { register, loginDemo, isLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<UserRole>('student');
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    role: 'student'
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      role: activeTab
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.name) {
      setError('Please fill in all required fields');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    // Role-specific validation
    if (activeTab === 'student' && (!formData.rollNumber || !formData.department)) {
      setError('Please fill in all student details');
      return false;
    }

    if (activeTab === 'faculty' && (!formData.employeeId || !formData.designation)) {
      setError('Please fill in all faculty details');
      return false;
    }

    if (activeTab === 'company' && (!formData.companyName || !formData.industry)) {
      setError('Please fill in all company details');
      return false;
    }

    return true;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Map company role to industry_partner for auth context
      const mappedRole = activeTab === 'company' ? 'industry_partner' : activeTab;
      
      const registerData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: mappedRole as 'student' | 'faculty' | 'admin' | 'industry_partner',
        phone: formData.phone,
        college: formData.collegeId || '',
        department: formData.department || ''
      };

      const result = await register(registerData);
      
      if (result.success) {
        setSuccess('🎉 Account created successfully! Redirecting to your dashboard...');
        // The auth context will handle the redirect automatically
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }

    } catch (error: any) {
      console.error('Registration error:', error);
      setError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    const result = await loginDemo();
    if (!result.success) {
      setError(result.error || 'Demo login failed');
    }
  };

  const renderStudentFields = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="rollNumber">Roll Number *</Label>
          <Input
            id="rollNumber"
            type="text"
            value={formData.rollNumber || ''}
            onChange={(e) => handleInputChange('rollNumber', e.target.value)}
            placeholder="Enter roll number"
            required
          />
        </div>
        <div>
          <Label htmlFor="department">Department *</Label>
          <Select onValueChange={(value) => handleInputChange('department', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="computer_science">Computer Science</SelectItem>
              <SelectItem value="information_technology">Information Technology</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="mechanical">Mechanical</SelectItem>
              <SelectItem value="civil">Civil</SelectItem>
              <SelectItem value="electrical">Electrical</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="semester">Semester</Label>
          <Select onValueChange={(value) => handleInputChange('semester', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select semester" />
            </SelectTrigger>
            <SelectContent>
              {[1,2,3,4,5,6,7,8].map(sem => (
                <SelectItem key={sem} value={sem.toString()}>{sem}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="cgpa">CGPA</Label>
          <Input
            id="cgpa"
            type="number"
            step="0.01"
            min="0"
            max="10"
            value={formData.cgpa || ''}
            onChange={(e) => handleInputChange('cgpa', e.target.value)}
            placeholder="Enter CGPA"
          />
        </div>
      </div>
    </div>
  );

  const renderFacultyFields = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="employeeId">Employee ID *</Label>
          <Input
            id="employeeId"
            type="text"
            value={formData.employeeId || ''}
            onChange={(e) => handleInputChange('employeeId', e.target.value)}
            placeholder="Enter employee ID"
            required
          />
        </div>
        <div>
          <Label htmlFor="designation">Designation *</Label>
          <Select onValueChange={(value) => handleInputChange('designation', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select designation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="assistant_professor">Assistant Professor</SelectItem>
              <SelectItem value="associate_professor">Associate Professor</SelectItem>
              <SelectItem value="professor">Professor</SelectItem>
              <SelectItem value="hod">Head of Department</SelectItem>
              <SelectItem value="coordinator">Internship Coordinator</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="department">Department</Label>
        <Select onValueChange={(value) => handleInputChange('department', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="computer_science">Computer Science</SelectItem>
            <SelectItem value="information_technology">Information Technology</SelectItem>
            <SelectItem value="electronics">Electronics</SelectItem>
            <SelectItem value="mechanical">Mechanical</SelectItem>
            <SelectItem value="civil">Civil</SelectItem>
            <SelectItem value="electrical">Electrical</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderCompanyFields = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="companyName">Company Name *</Label>
        <Input
          id="companyName"
          type="text"
          value={formData.companyName || ''}
          onChange={(e) => handleInputChange('companyName', e.target.value)}
          placeholder="Enter company name"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="industry">Industry *</Label>
          <Select onValueChange={(value) => handleInputChange('industry', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="manufacturing">Manufacturing</SelectItem>
              <SelectItem value="consulting">Consulting</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="companyType">Company Type</Label>
          <Select onValueChange={(value) => handleInputChange('companyType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="startup">Startup</SelectItem>
              <SelectItem value="sme">SME</SelectItem>
              <SelectItem value="corporate">Corporate</SelectItem>
              <SelectItem value="government">Government</SelectItem>
              <SelectItem value="ngo">NGO</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          type="url"
          value={formData.website || ''}
          onChange={(e) => handleInputChange('website', e.target.value)}
          placeholder="https://company.com"
        />
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          type="text"
          value={formData.address || ''}
          onChange={(e) => handleInputChange('address', e.target.value)}
          placeholder="Company address"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 py-8">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-xl sm:text-2xl font-bold">Create Account</CardTitle>
          <p className="text-gray-600 text-sm sm:text-base">Join the Prashiskshan platform</p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as UserRole)}>
            <TabsList className="grid grid-cols-4 w-full mb-6">
              <TabsTrigger value="student" className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Student
              </TabsTrigger>
              <TabsTrigger value="faculty" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Faculty
              </TabsTrigger>
              <TabsTrigger value="company" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Company
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Admin
              </TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Common fields */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Enter password"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="Confirm password"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Role-specific fields */}
              <TabsContent value="student" className="mt-4">
                {renderStudentFields()}
              </TabsContent>
              <TabsContent value="faculty" className="mt-4">
                {renderFacultyFields()}
              </TabsContent>
              <TabsContent value="company" className="mt-4">
                {renderCompanyFields()}
              </TabsContent>
              <TabsContent value="admin" className="mt-4">
                <Alert>
                  <AlertDescription>
                    Admin accounts require approval. Please contact the system administrator.
                  </AlertDescription>
                </Alert>
              </TabsContent>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50 text-green-800">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

                      <Button type="submit" className="w-full" disabled={loading || isLoading}>
                        {loading || isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Account...
                          </>
                        ) : (
                          'Create Account'
                        )}
                      </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button 
              type="button" 
              variant="outline" 
              className="w-full" 
              onClick={handleDemoLogin}
              disabled={loading || isLoading}
            >
              {loading || isLoading ? 'Loading Demo...' : 'Try Demo'}
            </Button>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-600 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}