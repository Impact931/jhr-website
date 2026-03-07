import type { Metadata } from 'next';
import { generateBreadcrumbListSchema, serializeSchemas } from '@/lib/structured-data';

export const metadata: Metadata = {
  title: 'Nashville Insider Blog',
  description:
    'Expert insights on corporate event photography, headshot activations, venue guides, and making the most of Nashville\'s premier event spaces. Tips from JHR Photography.',
  openGraph: {
    title: 'Nashville Insider | JHR Photography Blog',
    description:
      'Expert insights on corporate event photography, headshot activations, and Nashville venue guides.',
    type: 'website',
  },
};

const schemas = [
  generateBreadcrumbListSchema([
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
  ]),
];

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {serializeSchemas(schemas).map((json, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: json }}
        />
      ))}
      {children}
    </>
  );
}
