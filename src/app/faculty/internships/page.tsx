'use client';

import React, { useState } from 'react';
import { 
  GraduationCap,
  Search,
  Plus,
  Building2,
  Users,
  Calendar,
  MapPin,
  Clock,
  TrendingUp
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const mockInternships = [
  {
    id: '1',
    title: 'Software Engineer Intern',
    company: 'TechCorp Nepal',
    location: 'Kathmandu',
    type: 'Full-time',
    duration: '3 months',
    status: 'active',
    applicants: 12,
    enrolled: 3,
    deadline: '2024-07-15'
  },
  {
    id: '2',
    title: 'Web Developer Intern',
    company: 'Digital Solutions',
    location: 'Pokhara',
    type: 'Part-time',
    duration: '4 months',
    status: 'active',
    applicants: 8,
    enrolled: 2,
    deadline: '2024-07-20'
  }
];

export default function FacultyInternships() {
  const [selectedTab, setSelectedTab] = useState('active');

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Internship Programs</h1>
          <p className="text-muted-foreground mt-2">
            Manage internship opportunities and student placements.
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Internship
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Programs</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockInternships.length}</div>
            <p className="text-xs text-muted-foreground">Active programs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockInternships.reduce((acc, i) => acc + i.applicants, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Applications received</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students Placed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockInternships.reduce((acc, i) => acc + i.enrolled, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Successfully placed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Placement Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75%</div>
            <p className="text-xs text-muted-foreground">Success rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {mockInternships.map((internship) => (
          <Card key={internship.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{internship.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Building2 className="h-4 w-4" />
                      {internship.company}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {internship.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {internship.duration}
                    </div>
                  </div>
                </div>
                <Badge variant="default">Active</Badge>
              </div>
              
              <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Applicants:</span> {internship.applicants}
                </div>
                <div>
                  <span className="font-medium">Enrolled:</span> {internship.enrolled}
                </div>
                <div>
                  <span className="font-medium">Deadline:</span> {new Date(internship.deadline).toLocaleDateString()}
                </div>
              </div>
              
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline">View Applications</Button>
                <Button size="sm" variant="outline">Manage Students</Button>
                <Button size="sm" variant="outline">Edit Program</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}