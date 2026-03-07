import { getSSRSections } from '@/lib/ssr-content';
import { EditablePage } from '@/components/inline-editor/EditablePage';
import {
  BELMONT_UNIVERSITY_SCHEMA,
} from '@/content/schemas/venue-detail';

const SECTION_CLASS_MAP: Record<string, string> = {
  experience: "section-padding bg-jhr-black-light",
  services: "section-padding bg-jhr-black-light",
};

export default async function BelmontUniversityPage() {
  const sections = await getSSRSections('belmont-university');
  return (
    <EditablePage
      pageSlug="belmont-university"
      initialSections={sections}
      defaultSections={BELMONT_UNIVERSITY_SCHEMA.sections}
      sectionClassMap={SECTION_CLASS_MAP}
      isVenuePage
    />
  );
}
