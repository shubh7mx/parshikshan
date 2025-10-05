import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define protected routes and their required roles
const protectedRoutes = {
  '/student': ['student'],
  '/faculty': ['faculty'],
  '/admin': ['admin'],
  '/company': ['company'],
} as const;

const publicRoutes = [
  '/', 
  '/login', 
  '/register', 
  '/forgot-password',
  '/reset-password',
  '/about', 
  '/contact',
  '/api/auth'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow static files and API routes
  if (pathname.startsWith('/_next/') || 
      pathname.startsWith('/favicon') ||
      pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  
  // Check if the route is public
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  // Check if the route is protected
  const protectedRoute = Object.keys(protectedRoutes).find(route => 
    pathname.startsWith(route)
  );
  
  if (protectedRoute) {
    // Check for authentication session
    const sessionCookie = request.cookies.get('a_session_' + process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);
    
    if (!sessionCookie) {
      // Redirect to login if not authenticated
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};