import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Expert insights on corporate event photography, headshot activations, venue guides, and making the most of Nashville\'s premier event spaces. Tips from JHR Photography.',
  openGraph: {
    title: 'Blog | JHR Photography',
    description:
      'Expert insights on corporate event photography, headshot activations, and Nashville venue guides.',
    type: 'website',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
