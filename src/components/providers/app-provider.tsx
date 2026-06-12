'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'sonner';
import { authService, getRoleBasedRedirect } from '@/lib/auth';
import type { User } from '@/types';

interface AppContextType {
  user: User | null;
  userProfile: any | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (updates: any) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await authService.login({ email, password });
      
      if (result.success && result.data) {
        setUser(result.data);
        toast.success(`Welcome back, ${result.data.name}!`);
        
        // Redirect based on role
        const redirectPath = getRoleBasedRedirect(result.data.role);
        router.push(redirectPath);
        return true;
      } else {
        toast.error(result.error || 'Invalid email or password');
        return false;
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      return false;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      toast.success('You have been logged out successfully');
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear user state even if server logout fails
      setUser(null);
      router.push('/');
    }
  };

  const refreshUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      
      // Load user profile based on role
      if (currentUser) {
        // This would load the role-specific profile from database
        // For now, we'll create a basic profile structure
        const profile = {
          id: currentUser.id + '_profile',
          name: currentUser.name,
          email: currentUser.email,
          role: currentUser.role
        };
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
      setUserProfile(null);
    }
  };

  const updateProfile = async (updates: any) => {
    try {
      // Update profile in database and local state
      if (userProfile) {
        const updatedProfile = { ...userProfile, ...updates };
        setUserProfile(updatedProfile);
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const contextValue: AppContextType = {
    user,
    userProfile,
    loading,
    login,
    logout,
    refreshUser,
    updateProfile,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={contextValue}>
      <div className="min-h-screen bg-background">
        {children}
        <Toaster />
      </div>
    </AppContext.Provider>
  );
}