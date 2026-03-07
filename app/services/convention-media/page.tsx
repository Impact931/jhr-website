import { getSSRSections } from '@/lib/ssr-content';
import { EditablePage } from '@/components/inline-editor/EditablePage';
import { CM_SECTIONS } from '@/content/schemas/convention-media';

const SECTION_CLASS_MAP: Record<string, string> = {
  "stats": "section-padding-sm bg-[#0B0C0F]",
  "problem": "section-padding section-light",
  "how-it-works": "section-padding bg-[#0B0C0F]",
  "whats-included": "section-padding section-light",
  "event-types": "section-padding bg-[#0B0C0F]",
  "social-proof": "section-padding section-light",
  "faqs": "section-padding bg-[#0B0C0F]",
  "final-cta": "section-padding bg-[#0B0C0F]",
};

export default async function ConventionMediaPage() {
  const sections = await getSSRSections('convention-media');
  return (
    <EditablePage
      pageSlug="convention-media"
      initialSections={sections}
      defaultSections={CM_SECTIONS}
      sectionClassMap={SECTION_CLASS_MAP}
    />
  );
}
