import { getSSRSections } from '@/lib/ssr-content';
import { EditablePage } from '@/components/inline-editor/EditablePage';
import {
  MUSIC_CITY_CENTER_SCHEMA,
} from '@/content/schemas/venue-detail';

const SECTION_CLASS_MAP: Record<string, string> = {
  "experience": "section-padding bg-jhr-black-light",
  "services": "section-padding bg-jhr-black-light",
};

export default async function MusicCityCenterPage() {
  const sections = await getSSRSections('music-city-center');
  return (
    <EditablePage
      pageSlug="music-city-center"
      initialSections={sections}
      defaultSections={MUSIC_CITY_CENTER_SCHEMA.sections}
      sectionClassMap={SECTION_CLASS_MAP}
      isVenuePage
    />
  );
}
