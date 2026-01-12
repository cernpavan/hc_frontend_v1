import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Note: Middleware runs on the edge and cannot access localStorage or Zustand stores
// Auth protection is handled client-side in the page components using useEffect + redirect
// This middleware can be used for server-side checks if you implement cookie-based auth

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // For now, just pass through all requests
  // Client-side auth checks handle protected routes

  // Add security headers
  const response = NextResponse.next();

  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
  ],
};
