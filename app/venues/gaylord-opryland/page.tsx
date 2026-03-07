import { getSSRSections } from '@/lib/ssr-content';
import { EditablePage } from '@/components/inline-editor/EditablePage';
import {
  GAYLORD_OPRYLAND_SCHEMA,
} from '@/content/schemas/venue-detail';

const SECTION_CLASS_MAP: Record<string, string> = {
  "spaces": "section-padding bg-jhr-black-light",
};

export default async function GaylordOprylandPage() {
  const sections = await getSSRSections('gaylord-opryland');
  return (
    <EditablePage
      pageSlug="gaylord-opryland"
      initialSections={sections}
      defaultSections={GAYLORD_OPRYLAND_SCHEMA.sections}
      sectionClassMap={SECTION_CLASS_MAP}
      isVenuePage
    />
  );
}
