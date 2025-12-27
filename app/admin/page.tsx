'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, Image, Settings, ArrowRight, Clock } from 'lucide-react';
import { getPageCount } from '@/lib/pages-schema';

interface Stats {
  totalPages: number;
  totalMedia: number;
  recentChanges: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalPages: getPageCount(),
    totalMedia: 0,
    recentChanges: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch media stats from API
        const mediaResponse = await fetch('/api/admin/media?stats=true');
        if (mediaResponse.ok) {
          const data = await mediaResponse.json();
          setStats(prev => ({
            ...prev,
            totalMedia: (data.stats?.totalImages || 0) + (data.stats?.totalVideos || 0),
          }));
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const quickActions = [
    {
      title: 'Edit Pages',
      description: 'Manage content on your website pages',
      href: '/admin/pages',
      icon: FileText,
    },
    {
      title: 'Media Library',
      description: 'Upload and manage images and videos',
      href: '/admin/media',
      icon: Image,
    },
    {
      title: 'Settings',
      description: 'Configure site settings',
      href: '/admin/settings',
      icon: Settings,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="text-2xl font-bold text-jhr-white mb-2">Welcome to JHR Admin</h2>
        <p className="text-jhr-white-dim">Manage your website content, media, and settings from here.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-jhr-black-light border border-jhr-black-lighter rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-jhr-gold/10 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-jhr-gold" />
            </div>
          </div>
          <div className="text-3xl font-bold text-jhr-white mb-1">
            {isLoading ? '-' : stats.totalPages}
          </div>
          <div className="text-jhr-white-dim text-sm">Editable Pages</div>
        </div>

        <div className="bg-jhr-black-light border border-jhr-black-lighter rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-jhr-gold/10 rounded-lg flex items-center justify-center">
              <Image className="w-6 h-6 text-jhr-gold" />
            </div>
          </div>
          <div className="text-3xl font-bold text-jhr-white mb-1">
            {isLoading ? '-' : stats.totalMedia}
          </div>
          <div className="text-jhr-white-dim text-sm">Media Files</div>
        </div>

        <div className="bg-jhr-black-light border border-jhr-black-lighter rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-jhr-gold/10 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-jhr-gold" />
            </div>
          </div>
          <div className="text-3xl font-bold text-jhr-white mb-1">
            {isLoading ? '-' : stats.recentChanges}
          </div>
          <div className="text-jhr-white-dim text-sm">Recent Changes</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-jhr-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="group bg-jhr-black-light border border-jhr-black-lighter rounded-xl p-6 hover:border-jhr-gold/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 bg-jhr-black-lighter rounded-lg flex items-center justify-center mb-4 group-hover:bg-jhr-gold/10 transition-colors">
                    <Icon className="w-5 h-5 text-jhr-white-dim group-hover:text-jhr-gold transition-colors" />
                  </div>
                  <ArrowRight className="w-5 h-5 text-jhr-white-dim group-hover:text-jhr-gold transition-colors" />
                </div>
                <h4 className="text-jhr-white font-medium mb-1">{action.title}</h4>
                <p className="text-jhr-white-dim text-sm">{action.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-gradient-to-r from-jhr-gold/10 to-transparent border border-jhr-gold/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-jhr-white mb-2">Getting Started</h3>
        <p className="text-jhr-white-muted mb-4">
          Use the sidebar to navigate between different sections. Start by uploading media to the Media Library,
          then edit your pages to use the uploaded content.
        </p>
        <div className="flex gap-3">
          <Link
            href="/admin/media"
            className="px-4 py-2 bg-jhr-gold text-jhr-black font-medium rounded-lg hover:bg-jhr-gold-light transition-colors"
          >
            Go to Media Library
          </Link>
          <Link
            href="/admin/pages"
            className="px-4 py-2 border border-jhr-white-dim text-jhr-white rounded-lg hover:bg-jhr-black-lighter transition-colors"
          >
            Edit Pages
          </Link>
        </div>
      </div>
    </div>
  );
}
