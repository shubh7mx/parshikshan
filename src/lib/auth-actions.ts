'use server';

import { account, handleAppwriteError } from './appwrite';
import { dbOperations, userService } from './database';
import { redirect } from 'next/navigation';
import type { User, UserRole, LoginCredentials, RegisterData, ApiResponse } from '@/types';

// Get current authenticated user
export async function getCurrentUser(): Promise<User | null> {
  try {
    const session = await account.get();
    if (!session) return null;

    // Get user details from database
    const userResult = await dbOperations.getUserByEmail(session.email);
    if (userResult.success && userResult.data) {
      return userResult.data;
    }

    return null;
  } catch (error) {
    return null;
  }
}

// Check if user has required role
export async function hasRole(requiredRoles: UserRole[]): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  return requiredRoles.includes(user.role);
}

// Login user
export async function loginUser(credentials: LoginCredentials): Promise<ApiResponse<User>> {
  try {
    await account.createEmailPasswordSession(credentials.email, credentials.password);
    
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Failed to get user data' };
    }

    return { success: true, data: user };
  } catch (error) {
    return { success: false, ...handleAppwriteError(error) };
  }
}

// Register new user
export async function registerUser(data: RegisterData): Promise<ApiResponse<User>> {
  try {
    // Create Appwrite account
    const account_result = await account.create('unique()', data.email, data.password, data.name);
    
    // Create user document in database
    const userDoc = await userService.create<User>({
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      isActive: true
    });

    if (!userDoc.success) {
      // If user doc creation fails, delete the auth account
      await account.deleteSession('current').catch(() => {});
      return userDoc;
    }

    // Auto-login after registration
    await account.createEmailPasswordSession(data.email, data.password);

    return { success: true, data: userDoc.data! };
  } catch (error) {
    return { success: false, ...handleAppwriteError(error) };
  }
}

// Logout user
export async function logoutUser(): Promise<ApiResponse<void>> {
  try {
    await account.deleteSession('current');
    return { success: true };
  } catch (error) {
    return { success: false, ...handleAppwriteError(error) };
  }
}

// Send password recovery email
export async function resetPassword(email: string): Promise<ApiResponse<void>> {
  try {
    await account.createRecovery(email, `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`);
    return { success: true };
  } catch (error) {
    return { success: false, ...handleAppwriteError(error) };
  }
}

// Complete password reset
export async function completePasswordReset(
  userId: string,
  secret: string,
  password: string
): Promise<ApiResponse<void>> {
  try {
    await account.updateRecovery(userId, secret, password);
    return { success: true };
  } catch (error) {
    return { success: false, ...handleAppwriteError(error) };
  }
}

// Higher-order function to wrap server actions with authentication
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

// Middleware helper function
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