'use client';

import Link from 'next/link';
import { GraduationCap, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Prashiskshan</span>
          </Link>
        </div>

        <Card className="text-center">
          <CardHeader>
            <div className="text-6xl font-bold text-primary mb-4">404</div>
            <CardTitle className="text-2xl">Page Not Found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              The page you're looking for doesn't exist or may have been moved.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Link>
              </Button>
              <Button variant="outline" onClick={() => window.history.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground mb-3">
                Popular pages:
              </p>
              <div className="space-y-2">
                <Link href="/login" className="block text-sm text-primary hover:underline">
                  Sign In
                </Link>
                <Link href="/register" className="block text-sm text-primary hover:underline">
                  Create Account
                </Link>
                <Link href="/about" className="block text-sm text-primary hover:underline">
                  About Us
                </Link>
                <Link href="/contact" className="block text-sm text-primary hover:underline">
                  Contact Support
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}