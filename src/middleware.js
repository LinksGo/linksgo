import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request) {
  const token = await getToken({ req: request })
  const { pathname } = request.nextUrl

  // Allow public routes
  if (pathname.startsWith('/_next') || 
      pathname.startsWith('/api/auth') || 
      pathname === '/auth/signin' ||
      pathname === '/') {
    return NextResponse.next()
  }

  // Protected routes
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
    return NextResponse.next()
  }

  // Public profile routes (username routes)
  if (pathname.match(/^\/[^/]+$/)) {
    return NextResponse.next()
  }

  // Default to home page for unmatched routes
  return NextResponse.redirect(new URL('/', request.url))
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
