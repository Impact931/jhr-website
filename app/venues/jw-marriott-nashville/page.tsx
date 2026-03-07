import { getSSRSections } from '@/lib/ssr-content';
import { EditablePage } from '@/components/inline-editor/EditablePage';
import {
  JW_MARRIOTT_SCHEMA,
} from '@/content/schemas/venue-detail';

const SECTION_CLASS_MAP: Record<string, string> = {
  experience: "section-padding bg-jhr-black-light",
  services: "section-padding bg-jhr-black-light",
};

export default async function JWMarriottPage() {
  const sections = await getSSRSections('jw-marriott-nashville');
  return (
    <EditablePage
      pageSlug="jw-marriott-nashville"
      initialSections={sections}
      defaultSections={JW_MARRIOTT_SCHEMA.sections}
      sectionClassMap={SECTION_CLASS_MAP}
      isVenuePage
    />
  );
}
