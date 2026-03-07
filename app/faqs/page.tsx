import { getSSRSections } from '@/lib/ssr-content';
import { EditablePage } from '@/components/inline-editor/EditablePage';
import { FAQS_SECTIONS } from '@/content/schemas/faqs';

export default async function FAQsPage() {
  const sections = await getSSRSections('faqs');
  return (
    <EditablePage
      pageSlug="faqs"
      initialSections={sections}
      defaultSections={FAQS_SECTIONS}
    />
  );
}
