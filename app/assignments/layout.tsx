import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Assignment | JHR Photography',
  robots: { index: false, follow: false },
};

export default function AssignmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#111] text-white">
      <header className="border-b border-[#333] px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="w-10 h-10 bg-[#c8a45e] rounded-lg flex items-center justify-center font-bold text-[#111] text-lg">
            J
          </div>
          <div>
            <h1 className="text-lg font-semibold text-[#c8a45e]">JHR Photography</h1>
            <p className="text-xs text-gray-500">Operator Assignment System</p>
          </div>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-8">{children}</main>
      <footer className="border-t border-[#333] px-6 py-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gray-600 text-sm">JHR Photography | Nashville, TN</p>
          <p className="text-gray-700 text-xs mt-1">Confidential — Do not share this link.</p>
        </div>
      </footer>
    </div>
  );
}
