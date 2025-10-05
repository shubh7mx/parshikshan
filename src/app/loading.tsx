import { GraduationCap } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <div className="animate-bounce">
          <GraduationCap className="h-12 w-12 text-primary mx-auto" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Prashiskshan</h2>
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <div className="flex space-x-1 justify-center">
          <div className="h-2 w-2 bg-primary rounded-full animate-pulse delay-0"></div>
          <div className="h-2 w-2 bg-primary rounded-full animate-pulse delay-75"></div>
          <div className="h-2 w-2 bg-primary rounded-full animate-pulse delay-150"></div>
        </div>
      </div>
    </div>
  );
}