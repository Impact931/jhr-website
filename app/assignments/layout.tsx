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
      <main className="max-w-3xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
