'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  FileText,
  Image,
  Users,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Camera,
  ChevronRight,
  PenLine,
  CheckCircle,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Pages', href: '/admin/pages', icon: <FileText className="w-5 h-5" /> },
  { label: 'Media', href: '/admin/media', icon: <Image className="w-5 h-5" /> },
  { label: 'Blog', href: '/admin/blog', icon: <PenLine className="w-5 h-5" /> },
  { label: 'Leads', href: '/admin/leads', icon: <Users className="w-5 h-5" /> },
  { label: 'Knowledge', href: '/admin/knowledge', icon: <BookOpen className="w-5 h-5" /> },
  { label: 'Analytics', href: '/admin/analytics', icon: <BarChart3 className="w-5 h-5" /> },
  { label: 'Settings', href: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
];

export default function AdminSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    // Clear edit mode from sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('jhr-edit-mode');
    }
    // Sign out and redirect to homepage (not admin login)
    await signOut({ callbackUrl: '/', redirect: true });
  };

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo / Brand */}
      <div className="p-6 border-b border-jhr-black-lighter">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-jhr-gold/10 flex items-center justify-center">
            <Camera className="w-5 h-5 text-jhr-gold" />
          </div>
          <div>
            <h1 className="font-display font-bold text-jhr-white">JHR Admin</h1>
            <p className="text-xs text-jhr-white-dim">Photography</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group ${
                active
                  ? 'bg-jhr-gold/10 text-jhr-gold'
                  : 'text-jhr-white-dim hover:bg-jhr-black-lighter hover:text-jhr-white'
              }`}
            >
              <span className={active ? 'text-jhr-gold' : 'text-jhr-white-dim group-hover:text-jhr-white'}>
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
              {active && (
                <ChevronRight className="w-4 h-4 ml-auto text-jhr-gold" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-jhr-black-lighter">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-jhr-gold/20 flex items-center justify-center">
            <span className="text-sm font-medium text-jhr-gold">
              {session?.user?.name?.[0]?.toUpperCase() || session?.user?.email?.[0]?.toUpperCase() || 'A'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-jhr-white truncate">
              {session?.user?.name || 'Admin User'}
            </p>
            <p className="text-xs text-jhr-white-dim truncate">
              {session?.user?.email || 'admin@example.com'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowLogoutModal(true)}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-jhr-white-dim hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-jhr-black-light border border-jhr-black-lighter text-jhr-white hover:bg-jhr-black-lighter transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-jhr-black border-r border-jhr-black-lighter z-40">
        <SidebarContent />
      </aside>

      {/* Sidebar - Mobile */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 w-64 bg-jhr-black border-r border-jhr-black-lighter z-50 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-lg text-jhr-white-dim hover:text-jhr-white hover:bg-jhr-black-lighter transition-colors"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
        <SidebarContent />
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => !isLoggingOut && setShowLogoutModal(false)}
          />
          {/* Modal */}
          <div className="relative bg-jhr-black-light border border-jhr-black-lighter rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-jhr-gold/10 flex items-center justify-center mb-4">
                {isLoggingOut ? (
                  <CheckCircle className="w-8 h-8 text-green-400" />
                ) : (
                  <LogOut className="w-8 h-8 text-jhr-gold" />
                )}
              </div>
              <h3 className="text-xl font-display font-bold text-jhr-white mb-2">
                {isLoggingOut ? 'Signed Out Successfully' : 'Sign Out'}
              </h3>
              <p className="text-jhr-white-dim mb-6">
                {isLoggingOut
                  ? 'You have been logged out. Redirecting to the homepage...'
                  : 'Are you sure you want to sign out? You will be redirected to the homepage.'}
              </p>
              {!isLoggingOut && (
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className="flex-1 px-4 py-3 rounded-lg border border-jhr-black-lighter text-jhr-white-dim hover:text-jhr-white hover:bg-jhr-black-lighter transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors font-medium"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
