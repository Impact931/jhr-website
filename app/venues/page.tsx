import { getSSRSections } from '@/lib/ssr-content';
import { VenuesPageClient } from './VenuesPageClient';

export default async function VenuesPage() {
  const sections = await getSSRSections('venues');
  return <VenuesPageClient initialSections={sections} />;
}
