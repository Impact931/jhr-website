import { getSSRSections } from '@/lib/ssr-content';
import { EditablePage } from '@/components/inline-editor/EditablePage';
import { SNM_SECTIONS } from '@/content/schemas/social-networking-media';

const SECTION_CLASS_MAP: Record<string, string> = {
  "stats": "section-padding-sm bg-[#0B0C0F]",
  "problem": "section-padding section-light",
  "solution": "section-padding section-light",
  "use-cases": "section-padding bg-[#0B0C0F]",
  "whats-included": "section-padding section-light",
  "video-pairing": "section-padding bg-[#0B0C0F]",
  "social-proof": "section-padding bg-[#0B0C0F]",
  "faqs": "section-padding section-light",
  "final-cta": "section-padding bg-[#0B0C0F]",
};

export default async function SocialNetworkingMediaPage() {
  const sections = await getSSRSections('social-networking-media');
  return (
    <EditablePage
      pageSlug="social-networking-media"
      initialSections={sections}
      defaultSections={SNM_SECTIONS}
      sectionClassMap={SECTION_CLASS_MAP}
    />
  );
}
