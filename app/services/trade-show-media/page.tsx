import { getSSRSections } from '@/lib/ssr-content';
import { EditablePage } from '@/components/inline-editor/EditablePage';
import { TSM_SECTIONS } from '@/content/schemas/trade-show-media';

const SECTION_CLASS_MAP: Record<string, string> = {
  "problem": "section-padding section-light",
  "solution": "section-padding bg-[#0B0C0F]",
  "whats-included": "section-padding section-light",
  "video-pairing": "section-padding bg-[#0B0C0F]",
  "exhibitor-crossover": "section-padding section-light",
  "social-proof": "section-padding bg-[#0B0C0F]",
  "faqs": "section-padding section-light",
  "final-cta": "section-padding bg-[#0B0C0F]",
};

export default async function TradeShowMediaPage() {
  const sections = await getSSRSections('trade-show-media');
  return (
    <EditablePage
      pageSlug="trade-show-media"
      initialSections={sections}
      defaultSections={TSM_SECTIONS}
      sectionClassMap={SECTION_CLASS_MAP}
    />
  );
}
