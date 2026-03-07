import { getSSRSections } from '@/lib/ssr-content';
import { EditablePage } from '@/components/inline-editor/EditablePage';
import { EVS_SECTIONS } from '@/content/schemas/event-video-systems';

const SECTION_CLASS_MAP: Record<string, string> = {
  "value-prop": "section-padding section-light",
  "services": "section-padding bg-[#0B0C0F]",
  "use-cases": "section-padding section-light",
  "process": "section-padding bg-[#0B0C0F]",
  "gallery": "section-padding section-light",
  "social-proof": "section-padding bg-[#0B0C0F]",
  "faqs": "section-padding section-light",
  "final-cta": "section-padding bg-[#0B0C0F]",
};

export default async function EventVideoSystemsPage() {
  const sections = await getSSRSections('event-video-systems');
  return (
    <EditablePage
      pageSlug="event-video-systems"
      initialSections={sections}
      defaultSections={EVS_SECTIONS}
      sectionClassMap={SECTION_CLASS_MAP}
    />
  );
}
