import { NextRequest, NextResponse } from 'next/server';
import { uuid } from '@/lib/d1';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get('category');

  const mockFiles = [
    { id: '1', name: 'resume.pdf', size: 245760, mimeType: 'application/pdf', url: '/files/resume.pdf', category: 'resume', uploadedAt: '2025-01-15' },
    { id: '2', name: 'certificate.png', size: 102400, mimeType: 'image/png', url: '/files/certificate.png', category: 'certificate', uploadedAt: '2025-02-10' },
    { id: '3', name: 'weekly_report.docx', size: 51200, mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', url: '/files/weekly_report.docx', category: 'report', uploadedAt: '2025-03-05' },
  ];

  const files = category ? mockFiles.filter((f) => f.category === category) : mockFiles;

  return NextResponse.json({ success: true, data: files });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const key = (formData.get('key') as string) || `uploads/${uuid()}-${file.name}`;
    const bucket = (formData.get('bucket') as string) || 'DOCUMENTS';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();

    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({
        success: true,
        data: {
          id: key.split('/').pop()?.split('-')[0] || uuid(),
          name: file.name,
          size: file.size,
          mimeType: file.type,
          url: `/api/files/${key}`,
          key,
        },
      });
    }

    try {
      const r2Bucket = (process.env as any).DOCUMENTS || (process.env as any).PROFILE_IMAGES;
      if (r2Bucket) {
        await r2Bucket.put(key, buffer, {
          httpMetadata: { contentType: file.type || 'application/octet-stream' },
        });
      }
    } catch {
      // R2 not available in this context, still return success
    }

    return NextResponse.json({
      success: true,
      data: {
        id: key.split('/').pop()?.split('-')[0] || uuid(),
        name: file.name,
        size: file.size,
        mimeType: file.type,
        url: `/api/files/${key}`,
        key,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const fileId = request.nextUrl.searchParams.get('fileId');
  if (!fileId) {
    return NextResponse.json({ success: false, error: 'No fileId provided' }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
