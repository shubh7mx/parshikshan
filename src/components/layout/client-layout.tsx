'use client';

import { AppProvider } from '@/components/providers/app-provider';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { MainNav } from '@/components/navigation/main-nav';
import { Toaster } from 'sonner';
import { usePathname } from 'next/navigation';

function AppContent({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  
  // Public routes that don't need authentication
  const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/about', '/contact'];
  const isPublicRoute = publicRoutes.includes(pathname);
  
  return (
    <AppProvider>
      <div className="flex min-h-screen flex-col overflow-x-hidden">
        {/* Only show navigation if authenticated or on protected routes */}
        {isAuthenticated && (
          <MainNav
            user={user!}
            notifications={3}
            onLogout={logout}
          />
        )}
        <main className={`${isAuthenticated && !isPublicRoute ? "flex-1" : ""} min-w-0`}>
          {children}
        </main>
      </div>
      <Toaster richColors closeButton />
    </AppProvider>
  );
}

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AppContent>{children}</AppContent>
    </AuthProvider>
  );
}
