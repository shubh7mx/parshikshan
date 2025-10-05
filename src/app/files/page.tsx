'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  FolderOpen,
  Upload,
  Search,
  Filter,
  Grid3X3,
  List,
  FileText,
  Image,
  Video,
  Archive,
  Download,
  Trash2,
  Eye,
  Share,
  Star,
  Clock,
  User
} from 'lucide-react';
import { FileUpload } from '@/components/files/file-upload';

interface FileItem {
  $id: string;
  name: string;
  size: number;
  type: string;
  category: 'resume' | 'certificate' | 'report' | 'document' | 'image' | 'other';
  uploadedAt: string;
  url: string;
  starred: boolean;
  shared: boolean;
}

// Mock data for demonstration
const mockFiles: FileItem[] = [
  {
    $id: '1',
    name: 'Resume_2024.pdf',
    size: 2048000,
    type: 'application/pdf',
    category: 'resume',
    uploadedAt: '2024-01-15T10:30:00Z',
    url: '/mock-url',
    starred: true,
    shared: false
  },
  {
    $id: '2',
    name: 'Python_Certificate.pdf',
    size: 1536000,
    type: 'application/pdf',
    category: 'certificate',
    uploadedAt: '2024-01-10T14:20:00Z',
    url: '/mock-url',
    starred: false,
    shared: true
  },
  {
    $id: '3',
    name: 'Weekly_Report_Week1.docx',
    size: 512000,
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    category: 'report',
    uploadedAt: '2024-01-08T09:15:00Z',
    url: '/mock-url',
    starred: false,
    shared: false
  },
  {
    $id: '4',
    name: 'Project_Screenshot.png',
    size: 3072000,
    type: 'image/png',
    category: 'image',
    uploadedAt: '2024-01-05T16:45:00Z',
    url: '/mock-url',
    starred: true,
    shared: false
  }
];

export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>(mockFiles);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getFileIcon = (type: string, size: 'sm' | 'lg' = 'sm') => {
    const iconSize = size === 'lg' ? 'h-8 w-8' : 'h-5 w-5';
    
    if (type.startsWith('image/')) return <Image className={iconSize} />;
    if (type.startsWith('video/')) return <Video className={iconSize} />;
    if (type === 'application/pdf') return <FileText className={iconSize} />;
    if (type.includes('word') || type.includes('document')) return <FileText className={iconSize} />;
    if (type.includes('zip') || type.includes('archive')) return <Archive className={iconSize} />;
    return <FileText className={iconSize} />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'resume': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'certificate': return 'bg-green-100 text-green-800 border-green-200';
      case 'report': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'image': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'document': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const FileCard = ({ file }: { file: FileItem }) => (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {getFileIcon(file.type, 'lg')}
            <div className="min-w-0 flex-1">
              <h4 className="font-medium truncate">{file.name}</h4>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(file.size)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            {file.starred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
            {file.shared && <Share className="h-4 w-4 text-blue-500" />}
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <Badge className={getCategoryColor(file.category)} variant="outline">
            {file.category}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {new Date(file.uploadedAt).toLocaleDateString()}
          </span>
        </div>
        
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="outline"  className="flex-1">
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
          <Button variant="outline"  className="flex-1">
            <Download className="h-3 w-3 mr-1" />
            Download
          </Button>
          <Button variant="outline" >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const FileRow = ({ file }: { file: FileItem }) => (
    <div className="flex items-center gap-4 p-4 border-b hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {getFileIcon(file.type)}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium truncate">{file.name}</h4>
            {file.starred && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
            {file.shared && <Share className="h-3 w-3 text-blue-500" />}
          </div>
          <p className="text-sm text-muted-foreground">
            {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      
      <Badge className={getCategoryColor(file.category)} variant="outline">
        {file.category}
      </Badge>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" >
          <Eye className="h-3 w-3" />
        </Button>
        <Button variant="ghost" >
          <Download className="h-3 w-3" />
        </Button>
        <Button variant="ghost" >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">File Management</h1>
          <p className="text-muted-foreground">
            Upload, organize, and manage your documents and files
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FolderOpen className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{files.length}</p>
                <p className="text-sm text-muted-foreground">Total Files</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Upload className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {files.filter(f => {
                    const uploadDate = new Date(f.uploadedAt);
                    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                    return uploadDate > weekAgo;
                  }).length}
                </p>
                <p className="text-sm text-muted-foreground">This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{files.filter(f => f.starred).length}</p>
                <p className="text-sm text-muted-foreground">Starred</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Share className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{files.filter(f => f.shared).length}</p>
                <p className="text-sm text-muted-foreground">Shared</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="browse" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse">Browse Files</TabsTrigger>
          <TabsTrigger value="upload">Upload Files</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    
                    onClick={() => setSelectedCategory('all')}
                  >
                    All
                  </Button>
                  {['resume', 'certificate', 'report', 'document', 'image'].map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'outline'}
                      
                      onClick={() => setSelectedCategory(category)}
                      className="capitalize"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* File Display */}
          <Card>
            <CardHeader>
              <CardTitle>Files ({filteredFiles.length})</CardTitle>
              <CardDescription>
                {searchQuery && `Results for "${searchQuery}"`}
                {selectedCategory !== 'all' && ` in ${selectedCategory} category`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredFiles.length === 0 ? (
                <div className="text-center py-8">
                  <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No files found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery || selectedCategory !== 'all' 
                      ? 'Try adjusting your search or filters'
                      : 'Upload some files to get started'
                    }
                  </p>
                </div>
              ) : (
                <div className={
                  viewMode === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
                    : 'space-y-0'
                }>
                  {filteredFiles.map((file) => (
                    viewMode === 'grid' 
                      ? <FileCard key={file.$id} file={file} />
                      : <FileRow key={file.$id} file={file} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload">
          <FileUpload
            onUploadComplete={(uploadedFiles) => {
              console.log('Files uploaded:', uploadedFiles);
              // Add to files list
              // setFiles(prev => [...prev, ...uploadedFiles]);
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}