'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { FileText, Users, Activity, TrendingUp, Clock, Eye, PenLine } from 'lucide-react';

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [leadCount, setLeadCount] = useState<number | null>(null);
  const [blogCount, setBlogCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [leadsRes, blogRes] = await Promise.all([
          fetch('/api/admin/leads'),
          fetch('/api/admin/blog'),
        ]);
        if (leadsRes.ok) {
          const data = await leadsRes.json();
          setLeadCount(data.count ?? 0);
        }
        if (blogRes.ok) {
          const data = await blogRes.json();
          setBlogCount(data.count ?? 0);
        }
      } catch {
        // Silently fail — dashboard still works without counts
      }
    }
    fetchCounts();
  }, []);

  const userName = session?.user?.name || 'Admin';

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-display-sm font-display font-bold text-jhr-white">
          Welcome back, {userName}
        </h1>
        <p className="mt-2 text-body-md text-jhr-white-dim">
          Here&apos;s an overview of your photography website.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Total Pages Card */}
        <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-body-sm text-jhr-white-dim">Total Pages</p>
              <p className="mt-2 text-display-sm font-display font-bold text-jhr-white">26</p>
            </div>
            <div className="p-3 rounded-lg bg-jhr-gold/10">
              <FileText className="w-6 h-6 text-jhr-gold" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-body-sm">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400">All published</span>
          </div>
        </div>

        {/* Form Submissions Card */}
        <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-body-sm text-jhr-white-dim">Form Submissions</p>
              <p className="mt-2 text-display-sm font-display font-bold text-jhr-white">{leadCount !== null ? leadCount : '—'}</p>
            </div>
            <div className="p-3 rounded-lg bg-jhr-blue/10">
              <Users className="w-6 h-6 text-jhr-blue" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-body-sm">
            <Clock className="w-4 h-4 text-jhr-white-dim" />
            <span className="text-jhr-white-dim">{leadCount !== null && leadCount > 0 ? `${leadCount} lead${leadCount !== 1 ? 's' : ''} total` : 'No new leads'}</span>
          </div>
        </div>

        {/* Blog Posts Card */}
        <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-body-sm text-jhr-white-dim">Blog Posts</p>
              <p className="mt-2 text-display-sm font-display font-bold text-jhr-white">{blogCount !== null ? blogCount : '—'}</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500/10">
              <PenLine className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-body-sm">
            <Eye className="w-4 h-4 text-jhr-white-dim" />
            <span className="text-jhr-white-dim">{blogCount !== null && blogCount > 0 ? `${blogCount} post${blogCount !== 1 ? 's' : ''} total` : 'No posts yet'}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions / Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-6">
          <h2 className="text-heading-md font-display font-semibold text-jhr-white mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-jhr-black hover:bg-jhr-black-lighter border border-jhr-black-lighter text-jhr-white-dim hover:text-jhr-white transition-colors text-left">
              <FileText className="w-5 h-5" />
              <span>Edit Homepage</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-jhr-black hover:bg-jhr-black-lighter border border-jhr-black-lighter text-jhr-white-dim hover:text-jhr-white transition-colors text-left">
              <Users className="w-5 h-5" />
              <span>View Leads</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-jhr-black hover:bg-jhr-black-lighter border border-jhr-black-lighter text-jhr-white-dim hover:text-jhr-white transition-colors text-left">
              <Activity className="w-5 h-5" />
              <span>View Analytics</span>
            </button>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="bg-jhr-black-light rounded-xl border border-jhr-black-lighter p-6">
          <h2 className="text-heading-md font-display font-semibold text-jhr-white mb-4">
            Recent Activity
          </h2>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="p-4 rounded-full bg-jhr-black-lighter mb-4">
              <Activity className="w-8 h-8 text-jhr-white-dim" />
            </div>
            <p className="text-body-md text-jhr-white-dim">No recent activity</p>
            <p className="text-body-sm text-jhr-white-dim mt-1">
              Activity will appear here as visitors interact with your site.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
