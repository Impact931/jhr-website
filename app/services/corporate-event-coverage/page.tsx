import { getSSRSections } from '@/lib/ssr-content';
import { EditablePage } from '@/components/inline-editor/EditablePage';
import { CEC_SECTIONS } from '@/content/schemas/corporate-event-coverage';

const SECTION_CLASS_MAP: Record<string, string> = {
  "gallery": "section-padding section-light",
  "filmstrip": "section-padding section-light",
  "faqs": "section-padding section-light",
  "multi-day": "section-padding bg-jhr-black-light callout-gold-border",
  "after-hours": "section-padding bg-jhr-black gold-bullets",
  "event-types": "section-padding bg-jhr-black glass-cards",
  "video-bundling": "section-padding bg-jhr-black",
};

export default async function CorporateEventCoveragePage() {
  const sections = await getSSRSections('corporate-event-coverage');
  return (
    <EditablePage
      pageSlug="corporate-event-coverage"
      initialSections={sections}
      defaultSections={CEC_SECTIONS}
      sectionClassMap={SECTION_CLASS_MAP}
    />
  );
}
