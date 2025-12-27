'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { EditorWrapper } from '@/components/editor';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  // Admin routes - no header/footer
  if (isAdminRoute) {
    return <>{children}</>;
  }

  // Public routes - include header/footer
  return (
    <EditorWrapper>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </EditorWrapper>
  );
}
