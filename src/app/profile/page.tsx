'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Building2,
  Edit,
  Save,
  X,
  Camera,
  Upload,
  FileText,
  Award,
  Briefcase
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { profileUpdateSchema, type ProfileUpdateData } from '@/lib/validations';

// Mock data - In real app, this would come from API/context
const mockProfile = {
  id: 'user123',
  name: 'Priya Sharma',
  email: 'priya.sharma@example.com',
  phone: '+977-9841234567',
  profileImage: '',
  role: 'student' as const,
  college: 'Kathmandu University',
  program: 'Bachelor in Computer Engineering',
  semester: '7th Semester',
  dateOfBirth: '2001-05-15',
  address: 'Dhulikhel, Kavre',
  bio: 'Passionate computer engineering student with interests in web development, artificial intelligence, and sustainable technology solutions. Looking forward to gaining practical experience through internships.',
  skills: ['React', 'Next.js', 'TypeScript', 'Python', 'Node.js', 'Database Design'],
  interests: ['Web Development', 'Machine Learning', 'UI/UX Design', 'Open Source'],
  resume: null,
  portfolio: 'https://priyasharma.dev',
  linkedin: 'https://linkedin.com/in/priya-sharma-eng',
  github: 'https://github.com/priya-sharma'
};

const mockAchievements = [
  {
    id: '1',
    title: 'Dean\'s List Recognition',
    description: 'Achieved Dean\'s List for academic excellence in Spring 2024',
    date: '2024-05-15',
    type: 'Academic'
  },
  {
    id: '2',
    title: 'Hackathon Winner',
    description: 'First place in National Tech Innovation Hackathon 2024',
    date: '2024-03-20',
    type: 'Competition'
  },
  {
    id: '3',
    title: 'Open Source Contributor',
    description: 'Active contributor to various open source projects on GitHub',
    date: '2024-01-10',
    type: 'Project'
  }
];

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [profile, setProfile] = useState(mockProfile);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<ProfileUpdateData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: profile.name,
      phone: profile.phone,
      address: profile.address,
      bio: profile.bio,
      college: profile.college,
      program: profile.program,
      portfolio: profile.portfolio,
      linkedin: profile.linkedin,
      github: profile.github
    }
  });

  const onSubmit = async (data: ProfileUpdateData) => {
    console.log('Profile update:', data);
    // Here you would submit to your API
    setProfile(prev => ({ ...prev, ...data }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Here you would upload the file to your storage service
      console.log('Uploading image:', file);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground mt-2">
            Manage your personal information and preferences.
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSubmit(onSubmit)}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills & Interests</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your basic profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.profileImage} alt={profile.name} />
                    <AvatarFallback className="text-lg">
                      {profile.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <label className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors">
                      <Camera className="h-4 w-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          {...register('name')}
                          className={errors.name ? 'border-destructive' : ''}
                        />
                      ) : (
                        <p className="text-sm font-medium">{profile.name}</p>
                      )}
                      {errors.name && (
                        <p className="text-sm text-destructive">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm">{profile.email}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          {...register('phone')}
                          className={errors.phone ? 'border-destructive' : ''}
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm">{profile.phone}</p>
                        </div>
                      )}
                      {errors.phone && (
                        <p className="text-sm text-destructive">{errors.phone.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      {isEditing ? (
                        <Input
                          id="address"
                          {...register('address')}
                          className={errors.address ? 'border-destructive' : ''}
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm">{profile.address}</p>
                        </div>
                      )}
                      {errors.address && (
                        <p className="text-sm text-destructive">{errors.address.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    {isEditing ? (
                      <Textarea
                        id="bio"
                        placeholder="Tell us about yourself..."
                        rows={4}
                        {...register('bio')}
                        className={errors.bio ? 'border-destructive' : ''}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground">{profile.bio}</p>
                    )}
                    {errors.bio && (
                      <p className="text-sm text-destructive">{errors.bio.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Links Card */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Links</CardTitle>
              <CardDescription>Your online presence and portfolio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="portfolio">Portfolio</Label>
                  {isEditing ? (
                    <Input
                      id="portfolio"
                      placeholder="https://your-portfolio.com"
                      {...register('portfolio')}
                    />
                  ) : (
                    <div>
                      <a
                        href={profile.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {profile.portfolio}
                      </a>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  {isEditing ? (
                    <Input
                      id="linkedin"
                      placeholder="https://linkedin.com/in/username"
                      {...register('linkedin')}
                    />
                  ) : (
                    <div>
                      <a
                        href={profile.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="github">GitHub</Label>
                  {isEditing ? (
                    <Input
                      id="github"
                      placeholder="https://github.com/username"
                      {...register('github')}
                    />
                  ) : (
                    <div>
                      <a
                        href={profile.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        GitHub Profile
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="education" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Education Information</CardTitle>
              <CardDescription>Your academic background and current studies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="college">College/University</Label>
                  {isEditing ? (
                    <Input
                      id="college"
                      {...register('college')}
                      className={errors.college ? 'border-destructive' : ''}
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium">{profile.college}</p>
                    </div>
                  )}
                  {errors.college && (
                    <p className="text-sm text-destructive">{errors.college.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="program">Program</Label>
                  {isEditing ? (
                    <Input
                      id="program"
                      {...register('program')}
                      className={errors.program ? 'border-destructive' : ''}
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium">{profile.program}</p>
                    </div>
                  )}
                  {errors.program && (
                    <p className="text-sm text-destructive">{errors.program.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Current Semester</Label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">{profile.semester}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Role</Label>
                  <Badge variant="outline" className="w-fit">
                    {profile.role.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Technical Skills</CardTitle>
                <CardDescription>Your technical expertise and competencies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Interests</CardTitle>
                <CardDescription>Areas you're passionate about</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest) => (
                    <Badge key={interest} variant="outline">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Achievements & Recognition</CardTitle>
              <CardDescription>Your accomplishments and milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAchievements.map((achievement) => (
                  <div key={achievement.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{achievement.title}</h4>
                      <Badge variant="outline">{achievement.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(achievement.date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}