'use client';

import React, { useState } from 'react';
import { 
  Search,
  Filter,
  MapPin,
  Clock,
  Building2,
  Users,
  Calendar,
  Star,
  Bookmark,
  BookmarkCheck,
  Eye,
  Send,
  TrendingUp,
  GraduationCap,
  Heart,
  Briefcase,
  DollarSign
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

// Mock data - In real app, this would come from API
const mockInternships = [
  {
    id: '1',
    title: 'Software Engineer Intern',
    company: 'TechCorp Nepal',
    location: 'Kathmandu',
    type: 'Full-time',
    duration: '3 months',
    salary: 'NPR 25,000/month',
    posted: '2024-06-15',
    deadline: '2024-07-15',
    description: 'Join our dynamic team to work on cutting-edge web applications using React, Node.js, and cloud technologies.',
    requirements: [
      'Currently pursuing Bachelor\'s in Computer Science or related field',
      'Knowledge of JavaScript, React, and Node.js',
      'Understanding of database concepts',
      'Good communication skills'
    ],
    responsibilities: [
      'Develop and maintain web applications',
      'Write clean, maintainable code',
      'Collaborate with senior developers',
      'Participate in code reviews'
    ],
    benefits: [
      'Mentorship from senior developers',
      'Flexible working hours',
      'Learning and development opportunities',
      'Certificate of completion'
    ],
    skills: ['React', 'Node.js', 'JavaScript', 'MongoDB'],
    applicants: 45,
    openings: 3,
    rating: 4.5,
    saved: false,
    applied: false,
    featured: true
  },
  {
    id: '2',
    title: 'UI/UX Design Intern',
    company: 'Creative Studio',
    location: 'Pokhara',
    type: 'Part-time',
    duration: '4 months',
    salary: 'NPR 15,000/month',
    posted: '2024-06-18',
    deadline: '2024-07-20',
    description: 'Work with our design team to create beautiful and intuitive user interfaces for mobile and web applications.',
    requirements: [
      'Currently pursuing degree in Design, HCI, or related field',
      'Proficiency in Figma, Adobe Creative Suite',
      'Understanding of design principles',
      'Portfolio showcasing design work'
    ],
    responsibilities: [
      'Create wireframes and prototypes',
      'Design user interfaces',
      'Conduct user research',
      'Collaborate with development team'
    ],
    benefits: [
      'Access to design tools and software',
      'Portfolio building opportunities',
      'Design workshops and training',
      'Networking with design professionals'
    ],
    skills: ['Figma', 'Adobe XD', 'Photoshop', 'UI Design'],
    applicants: 28,
    openings: 2,
    rating: 4.2,
    saved: true,
    applied: false,
    featured: false
  },
  {
    id: '3',
    title: 'Data Science Intern',
    company: 'Analytics Hub',
    location: 'Lalitpur',
    type: 'Full-time',
    duration: '6 months',
    salary: 'NPR 30,000/month',
    posted: '2024-06-20',
    deadline: '2024-07-25',
    description: 'Dive into the world of data science and machine learning with real-world projects and datasets.',
    requirements: [
      'Strong background in Mathematics/Statistics',
      'Knowledge of Python, R, or similar',
      'Understanding of machine learning concepts',
      'Experience with data visualization tools'
    ],
    responsibilities: [
      'Analyze large datasets',
      'Build predictive models',
      'Create data visualizations',
      'Present findings to stakeholders'
    ],
    benefits: [
      'Access to premium datasets',
      'Machine learning mentorship',
      'Conference attendance opportunities',
      'Research publication opportunities'
    ],
    skills: ['Python', 'R', 'Machine Learning', 'SQL'],
    applicants: 32,
    openings: 1,
    rating: 4.7,
    saved: false,
    applied: true,
    featured: true
  },
  {
    id: '4',
    title: 'Digital Marketing Intern',
    company: 'Growth Agency',
    location: 'Kathmandu',
    type: 'Remote',
    duration: '3 months',
    salary: 'NPR 18,000/month',
    posted: '2024-06-22',
    deadline: '2024-08-01',
    description: 'Learn digital marketing strategies including SEO, social media marketing, and content creation.',
    requirements: [
      'Interest in digital marketing',
      'Basic understanding of social media',
      'Good writing skills',
      'Creative mindset'
    ],
    responsibilities: [
      'Create social media content',
      'Assist with SEO optimization',
      'Analyze marketing metrics',
      'Support email campaigns'
    ],
    benefits: [
      'Digital marketing certification',
      'Portfolio building',
      'Industry networking',
      'Performance-based bonuses'
    ],
    skills: ['Social Media', 'Content Writing', 'SEO', 'Analytics'],
    applicants: 67,
    openings: 4,
    rating: 4.0,
    saved: false,
    applied: false,
    featured: false
  }
];

const filterOptions = {
  location: ['Kathmandu', 'Pokhara', 'Lalitpur', 'Bhaktapur', 'Remote'],
  type: ['Full-time', 'Part-time', 'Remote'],
  duration: ['1-3 months', '3-6 months', '6+ months'],
  field: ['Technology', 'Design', 'Marketing', 'Finance', 'Operations']
};

export default function InternshipsPage() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [savedInternships, setSavedInternships] = useState<Set<string>>(new Set(['2']));
  const [appliedInternships, setAppliedInternships] = useState<Set<string>>(new Set(['3']));
  const [selectedInternship, setSelectedInternship] = useState<any>(null);
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);

  const filteredInternships = mockInternships.filter(internship => {
    const matchesSearch = internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLocation = locationFilter === 'all' || internship.location === locationFilter;
    const matchesType = typeFilter === 'all' || internship.type === typeFilter;
    
    const matchesTab = selectedTab === 'all' || 
                      (selectedTab === 'saved' && savedInternships.has(internship.id)) ||
                      (selectedTab === 'applied' && appliedInternships.has(internship.id)) ||
                      (selectedTab === 'featured' && internship.featured);
    
    return matchesSearch && matchesLocation && matchesType && matchesTab;
  });

  const toggleSave = (internshipId: string) => {
    setSavedInternships(prev => {
      const newSet = new Set(prev);
      if (newSet.has(internshipId)) {
        newSet.delete(internshipId);
      } else {
        newSet.add(internshipId);
      }
      return newSet;
    });
  };

  const handleApply = (internship: any) => {
    setSelectedInternship(internship);
    setIsApplicationDialogOpen(true);
  };

  const submitApplication = () => {
    if (selectedInternship) {
      setAppliedInternships(prev => new Set([...prev, selectedInternship.id]));
      setIsApplicationDialogOpen(false);
      setSelectedInternship(null);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Full-time':
        return 'bg-green-100 text-green-800';
      case 'Part-time':
        return 'bg-blue-100 text-blue-800';
      case 'Remote':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6 lg:space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Internship Opportunities</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Discover and apply for exciting internship positions.
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Opportunities</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockInternships.length}</div>
            <p className="text-xs text-muted-foreground">Available positions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applied</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appliedInternships.size}</div>
            <p className="text-xs text-muted-foreground">Applications sent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{savedInternships.size}</div>
            <p className="text-xs text-muted-foreground">Bookmarked positions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockInternships.filter(i => i.featured).length}
            </div>
            <p className="text-xs text-muted-foreground">Featured opportunities</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search internships, companies, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {filterOptions.location.map(location => (
                <SelectItem key={location} value={location}>{location}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {filterOptions.type.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="all">All ({mockInternships.length})</TabsTrigger>
          <TabsTrigger value="featured">Featured ({mockInternships.filter(i => i.featured).length})</TabsTrigger>
          <TabsTrigger value="saved">Saved ({savedInternships.size})</TabsTrigger>
          <TabsTrigger value="applied">Applied ({appliedInternships.size})</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-6 mt-6">
          {filteredInternships.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No internships found</h3>
                <p className="text-muted-foreground text-center">
                  {searchTerm || locationFilter !== 'all' || typeFilter !== 'all' 
                    ? 'Try adjusting your search criteria or filters.' 
                    : 'Check back later for new opportunities.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {filteredInternships.map((internship) => (
                <Card key={internship.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-2 mb-2">
                          <h3 className="text-lg sm:text-xl font-semibold">{internship.title}</h3>
                          {internship.featured && (
                            <Badge className="bg-yellow-100 text-yellow-800">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            {internship.company}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {internship.location}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSave(internship.id)}
                        className="ml-2"
                      >
                        {savedInternships.has(internship.id) ? (
                          <BookmarkCheck className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Bookmark className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {internship.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className={getTypeColor(internship.type)}>
                        {internship.type}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {internship.duration}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {internship.salary}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {internship.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {internship.skills.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{internship.skills.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {internship.applicants} applicants
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Deadline: {new Date(internship.deadline).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">View Details</span>
                            <span className="sm:hidden">Details</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-xl">{internship.title}</DialogTitle>
                            <DialogDescription className="text-base">
                              {internship.company} • {internship.location} • {internship.type}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div>
                              <h4 className="font-semibold mb-2">Description</h4>
                              <p className="text-sm text-muted-foreground">{internship.description}</p>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold mb-2">Requirements</h4>
                              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                {internship.requirements.map((req, index) => (
                                  <li key={index}>{req}</li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-2">Responsibilities</h4>
                              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                {internship.responsibilities.map((resp, index) => (
                                  <li key={index}>{resp}</li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-2">Benefits</h4>
                              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                {internship.benefits.map((benefit, index) => (
                                  <li key={index}>{benefit}</li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h4 className="font-semibold mb-2">Required Skills</h4>
                              <div className="flex flex-wrap gap-2">
                                {internship.skills.map((skill) => (
                                  <Badge key={skill} variant="secondary">{skill}</Badge>
                                ))}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <strong>Salary:</strong> {internship.salary}
                              </div>
                              <div>
                                <strong>Duration:</strong> {internship.duration}
                              </div>
                              <div>
                                <strong>Openings:</strong> {internship.openings}
                              </div>
                              <div>
                                <strong>Deadline:</strong> {new Date(internship.deadline).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {appliedInternships.has(internship.id) ? (
                        <Button disabled size="sm" className="flex-1">
                          <Send className="h-4 w-4 mr-2" />
                          Applied
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleApply(internship)}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Apply Now
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Application Dialog */}
      <Dialog open={isApplicationDialogOpen} onOpenChange={setIsApplicationDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Apply for Internship</DialogTitle>
            <DialogDescription>
              {selectedInternship && `${selectedInternship.title} at ${selectedInternship.company}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="coverLetter">Cover Letter</Label>
              <Textarea
                id="coverLetter"
                placeholder="Write a brief cover letter explaining why you're interested in this internship..."
                rows={4}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Your profile information and resume will be automatically included with this application.
            </div>
            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsApplicationDialogOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={submitApplication}
                className="flex-1"
              >
                Submit Application
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}