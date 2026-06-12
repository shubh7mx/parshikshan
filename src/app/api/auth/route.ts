import { NextRequest, NextResponse } from 'next/server';
import { loginUser, registerUser, logoutUser, resetPassword, completePasswordReset, getCurrentUser } from '@/lib/auth-actions';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    let result;
    switch (action) {
      case 'login':
        result = await loginUser(data);
        break;
      case 'register':
        result = await registerUser(data);
        break;
      case 'logout':
        result = await logoutUser();
        break;
      case 'resetPassword':
        result = await resetPassword(data.email);
        break;
      case 'completeReset':
        result = await completePasswordReset(data.token, data.newPassword);
        break;
      case 'getCurrentUser':
        result = { success: true, data: await getCurrentUser() };
        break;
      default:
        return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
