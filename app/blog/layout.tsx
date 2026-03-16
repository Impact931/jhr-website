import type { Metadata } from 'next';
import { generateBreadcrumbListSchema, serializeSchemas } from '@/lib/structured-data';

export const metadata: Metadata = {
  title: 'Nashville Insider | Event Photography Articles & Guides',
  description:
    'Expert insights from a Nashville event photographer on corporate event coverage, headshot activations, conference photography tips, and venue guides for Nashville\'s premier event spaces.',
  openGraph: {
    title: 'Nashville Insider | JHR Photography Articles',
    description:
      'Expert insights on corporate event photography, headshot activations, conference tips, and Nashville venue guides.',
    type: 'website',
  },
};

const schemas = [
  generateBreadcrumbListSchema([
    { name: 'Home', url: '/' },
    { name: 'Articles', url: '/blog' },
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
