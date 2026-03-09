import { withAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Redirect www to non-www (301) for SEO canonicalization.
 * Must run before NextAuth middleware.
 */
function handleWwwRedirect(req: NextRequest): NextResponse | null {
  const host = req.headers.get('host') || '';
  if (host.startsWith('www.')) {
    const url = req.nextUrl.clone();
    url.host = host.replace('www.', '');
    return NextResponse.redirect(url, 301);
  }
  return null;
}

/**
 * NextAuth middleware for protecting admin routes
 *
 * - /admin/* routes require authentication (except /admin/login)
 * - Unauthenticated users are redirected to /admin/login
 * - All other routes (/, /services/*, etc.) are public
 */
const authMiddleware = withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        if (pathname === '/admin/login') {
          return true;
        }

        if (pathname.startsWith('/admin')) {
          return !!token;
        }

        return true;
      },
    },
    pages: {
      signIn: '/admin/login',
    },
  }
);

export default function middleware(req: NextRequest) {
  // www → non-www redirect (runs on all routes)
  const wwwRedirect = handleWwwRedirect(req);
  if (wwwRedirect) return wwwRedirect;

  // Auth middleware for admin routes
  // @ts-expect-error - withAuth returns a compatible middleware function
  return authMiddleware(req, {} as never);
}

// Match admin routes + all public routes for www redirect
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|fonts|api).*)',
  ],
};
