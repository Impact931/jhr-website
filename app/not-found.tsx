import { getSSRSections } from '@/lib/ssr-content';
import { EditablePage } from '@/components/inline-editor/EditablePage';
import { NOT_FOUND_SECTIONS } from '@/content/schemas/not-found';

const SECTION_CLASS_MAP: Record<string, string> = {
  hero: "min-h-[60vh]",
  nav: "section-padding bg-jhr-black-light",
};

export default async function NotFoundPage() {
  const sections = await getSSRSections('not-found');
  return (
    <EditablePage
      pageSlug="not-found"
      initialSections={sections}
      defaultSections={NOT_FOUND_SECTIONS}
      sectionClassMap={SECTION_CLASS_MAP}
    />
  );
}
