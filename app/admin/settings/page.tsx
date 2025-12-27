'use client';

import { Settings } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-jhr-white mb-2">Settings</h2>
        <p className="text-jhr-white-dim">Configure your website settings.</p>
      </div>

      {/* Placeholder */}
      <div className="bg-jhr-black-light border border-jhr-black-lighter rounded-xl p-12 text-center">
        <div className="w-16 h-16 bg-jhr-black-lighter rounded-xl flex items-center justify-center mx-auto mb-4">
          <Settings className="w-8 h-8 text-jhr-white-dim" />
        </div>
        <h3 className="text-lg font-medium text-jhr-white mb-2">Settings Coming Soon</h3>
        <p className="text-jhr-white-dim max-w-md mx-auto">
          Site settings are being developed. You'll be able to configure various aspects of your website from here.
        </p>
      </div>
    </div>
  );
}
