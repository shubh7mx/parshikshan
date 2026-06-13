import { NextRequest, NextResponse } from 'next/server';
import { createToken, verifyToken } from '@/lib/jwt';
import { hashPassword, verifyPassword } from '@/lib/password';

export const runtime = 'edge';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

async function createDemoToken() {
  return createToken({ userId: 'demo-user-student', email: 'demo@student.com', role: 'student' });
}

// Hardcoded demo credentials for functional demo
const DEMO_USERS = [
  {
    email: 'demo@student.com',
    passwordHash: '', // set lazily
    user: { id: 'demo-user-student', name: 'Demo Student', email: 'demo@student.com', role: 'student' as const, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  },
  {
    email: 'faculty@demo.com',
    passwordHash: '',
    user: { id: 'demo-user-faculty', name: 'Demo Faculty', email: 'faculty@demo.com', role: 'faculty' as const, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  },
  {
    email: 'company@demo.com',
    passwordHash: '',
    user: { id: 'demo-user-company', name: 'Demo Company Rep', email: 'company@demo.com', role: 'industry_partner' as const, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  },
  {
    email: 'admin@demo.com',
    passwordHash: '',
    user: { id: 'demo-user-admin', name: 'Demo Admin', email: 'admin@demo.com', role: 'admin' as const, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }
  },
];

async function initDemoPasswords() {
  if (DEMO_USERS[0].passwordHash) return;
  for (const u of DEMO_USERS) {
    u.passwordHash = await hashPassword('demo123');
  }
}

export async function POST(request: NextRequest) {
  await initDemoPasswords();

  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'login': {
        const { email, password } = data;
        const demoUser = DEMO_USERS.find(u => u.email === email);
        if (!demoUser) {
          return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
        }
        const valid = await verifyPassword(password, demoUser.passwordHash);
        if (!valid) {
          return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
        }
        const token = await createToken({ userId: demoUser.user.id, email: demoUser.user.email, role: demoUser.user.role });
        const res = NextResponse.json({ success: true, data: demoUser.user });
        res.cookies.set('auth_token', token, { httpOnly: true, sameSite: 'lax', maxAge: 86400, path: '/' });
        return res;
      }

      case 'register': {
        const { email, password, name, role } = data;
        const exists = DEMO_USERS.find(u => u.email === email);
        if (exists) {
          return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 409 });
        }
        const actualRole = role === 'company' ? 'industry_partner' : role;
        const id = `user-${Date.now()}`;
        const passwordHash = await hashPassword(password);
        const newUser = { id, name, email, role: actualRole, is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
        DEMO_USERS.push({ email, passwordHash, user: newUser });

        const token = await createToken({ userId: id, email, role: actualRole });
        const res = NextResponse.json({ success: true, data: newUser });
        res.cookies.set('auth_token', token, { httpOnly: true, sameSite: 'lax', maxAge: 86400, path: '/' });
        return res;
      }

      case 'logout': {
        const res = NextResponse.json({ success: true });
        res.cookies.delete('auth_token');
        return res;
      }

      case 'resetPassword':
        return NextResponse.json({ success: true, message: 'Password reset link sent to your email' });

      case 'completeReset':
        return NextResponse.json({ success: true });

      case 'getCurrentUser': {
        const token = request.cookies.get('auth_token')?.value;
        if (!token) return NextResponse.json({ success: true, data: null });
        const payload = await verifyToken(token);
        if (!payload) return NextResponse.json({ success: true, data: null });
        const found = DEMO_USERS.find(u => u.user.id === payload.userId);
        return NextResponse.json({ success: true, data: found?.user || null });
      }

      case 'demoLogin': {
        const demoToken = await createDemoToken();
        if (demoToken) {
          const res = NextResponse.json({ success: true, data: DEMO_USERS[0].user });
          res.cookies.set('auth_token', demoToken, { httpOnly: true, sameSite: 'lax', maxAge: 86400, path: '/' });
          return res;
        }
        return NextResponse.json({ success: false, error: 'Demo login failed' }, { status: 500 });
      }

      default:
        return NextResponse.json({ success: false, error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Auth API error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
