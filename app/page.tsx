import { getSSRSections } from '@/lib/ssr-content';
import { EditablePage } from '@/components/inline-editor/EditablePage';
import { HOME_SECTIONS } from '@/content/schemas/home';

const SECTION_CLASS_MAP: Record<string, string> = {
  "trust-badges": "section-padding bg-jhr-black",
  "icp-routing": "section-padding bg-jhr-black-light",
  "process": "section-padding bg-jhr-black",
  "social-proof": "section-padding section-light",
};

export default async function HomePage() {
  const sections = await getSSRSections('home');
  return (
    <EditablePage
      pageSlug="home"
      initialSections={sections}
      defaultSections={HOME_SECTIONS}
      sectionClassMap={SECTION_CLASS_MAP}
    />
  );
}
