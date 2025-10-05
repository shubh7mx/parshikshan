import { NextRequest, NextResponse } from 'next/server';
import { FileOperations } from '@/lib/database-operations';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const category = searchParams.get('category');
    
    // For demo purposes, return mock file data
    const mockFiles = [
      {
        $id: '1',
        fileName: 'resume.pdf',
        category: 'resume',
        size: 2048000,
        uploadedAt: new Date().toISOString()
      },
      {
        $id: '2',
        fileName: 'certificate.pdf',
        category: 'certificate',
        size: 1024000,
        uploadedAt: new Date().toISOString()
      }
    ];
    
    const filteredFiles = category ? 
      mockFiles.filter(f => f.category === category) : 
      mockFiles;
    
    return NextResponse.json({ files: filteredFiles });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    const category = formData.get('category') as string;
    
    if (!file || !userId) {
      return NextResponse.json({ error: 'File and user ID are required' }, { status: 400 });
    }
    
    const result = await FileOperations.uploadFile(file, category);
    
    if (result.success) {
      return NextResponse.json({ file: result.data }, { status: 201 });
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');
    
    if (!fileId) {
      return NextResponse.json({ error: 'File ID required' }, { status: 400 });
    }
    
    const result = await FileOperations.deleteFile(fileId);
    
    if (result.success) {
      return NextResponse.json({ message: 'File deleted successfully' });
    } else {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}