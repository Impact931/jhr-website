'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { InlineEditorProvider } from '@/components/inline-editor';

interface LayoutShellProps {
  children: ReactNode;
}

export function LayoutShell({ children }: LayoutShellProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  if (isAdmin) {
    return (
      <InlineEditorProvider>
        {children}
      </InlineEditorProvider>
    );
  }

  return (
    <InlineEditorProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </InlineEditorProvider>
  );
}
