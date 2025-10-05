import { NextRequest, NextResponse } from 'next/server';
import { DatabaseOperations } from '@/lib/database-operations';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (userId) {
      const result = await DatabaseOperations.getById('users', userId);
      if (result.success) {
        return NextResponse.json({ user: result.data });
      } else {
        return NextResponse.json({ error: result.error }, { status: 404 });
      }
    }
    
    // Return mock users for demo
    const mockUsers = [
      {
        $id: '1',
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: 'student'
      }
    ];
    return NextResponse.json({ users: mockUsers });
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
    const userData = await request.json();
    const result = await DatabaseOperations.create('users', userData);
    
    if (result.success) {
      return NextResponse.json({ user: result.data }, { status: 201 });
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
    const userId = searchParams.get('userId');
    const userData = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }
    
    const result = await DatabaseOperations.update('users', userId, userData);
    
    if (result.success) {
      return NextResponse.json({ user: result.data });
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
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }
    
    const result = await DatabaseOperations.delete('users', userId);
    
    if (result.success) {
      return NextResponse.json({ message: 'User deleted successfully' });
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