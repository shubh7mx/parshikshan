'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  File, 
  FileText, 
  Image, 
  Video, 
  Archive, 
  X, 
  Download,
  Eye,
  Trash2,
  CheckCircle,
  AlertCircle,
  Plus,
  FileDown
} from 'lucide-react';
import { FileOperations } from '@/lib/database-operations';
import { useDropzone } from 'react-dropzone';

interface UploadedFile {
  $id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploadedAt: string;
  category: 'resume' | 'certificate' | 'report' | 'document' | 'image' | 'other';
  status: 'uploading' | 'completed' | 'error';
  progress?: number;
}

interface FileUploadProps {
  category?: 'resume' | 'certificate' | 'report' | 'document' | 'image' | 'other';
  multiple?: boolean;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  onUploadComplete?: (files: UploadedFile[]) => void;
  existingFiles?: UploadedFile[];
}

export function FileUpload({
  category = 'document',
  multiple = true,
  maxSize = 10,
  acceptedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'],
  onUploadComplete,
  existingFiles = []
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>(existingFiles);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      $id: `temp-${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      url: '',
      uploadedAt: new Date().toISOString(),
      category,
      status: 'uploading',
      progress: 0
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Upload files
    for (let i = 0; i < acceptedFiles.length; i++) {
      const file = acceptedFiles[i];
      const tempFile = newFiles[i];
      
      try {
        // Simulate progress updates
        for (let progress = 0; progress <= 90; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setFiles(prev => prev.map(f => 
            f.$id === tempFile.$id ? { ...f, progress } : f
          ));
        }

        // Upload file
        const result = await FileOperations.uploadFile(file);
        
        if (result.success && result.data) {
          setFiles(prev => prev.map(f => 
            f.$id === tempFile.$id ? {
              ...f,
              $id: result.data!.fileId,
              url: result.data!.url,
              status: 'completed',
              progress: 100
            } : f
          ));
        } else {
          setFiles(prev => prev.map(f => 
            f.$id === tempFile.$id ? { ...f, status: 'error' } : f
          ));
        }
      } catch (error) {
        console.error('Upload error:', error);
        setFiles(prev => prev.map(f => 
          f.$id === tempFile.$id ? { ...f, status: 'error' } : f
        ));
      }
    }

    setUploading(false);
    
    const completedFiles = files.filter(f => f.status === 'completed');
    onUploadComplete?.(completedFiles);
  }, [category, files, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    maxSize: maxSize * 1024 * 1024,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
      'text/*': ['.txt'],
    }
  });

  const removeFile = async (fileId: string) => {
    try {
      const fileToRemove = files.find(f => f.$id === fileId);
      if (fileToRemove && fileToRemove.status === 'completed') {
        await FileOperations.deleteFile(fileId);
      }
      setFiles(prev => prev.filter(f => f.$id !== fileId));
    } catch (error) {
      console.error('Error removing file:', error);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-5 w-5" />;
    if (type.startsWith('video/')) return <Video className="h-5 w-5" />;
    if (type === 'application/pdf') return <FileText className="h-5 w-5" />;
    if (type.includes('word') || type.includes('document')) return <FileText className="h-5 w-5" />;
    if (type.includes('zip') || type.includes('archive')) return <Archive className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'resume': return 'bg-blue-100 text-blue-800';
      case 'certificate': return 'bg-green-100 text-green-800';
      case 'report': return 'bg-purple-100 text-purple-800';
      case 'image': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Document Upload
          </CardTitle>
          <CardDescription>
            Upload your documents, certificates, reports, and other files
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'}
            `}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            
            {isDragActive ? (
              <p className="text-primary font-medium">Drop files here...</p>
            ) : (
              <div>
                <p className="font-medium mb-2">
                  Drag & drop files here, or click to select
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports {acceptedTypes.join(', ')} up to {maxSize}MB each
                </p>
              </div>
            )}
            
            {!isDragActive && (
              <Button className="mt-4" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Select Files
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files ({files.length})</CardTitle>
            <CardDescription>
              Manage your uploaded documents and files
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {files.map((file) => (
                <div key={file.$id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">
                    {getFileIcon(file.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium truncate">{file.name}</p>
                      <Badge className={getCategoryColor(file.category)} >
                        {file.category}
                      </Badge>
                      {file.status === 'completed' && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {file.status === 'error' && (
                        <AlertCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{formatFileSize(file.size)}</span>
                      <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                    </div>
                    
                    {file.status === 'uploading' && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>Uploading...</span>
                          <span>{file.progress || 0}%</span>
                        </div>
                        <Progress value={file.progress || 0} className="h-1" />
                      </div>
                    )}
                    
                    {file.status === 'error' && (
                      <Alert className="mt-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Failed to upload file. Please try again.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {file.status === 'completed' && (
                      <>
                        <Button variant="outline" >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </>
                    )}
                    
                    <Button
                      variant="outline"
                      
                      onClick={() => removeFile(file.$id)}
                      disabled={file.status === 'uploading'}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {uploading && (
              <Alert className="mt-4">
                <Upload className="h-4 w-4" />
                <AlertDescription>
                  Uploading files... Please wait.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* File Categories */}
      <Card>
        <CardHeader>
          <CardTitle>File Categories</CardTitle>
          <CardDescription>
            Organize your documents by category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { key: 'resume', label: 'Resumes', count: files.filter(f => f.category === 'resume').length },
              { key: 'certificate', label: 'Certificates', count: files.filter(f => f.category === 'certificate').length },
              { key: 'report', label: 'Reports', count: files.filter(f => f.category === 'report').length },
              { key: 'document', label: 'Documents', count: files.filter(f => f.category === 'document').length },
              { key: 'other', label: 'Other', count: files.filter(f => f.category === 'other').length }
            ].map((cat) => (
              <div key={cat.key} className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold mb-1">{cat.count}</div>
                <div className="text-sm text-muted-foreground">{cat.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}