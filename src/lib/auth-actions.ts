'use server';

import { createToken, verifyToken, setAuthCookie, clearAuthCookie, getTokenFromCookie } from './jwt';
import { hashPassword, verifyPassword } from './password';
import { dbOperations, userService } from './database';
import { getDB, uuid } from './d1';
import { redirect } from 'next/navigation';
import type { User, UserRole, LoginCredentials, RegisterData, ApiResponse } from '@/types';

export async function getCurrentUser(): Promise<User | null> {
  try {
    const token = await getTokenFromCookie();
    if (!token) return null;

    const payload = await verifyToken(token);
    if (!payload) return null;

    const db = getDB();
    const user = await db
      .prepare('SELECT * FROM users WHERE id = ?')
      .bind(payload.userId)
      .first<User>();

    return user || null;
  } catch {
    return null;
  }
}

export async function hasRole(requiredRoles: UserRole[]): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  return requiredRoles.includes(user.role);
}

export async function loginUser(credentials: LoginCredentials): Promise<ApiResponse<User>> {
  try {
    const db = getDB();
    const user = await db
      .prepare('SELECT * FROM users WHERE email = ?')
      .bind(credentials.email)
      .first<User & { password_hash: string }>();

    if (!user) {
      return { success: false, error: 'Invalid email or password', code: 401 };
    }

    const valid = await verifyPassword(credentials.password, (user as any).password_hash);
    if (!valid) {
      return { success: false, error: 'Invalid email or password', code: 401 };
    }

    const token = await createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    await setAuthCookie(token);

    const { password_hash, ...safeUser } = user as User & { password_hash: string };
    return { success: true, data: safeUser };
  } catch (error) {
    return { success: false, error: 'Login failed', code: 500 };
  }
}

export async function registerUser(data: RegisterData): Promise<ApiResponse<User>> {
  try {
    const db = getDB();

    const existing = await db
      .prepare('SELECT id FROM users WHERE email = ?')
      .bind(data.email)
      .first();

    if (existing) {
      return { success: false, error: 'Email already registered', code: 409 };
    }

    const id = uuid();
    const passwordHash = await hashPassword(data.password);

    await db
      .prepare(
        'INSERT INTO users (id, name, email, phone, role, is_active, password_hash) VALUES (?, ?, ?, ?, ?, 1, ?)'
      )
      .bind(id, data.name, data.email, data.phone || null, data.role, passwordHash)
      .run();

    const user = await db
      .prepare('SELECT * FROM users WHERE id = ?')
      .bind(id)
      .first<User>();

    if (!user) {
      return { success: false, error: 'Registration failed', code: 500 };
    }

    const token = await createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });
    await setAuthCookie(token);

    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: 'Registration failed', code: 500 };
  }
}

export async function logoutUser(): Promise<ApiResponse<void>> {
  try {
    await clearAuthCookie();
    return { success: true };
  } catch {
    return { success: false, error: 'Logout failed', code: 500 };
  }
}

export async function resetPassword(email: string): Promise<ApiResponse<void>> {
  try {
    const db = getDB();
    const user = await db
      .prepare('SELECT id FROM users WHERE email = ?')
      .bind(email)
      .first<{ id: string }>();

    if (!user) {
      return { success: false, error: 'No account found with this email', code: 404 };
    }

    const token = uuid();
    const expiresAt = new Date(Date.now() + 3600000).toISOString(); // 1 hour

    await db
      .prepare('INSERT INTO password_resets (id, user_id, token, expires_at) VALUES (?, ?, ?, ?)')
      .bind(uuid(), user.id, token, expiresAt)
      .run();

    return { success: true, message: 'Password reset link sent to your email' };
  } catch {
    return { success: false, error: 'Failed to send reset email', code: 500 };
  }
}

export async function completePasswordReset(
  resetToken: string,
  newPassword: string
): Promise<ApiResponse<void>> {
  try {
    const db = getDB();

    const reset = await db
      .prepare('SELECT * FROM password_resets WHERE token = ? AND used = 0 AND expires_at > datetime(\'now\')')
      .bind(resetToken)
      .first<{ user_id: string; id: string }>();

    if (!reset) {
      return { success: false, error: 'Invalid or expired reset token', code: 400 };
    }

    const passwordHash = await hashPassword(newPassword);

    await db
      .prepare('UPDATE users SET password_hash = ?, updated_at = datetime(\'now\') WHERE id = ?')
      .bind(passwordHash, reset.user_id)
      .run();

    await db
      .prepare('UPDATE password_resets SET used = 1 WHERE id = ?')
      .bind(reset.id)
      .run();

    return { success: true };
  } catch {
    return { success: false, error: 'Password reset failed', code: 500 };
  }
}

export async function withAuthCheck(requiredRoles?: UserRole[]): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  if (requiredRoles && !requiredRoles.includes(user.role)) {
    throw new Error('Insufficient permissions');
  }

  return user;
}

export async function checkAuth(requiredRoles?: UserRole[]) {
  const user = await getCurrentUser();

  if (!user) {
    return { authenticated: false, user: null };
  }

  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return { authenticated: false, user: null, error: 'Insufficient permissions' };
  }

  return { authenticated: true, user };
}
