import { getSSRSections } from '@/lib/ssr-content';
import { EditablePage } from '@/components/inline-editor/EditablePage';
import {
  EMBASSY_SUITES_SCHEMA,
} from '@/content/schemas/venue-detail';

const SECTION_CLASS_MAP: Record<string, string> = {
  experience: "section-padding bg-jhr-black-light",
  services: "section-padding bg-jhr-black-light",
};

export default async function EmbassySuitesPage() {
  const sections = await getSSRSections('embassy-suites-nashville');
  return (
    <EditablePage
      pageSlug="embassy-suites-nashville"
      initialSections={sections}
      defaultSections={EMBASSY_SUITES_SCHEMA.sections}
      sectionClassMap={SECTION_CLASS_MAP}
      isVenuePage
    />
  );
}
