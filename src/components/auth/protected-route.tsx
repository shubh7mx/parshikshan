'use client';

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: ('student' | 'faculty' | 'admin' | 'industry_partner')[];
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredRoles,
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      if (requiredRoles && user && !requiredRoles.includes(user.role)) {
        // Redirect to unauthorized page or appropriate dashboard
        const roleRedirect = getRoleBasedRedirect(user.role);
        router.push(roleRedirect);
        return;
      }
    }
  }, [isLoading, isAuthenticated, user, requiredRoles, redirectTo, router]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Redirecting to login...</h2>
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
        </div>
      </div>
    );
  }

  if (requiredRoles && user && !requiredRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Unauthorized Access</h2>
          <p className="text-muted-foreground mb-4">You don't have permission to access this page.</p>
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}