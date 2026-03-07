import { getSSRSections } from '@/lib/ssr-content';
import { EditablePage } from '@/components/inline-editor/EditablePage';
import {
  OMNI_HOTEL_SCHEMA,
} from '@/content/schemas/venue-detail';

const SECTION_CLASS_MAP: Record<string, string> = {
  experience: "section-padding bg-jhr-black-light",
  services: "section-padding bg-jhr-black-light",
};

export default async function OmniHotelPage() {
  const sections = await getSSRSections('omni-hotel-nashville');
  return (
    <EditablePage
      pageSlug="omni-hotel-nashville"
      initialSections={sections}
      defaultSections={OMNI_HOTEL_SCHEMA.sections}
      sectionClassMap={SECTION_CLASS_MAP}
      isVenuePage
    />
  );
}
