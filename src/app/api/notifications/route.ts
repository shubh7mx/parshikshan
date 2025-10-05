import { NextRequest, NextResponse } from 'next/server';
import { DatabaseOperations } from '@/lib/database-operations';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const notificationId = searchParams.get('notificationId');
    
    if (notificationId) {
      const result = await DatabaseOperations.getById('notifications', notificationId);
      if (result.success) {
        return NextResponse.json({ notification: result.data });
      } else {
        return NextResponse.json({ error: result.error }, { status: 404 });
      }
    }
    
    if (userId) {
      // Return mock notifications for demo
      const mockNotifications = [
        {
          $id: '1',
          title: 'Welcome to Prashiskshan',
          message: 'Start your internship journey today',
          type: 'info',
          read: false,
          createdAt: new Date().toISOString()
        }
      ];
      return NextResponse.json({ notifications: mockNotifications });
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
    const notificationData = await request.json();
    const result = await DatabaseOperations.create('notifications', notificationData);
    
    if (result.success) {
      return NextResponse.json({ notification: result.data }, { status: 201 });
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
    const notificationId = searchParams.get('notificationId');
    const action = searchParams.get('action');
    
    if (!notificationId) {
      return NextResponse.json({ error: 'Notification ID required' }, { status: 400 });
    }
    
    if (action === 'mark-read') {
      const result = await DatabaseOperations.update('notifications', notificationId, { read: true });
      if (result.success) {
        return NextResponse.json({ message: 'Notification marked as read' });
      } else {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
    }
    
    if (action === 'mark-unread') {
      const result = await DatabaseOperations.update('notifications', notificationId, { read: false });
      if (result.success) {
        return NextResponse.json({ message: 'Notification marked as unread' });
      } else {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
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
    const notificationId = searchParams.get('notificationId');
    
    if (!notificationId) {
      return NextResponse.json({ error: 'Notification ID required' }, { status: 400 });
    }
    
    const result = await DatabaseOperations.delete('notifications', notificationId);
    
    if (result.success) {
      return NextResponse.json({ message: 'Notification deleted successfully' });
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