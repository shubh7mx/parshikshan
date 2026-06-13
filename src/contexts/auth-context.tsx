'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  loginDemo: () => Promise<{ success: boolean; error?: string }>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: User['role'];
  phone?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function callServerAction(name: string, data: Record<string, unknown>) {
  const response = await fetch('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: name, ...data }),
  });
  return response.json();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const result = await callServerAction('getCurrentUser', {});
      if (result.success && result.data) {
        setUser(result.data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const result = await callServerAction('login', { email, password });

      if (result.success && result.data) {
        setUser(result.data);
        toast.success('Welcome back!');
        const redirectPath = getRoleBasedRedirect(result.data.role);
        router.push(redirectPath);
        return { success: true };
      }
      return { success: false, error: result.error || 'Login failed' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const role = (userData.role as any as string) === 'company' ? 'industry_partner' : userData.role;

      const result = await callServerAction('register', { ...userData, role });

      if (result.success && result.data) {
        setUser(result.data);
        toast.success('Registration successful! Welcome to Prashiskshan.');
        const redirectPath = getRoleBasedRedirect(result.data.role);
        router.push(redirectPath);
        return { success: true };
      }
      return { success: false, error: result.error || 'Registration failed' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await callServerAction('logout', {});
      setUser(null);
      toast.success('Logged out successfully');
      router.push('/');
    } catch {
      toast.error('Error logging out');
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await callServerAction('resetPassword', { email });
      return { success: result.success, error: result.error };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to send recovery email' };
    }
  };

  const loginDemo = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const result = await callServerAction('demoLogin', {});

      if (result.success && result.data) {
        setUser(result.data);
        toast.success('Welcome to the demo! Exploring as a student.');
        router.push('/dashboard');
        return { success: true };
      }
      return { success: false, error: 'Demo login failed.' };
    } catch (error: any) {
      return { success: false, error: error.message || 'Demo login failed.' };
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBasedRedirect = (role: string): string => {
    switch (role) {
      case 'student':
        return '/dashboard';
      case 'faculty':
        return '/faculty/dashboard';
      case 'admin':
        return '/admin/dashboard';
      case 'industry_partner':
        return '/company/dashboard';
      default:
        return '/dashboard';
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    forgotPassword,
    loginDemo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
