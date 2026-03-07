import { getSSRSections } from '@/lib/ssr-content';
import { EditablePage } from '@/components/inline-editor/EditablePage';
import { EI_SECTIONS } from '@/content/schemas/executive-imaging';

const SECTION_CLASS_MAP: Record<string, string> = {
  "problem": "section-padding section-light",
  "solution": "section-padding section-light",
  "two-tiers": "section-padding bg-[#0B0C0F]",
  "event-pairing": "section-padding bg-[#0B0C0F]",
  "headshot-styles": "section-padding section-light",
  "social-proof": "section-padding bg-[#0B0C0F]",
  "faqs": "section-padding section-light",
  "final-cta": "section-padding bg-[#0B0C0F]",
};

export default async function ExecutiveImagingPage() {
  const sections = await getSSRSections('executive-imaging');
  return (
    <EditablePage
      pageSlug="executive-imaging"
      initialSections={sections}
      defaultSections={EI_SECTIONS}
      sectionClassMap={SECTION_CLASS_MAP}
    />
  );
}
