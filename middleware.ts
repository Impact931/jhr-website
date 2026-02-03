import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

/**
 * NextAuth middleware for protecting admin routes
 *
 * - /admin/* routes require authentication (except /admin/login)
 * - Unauthenticated users are redirected to /admin/login
 * - All other routes (/, /services/*, etc.) are public
 */
export default withAuth(
  function middleware(req) {
    // Continue to the requested page if authenticated
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow access to login page without authentication
        if (pathname === '/admin/login') {
          return true;
        }

        // Require authentication for all other /admin routes
        if (pathname.startsWith('/admin')) {
          return !!token;
        }

        // Allow all other routes (public pages)
        return true;
      },
    },
    pages: {
      signIn: '/admin/login',
    },
  }
);

// Configure which routes the middleware applies to
export const config = {
  matcher: [
    // Match all admin routes
    '/admin/:path*',
  ],
};
