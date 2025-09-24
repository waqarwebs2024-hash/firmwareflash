
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from './lib/auth';
import { logVisitorAction } from './lib/actions';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const session = await getSession();

  // Visitor Logging: Log non-admin, non-API, non-static file requests
  if (
    !pathname.startsWith('/admin') &&
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/_next/static') &&
    !pathname.startsWith('/_next/image') &&
    !pathname.endsWith('.ico') &&
    !pathname.endsWith('.png') &&
    !pathname.endsWith('.jpg')
  ) {
    // Fire and forget, don't block the request
    logVisitorAction(request.ip).catch(console.error);
  }

  // If there's no session and the user is trying to access an admin page, redirect to login
  if (!session && pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If there is a session and the user tries to access the login page, redirect to admin
  if (session && pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // Set x-pathname header for use in layouts/pages
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    }
  });
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
