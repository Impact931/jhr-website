import { getSSRSections } from '@/lib/ssr-content';
import { EditablePage } from '@/components/inline-editor/EditablePage';
import { ABOUT_SECTIONS } from '@/content/schemas/about';

const SECTION_CLASS_MAP: Record<string, string> = {
  "guide": "section-padding bg-jhr-black",
  "mission": "section-padding bg-jhr-black-light",
  "values": "section-padding bg-jhr-black",
  "why-jhr": "section-padding bg-jhr-black-light",
  "team-link": "section-padding bg-jhr-black",
};

export default async function AboutPage() {
  const sections = await getSSRSections('about');
  return (
    <EditablePage
      pageSlug="about"
      initialSections={sections}
      defaultSections={ABOUT_SECTIONS}
      sectionClassMap={SECTION_CLASS_MAP}
    />
  );
}
