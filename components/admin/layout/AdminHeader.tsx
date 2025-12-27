'use client';

import { usePathname } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

const pageTitles: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/pages': 'Pages',
  '/admin/media': 'Media Library',
  '/admin/settings': 'Settings',
};

export function AdminHeader() {
  const pathname = usePathname();

  // Get title from map or generate from pathname
  const getTitle = () => {
    // Check exact matches first
    if (pageTitles[pathname]) {
      return pageTitles[pathname];
    }

    // Check prefix matches
    for (const [path, title] of Object.entries(pageTitles)) {
      if (pathname.startsWith(path) && path !== '/admin') {
        return title;
      }
    }

    return 'Admin';
  };

  return (
    <header className="h-16 bg-jhr-black border-b border-jhr-black-lighter flex items-center justify-between px-6">
      <div>
        <h1 className="text-xl font-semibold text-jhr-white">{getTitle()}</h1>
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-4 py-2 text-sm text-jhr-white-muted hover:text-jhr-white transition-colors"
        >
          <span>View Site</span>
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>
    </header>
  );
}
