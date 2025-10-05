'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  BookOpen, 
  Plus, 
  Calendar, 
  Clock, 
  FileText, 
  Download,
  Filter,
  Search
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { logbookEntrySchema, type LogbookEntryData } from '@/lib/validations';

// Mock data - In real app, this would come from API
const mockLogbookEntries = [
  {
    id: '1',
    date: '2024-06-19',
    hoursWorked: 8,
    tasksCompleted: 'Implemented user authentication module using Next.js and Appwrite. Created login and registration forms with proper validation.',
    learningOutcomes: 'Learned about JWT tokens, session management, and form validation best practices in React applications.',
    challenges: 'Initial difficulty with Appwrite SDK configuration, resolved by reading documentation thoroughly.',
    mentorFeedback: 'Excellent progress! Code quality is improving. Focus on error handling in next iteration.',
    isVerified: true,
    verifiedBy: 'John Smith'
  },
  {
    id: '2',
    date: '2024-06-18',
    hoursWorked: 7.5,
    tasksCompleted: 'Designed and developed the dashboard UI components. Integrated charts and statistics display using Recharts library.',
    learningOutcomes: 'Understanding of data visualization principles and responsive design implementation.',
    challenges: 'Chart responsiveness on mobile devices required additional CSS media queries.',
    mentorFeedback: null,
    isVerified: false,
    verifiedBy: null
  },
  {
    id: '3',
    date: '2024-06-17',
    hoursWorked: 8,
    tasksCompleted: 'Set up project structure, installed dependencies, and configured development environment.',
    learningOutcomes: 'Project setup best practices, dependency management, and development workflow optimization.',
    challenges: 'Version compatibility issues with some packages, resolved by checking documentation.',
    mentorFeedback: 'Good start! Make sure to document your setup process for future reference.',
    isVerified: true,
    verifiedBy: 'John Smith'
  }
];

export default function StudentLogbook() {
  const [isAddingEntry, setIsAddingEntry] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LogbookEntryData>({
    resolver: zodResolver(logbookEntrySchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit = async (data: LogbookEntryData) => {
    console.log('Logbook entry:', data);
    // Here you would submit to your API
    setIsAddingEntry(false);
    reset();
  };

  const totalHours = mockLogbookEntries.reduce((sum, entry) => sum + entry.hoursWorked, 0);
  const verifiedEntries = mockLogbookEntries.filter(entry => entry.isVerified).length;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Internship Logbook</h1>
          <p className="text-muted-foreground mt-2">
            Track your daily activities and learning progress.
          </p>
        </div>
        <Dialog open={isAddingEntry} onOpenChange={setIsAddingEntry}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Logbook Entry</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    {...register('date')}
                    className={errors.date ? 'border-destructive' : ''}
                  />
                  {errors.date && (
                    <p className="text-sm text-destructive">{errors.date.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hoursWorked">Hours Worked</Label>
                  <Input
                    id="hoursWorked"
                    type="number"
                    step="0.5"
                    placeholder="8"
                    {...register('hoursWorked', { valueAsNumber: true })}
                    className={errors.hoursWorked ? 'border-destructive' : ''}
                  />
                  {errors.hoursWorked && (
                    <p className="text-sm text-destructive">{errors.hoursWorked.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tasksCompleted">Tasks Completed</Label>
                <Textarea
                  id="tasksCompleted"
                  placeholder="Describe the tasks you completed today..."
                  rows={4}
                  {...register('tasksCompleted')}
                  className={errors.tasksCompleted ? 'border-destructive' : ''}
                />
                {errors.tasksCompleted && (
                  <p className="text-sm text-destructive">{errors.tasksCompleted.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="learningOutcomes">Learning Outcomes</Label>
                <Textarea
                  id="learningOutcomes"
                  placeholder="What did you learn today?"
                  rows={3}
                  {...register('learningOutcomes')}
                  className={errors.learningOutcomes ? 'border-destructive' : ''}
                />
                {errors.learningOutcomes && (
                  <p className="text-sm text-destructive">{errors.learningOutcomes.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="challenges">Challenges (Optional)</Label>
                <Textarea
                  id="challenges"
                  placeholder="Any challenges or difficulties faced?"
                  rows={2}
                  {...register('challenges')}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAddingEntry(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Add Entry
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockLogbookEntries.length}</div>
            <p className="text-xs text-muted-foreground">This internship</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours}</div>
            <p className="text-xs text-muted-foreground">Hours logged</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Entries</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{verifiedEntries}</div>
            <p className="text-xs text-muted-foreground">Out of {mockLogbookEntries.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Logbook Entries */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Logbook Entries</CardTitle>
              <CardDescription>Your daily activity log and progress tracker</CardDescription>
            </div>
            <Button variant="outline" >
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockLogbookEntries.map((entry) => (
              <div key={entry.id} className="border rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{new Date(entry.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{entry.hoursWorked} hours</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {entry.isVerified ? (
                      <Badge variant="default">Verified</Badge>
                    ) : (
                      <Badge variant="outline">Pending</Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Tasks Completed</h4>
                    <p className="text-sm text-muted-foreground">{entry.tasksCompleted}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2">Learning Outcomes</h4>
                    <p className="text-sm text-muted-foreground">{entry.learningOutcomes}</p>
                  </div>

                  {entry.challenges && (
                    <div>
                      <h4 className="font-medium text-sm mb-2">Challenges</h4>
                      <p className="text-sm text-muted-foreground">{entry.challenges}</p>
                    </div>
                  )}

                  {entry.mentorFeedback && (
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <h4 className="font-medium text-sm mb-2">Mentor Feedback</h4>
                      <p className="text-sm text-muted-foreground">{entry.mentorFeedback}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        — {entry.verifiedBy}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}