import { getSSRSections } from '@/lib/ssr-content';
import { EditablePage } from '@/components/inline-editor/EditablePage';
import { SERVICES_SECTIONS } from '@/content/schemas/services';

const SECTION_CLASS_MAP: Record<string, string> = {
  "discovery-pathways": "section-padding section-light",
  "not-sure-cta": "section-padding bg-[#0B0C0F]",
  "stats": "section-padding-sm bg-[#0B0C0F]",
  "guide-credibility": "section-padding section-light",
  "quick-reference": "section-padding bg-[#0B0C0F]",
  "final-cta": "section-padding bg-[#0B0C0F]",
};

export default async function ServicesPage() {
  const sections = await getSSRSections('services');
  return (
    <EditablePage
      pageSlug="services"
      initialSections={sections}
      defaultSections={SERVICES_SECTIONS}
      sectionClassMap={SECTION_CLASS_MAP}
    />
  );
}
