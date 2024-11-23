import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();

  // Check if this is a username route (single segment path)
  const pathSegments = req.nextUrl.pathname.split('/').filter(Boolean);
  const isUsernamePath = pathSegments.length === 1;

  // Public paths that don't require authentication
  const publicPaths = ['/', '/login', '/signup', '/auth/callback'];
  const isPublicPath = publicPaths.includes(req.nextUrl.pathname);

  // Bypass paths that should never go through auth
  const bypassPaths = [
    '/_next',
    '/static',
    '/api/public',
    '/favicon.ico',
    '/manifest.json',
    '/robots.txt',
  ];
  const shouldBypass = bypassPaths.some(path => 
    req.nextUrl.pathname.startsWith(path)
  );

  // Allow access to public paths, bypass paths, and username paths
  if (shouldBypass || isPublicPath || isUsernamePath) {
    return res;
  }

  try {
    const supabase = createMiddlewareClient({ req, res });
    const { data: { session } } = await supabase.auth.getSession();

    // If there's no session and the path isn't public, redirect to login
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    return res;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
