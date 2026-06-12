import { NextRequest, NextResponse } from 'next/server';
import { DatabaseOperations } from '@/lib/database-operations';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const entryId = searchParams.get('entryId');
    
    if (entryId) {
      const result = await DatabaseOperations.getById('logbook', entryId);
      if (result.success) {
        return NextResponse.json({ entry: result.data });
      } else {
        return NextResponse.json({ error: result.error }, { status: 404 });
      }
    }
    
    if (userId) {
      // Return mock data for demo
      const mockEntries = [
        {
          $id: '1',
          userId,
          date: new Date().toISOString(),
          activities: 'Worked on React components',
          hours: 8,
          skills: ['React', 'TypeScript'],
          reflection: 'Good progress today'
        }
      ];
      return NextResponse.json({ entries: mockEntries });
    }
    
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
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
    const entryData = await request.json();
    const result = await DatabaseOperations.create('logbook', entryData);
    
    if (result.success) {
      return NextResponse.json({ entry: result.data }, { status: 201 });
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

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entryId = searchParams.get('entryId');
    const entryData = await request.json();
    
    if (!entryId) {
      return NextResponse.json({ error: 'Entry ID required' }, { status: 400 });
    }
    
    const result = await DatabaseOperations.update('logbook', entryId, entryData);
    
    if (result.success) {
      return NextResponse.json({ entry: result.data });
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
    const entryId = searchParams.get('entryId');
    
    if (!entryId) {
      return NextResponse.json({ error: 'Entry ID required' }, { status: 400 });
    }
    
    const result = await DatabaseOperations.delete('logbook', entryId);
    
    if (result.success) {
      return NextResponse.json({ message: 'Entry deleted successfully' });
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