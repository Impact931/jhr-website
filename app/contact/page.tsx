import { getSSRSections } from '@/lib/ssr-content';
import { EditablePage } from '@/components/inline-editor/EditablePage';
import { CONTACT_SECTIONS } from '@/content/schemas/contact';
import { ContactForm } from './ContactForm';

const SECTION_CLASS_MAP: Record<string, string> = {};

export default async function ContactPage() {
  const sections = await getSSRSections('contact');
  return (
    <div>
      <EditablePage
        pageSlug="contact"
        initialSections={sections}
        defaultSections={CONTACT_SECTIONS}
        sectionClassMap={SECTION_CLASS_MAP}
      />
      {/* Contact form - always rendered below editable sections */}
      <ContactForm />
    </div>
  );
}
