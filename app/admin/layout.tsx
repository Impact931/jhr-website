'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar';
import { AdminHeader } from '@/components/admin/layout/AdminHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await fetch('/api/admin/auth/verify');
        const data = await response.json();
        setIsAuthenticated(data.authenticated);

        // Redirect to login if not authenticated (except on login page)
        if (!data.authenticated && pathname !== '/admin/login') {
          router.push('/admin/login');
        }

        // Redirect to dashboard if authenticated and on login page
        if (data.authenticated && pathname === '/admin/login') {
          router.push('/admin');
        }
      } catch (error) {
        setIsAuthenticated(false);
        if (pathname !== '/admin/login') {
          router.push('/admin/login');
        }
      }
    };

    verifyAuth();
  }, [pathname, router]);

  // Show loading state while checking auth
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-jhr-black flex items-center justify-center">
        <div className="flex items-center gap-3 text-jhr-white">
          <div className="w-6 h-6 border-2 border-jhr-gold border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  // Login page - no sidebar/header
  if (pathname === '/admin/login') {
    return (
      <div className="min-h-screen bg-jhr-black">
        {children}
      </div>
    );
  }

  // Not authenticated - show nothing while redirecting
  if (!isAuthenticated) {
    return null;
  }

  // Authenticated - show full admin layout
  return (
    <div className="min-h-screen bg-jhr-black">
      <AdminSidebar />
      <div className="lg:ml-64">
        <AdminHeader />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
