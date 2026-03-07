import { getSSRSections } from '@/lib/ssr-content';
import { EditablePage } from '@/components/inline-editor/EditablePage';
import {
  CITY_WINERY_SCHEMA,
} from '@/content/schemas/venue-detail';

const SECTION_CLASS_MAP: Record<string, string> = {
  experience: "section-padding bg-jhr-black-light",
  services: "section-padding bg-jhr-black-light",
};

export default async function CityWineryPage() {
  const sections = await getSSRSections('city-winery-nashville');
  return (
    <EditablePage
      pageSlug="city-winery-nashville"
      initialSections={sections}
      defaultSections={CITY_WINERY_SCHEMA.sections}
      sectionClassMap={SECTION_CLASS_MAP}
      isVenuePage
    />
  );
}
