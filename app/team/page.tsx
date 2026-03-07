import { getSSRSections } from '@/lib/ssr-content';
import { EditablePage } from '@/components/inline-editor/EditablePage';
import { TEAM_SECTIONS } from '@/content/schemas/team';

const SECTION_CLASS_MAP: Record<string, string> = {
  "team-overview": "section-padding bg-jhr-black-light",
  "team": "section-padding bg-jhr-black",
  "operator-program": "section-padding bg-jhr-black-light",
  "stats": "section-padding bg-jhr-black",
  "team-cta": "section-padding bg-jhr-black-light",
};

export default async function TeamPage() {
  const sections = await getSSRSections('team');
  return (
    <EditablePage
      pageSlug="team"
      initialSections={sections}
      defaultSections={TEAM_SECTIONS}
      sectionClassMap={SECTION_CLASS_MAP}
    />
  );
}
