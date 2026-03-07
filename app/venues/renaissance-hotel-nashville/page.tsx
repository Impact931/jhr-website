import { getSSRSections } from '@/lib/ssr-content';
import { EditablePage } from '@/components/inline-editor/EditablePage';
import {
  RENAISSANCE_HOTEL_SCHEMA,
} from '@/content/schemas/venue-detail';

const SECTION_CLASS_MAP: Record<string, string> = {
  experience: "section-padding bg-jhr-black-light",
  services: "section-padding bg-jhr-black-light",
};

export default async function RenaissanceHotelPage() {
  const sections = await getSSRSections('renaissance-hotel-nashville');
  return (
    <EditablePage
      pageSlug="renaissance-hotel-nashville"
      initialSections={sections}
      defaultSections={RENAISSANCE_HOTEL_SCHEMA.sections}
      sectionClassMap={SECTION_CLASS_MAP}
      isVenuePage
    />
  );
}
