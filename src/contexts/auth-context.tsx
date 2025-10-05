'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { account, databases, ID, Query } from '@/lib/appwrite';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface User {
  $id: string;
  name: string;
  email: string;
  role: 'student' | 'faculty' | 'admin' | 'industry_partner';
  profileImage?: string;
  isActive: boolean;
  $createdAt: string;
  $updatedAt: string;
}

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
  role: 'student' | 'faculty' | 'admin' | 'industry_partner';
  phone?: string;
  college?: string;
  department?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const currentUser = await account.get();
      if (currentUser) {
        // Get user profile from database
        const profileData = await getUserProfile(currentUser.$id);
        if (profileData) {
          setUser({
            $id: currentUser.$id,
            name: currentUser.name,
            email: currentUser.email,
            role: profileData.role || 'student',
            profileImage: profileData.profileImage,
            isActive: profileData.isActive !== false,
            $createdAt: currentUser.$createdAt,
            $updatedAt: currentUser.$updatedAt
          });
        }
      }
    } catch (error) {
      // User is not authenticated
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserProfile = async (userId: string) => {
    try {
      const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID || 'prashiskshan-db';
      const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_USERS_COLLECTION_ID || 'users';
      
      const response = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.equal('appwriteUserId', userId)]
      );
      
      return response.documents[0] || null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      await account.createEmailPasswordSession(email, password);
      
      const currentUser = await account.get();
      const profileData = await getUserProfile(currentUser.$id);
      
      if (profileData) {
        const userData = {
          $id: currentUser.$id,
          name: currentUser.name,
          email: currentUser.email,
          role: profileData.role || 'student',
          profileImage: profileData.profileImage,
          isActive: profileData.isActive !== false,
          $createdAt: currentUser.$createdAt,
          $updatedAt: currentUser.$updatedAt
        };
        
        setUser(userData);
        toast.success('Welcome back!');
        
        // Redirect based on role
        const redirectPath = getRoleBasedRedirect(userData.role);
        router.push(redirectPath);
        
        return { success: true };
      } else {
        await account.deleteSession('current');
        return { success: false, error: 'User profile not found' };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Login failed. Please check your credentials.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      // Clear any existing sessions first
      try {
        await account.deleteSession('current');
      } catch {
        // No existing session to clear, which is fine
      }
      
      // Create account
      const accountResponse = await account.create(
        ID.unique(),
        userData.email,
        userData.password,
        userData.name
      );

      // Create user profile in database
      const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID || 'prashiskshan-db';
      const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_USERS_COLLECTION_ID || 'users';

      const profileData = {
        appwriteUserId: accountResponse.$id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        phone: userData.phone || '',
        college: userData.college || '',
        department: userData.department || '',
        isActive: true,
        profileImage: '',
        createdAt: new Date().toISOString()
      };

      await databases.createDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        ID.unique(),
        profileData
      );

      // Account creation automatically creates a session, so we can use it directly
      // Get the current session (created automatically by account.create)
      const currentUser = await account.get();
      
      const newUser = {
        $id: currentUser.$id,
        name: currentUser.name,
        email: currentUser.email,
        role: userData.role,
        profileImage: '',
        isActive: true,
        $createdAt: currentUser.$createdAt,
        $updatedAt: currentUser.$updatedAt
      };
      
      setUser(newUser);
      toast.success('Registration successful! Welcome to Prashiskshan.');
      
      // Redirect to onboarding or dashboard
      const redirectPath = getRoleBasedRedirect(userData.role);
      router.push(redirectPath);
      
      return { success: true };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.message || 'Registration failed. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await account.deleteSession('current');
      setUser(null);
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out');
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const redirectURL = `${window.location.origin}/reset-password`;
      await account.createRecovery(email, redirectURL);
      return { success: true };
    } catch (error: any) {
      console.error('Password recovery error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to send recovery email' 
      };
    }
  };

  const loginDemo = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      // Create a mock student user for demo purposes
      const demoUser: User = {
        $id: 'demo-user-student',
        name: 'Demo Student',
        email: 'demo@student.com',
        role: 'student',
        profileImage: '',
        isActive: true,
        $createdAt: new Date().toISOString(),
        $updatedAt: new Date().toISOString()
      };
      
      setUser(demoUser);
      toast.success('Welcome to the demo! Exploring as a student.');
      
      // Redirect to student dashboard
      router.push('/dashboard');
      
      return { success: true };
    } catch (error: any) {
      console.error('Demo login error:', error);
      return { 
        success: false, 
        error: error.message || 'Demo login failed.' 
      };
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
    loginDemo
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}