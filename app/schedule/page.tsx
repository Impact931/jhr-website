import { getSSRSections } from '@/lib/ssr-content';
import { EditablePage } from '@/components/inline-editor/EditablePage';
import { SCHEDULE_SECTIONS } from '@/content/schemas/schedule';

const SECTION_CLASS_MAP: Record<string, string> = {
  "faqs": "section-padding bg-jhr-black-light",
};

export default async function SchedulePage() {
  const sections = await getSSRSections('schedule');
  return (
    <EditablePage
      pageSlug="schedule"
      initialSections={sections}
      defaultSections={SCHEDULE_SECTIONS}
      sectionClassMap={SECTION_CLASS_MAP}
    />
  );
}
