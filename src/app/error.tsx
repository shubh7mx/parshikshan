'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { GraduationCap, RefreshCcw, Home, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

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
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Something went wrong!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              An unexpected error occurred. Don't worry, our team has been notified.
            </p>
            
            {process.env.NODE_ENV === 'development' && (
              <div className="p-4 bg-muted rounded-lg text-left">
                <p className="text-sm font-mono text-destructive break-all">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={reset}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Link>
              </Button>
            </div>
            
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground mb-3">
                Need help?
              </p>
              <Link href="/contact" className="text-sm text-primary hover:underline">
                Contact Support
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}