import { getSSRSections } from '@/lib/ssr-content';
import { EditablePage } from '@/components/inline-editor/EditablePage';
import { ASSOC_SECTIONS } from '@/content/schemas/associations';

// ============================================================================
// Static FAQ data for JSON-LD schema
// ============================================================================

const staticFaqs = [
  {
    question: "How do headshots work as a member benefit?",
    answer:
      "We set up a Headshot Activation station at your conference where members can receive a complimentary professional headshot. It's branded to your association, delivered instantly, and creates a memorable experience that members talk about.",
  },
  {
    question: "Can you handle multi-day conferences?",
    answer:
      "Multi-day events are our specialty. We maintain the same team throughout, establish consistent workflows, and deliver rolling galleries so you have content each day. Our stamina across 3-5 day conferences is what association planners appreciate most.",
  },
  {
    question: "How do you handle awards ceremonies?",
    answer:
      "We understand these moments matter to recipients. We coordinate shot lists in advance, position for optimal angles, and deliver images quickly so winners can share their recognition while the excitement is fresh.",
  },
  {
    question: "What about speaker documentation?",
    answer:
      "We capture keynotes, breakouts, and panel discussions. Images are delivered quickly for social media use during the conference and post-event marketing.",
  },
  {
    question: "How can photos support stakeholder reporting?",
    answer:
      "A well-curated gallery demonstrates conference value better than any spreadsheet. We provide images that show engaged attendees, packed sessions, and meaningful interactions—visual proof of a successful event.",
  },
];

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Event Photography for Associations & Conferences",
  description:
    "JHR Photography partners with associations to document conferences and provide member-centric photography services.",
  provider: {
    "@type": "Organization",
    name: "JHR Photography",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: staticFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

const SECTION_CLASS_MAP: Record<string, string> = {
  "outcomes": "section-padding bg-jhr-black-light",
  "nashville-expertise": "section-padding bg-jhr-black-light",
};

export default async function AssociationsPage() {
  const sections = await getSSRSections('associations');
  return (
    <div className="pt-16 lg:pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <EditablePage
        pageSlug="associations"
        initialSections={sections}
        defaultSections={ASSOC_SECTIONS}
        sectionClassMap={SECTION_CLASS_MAP}
      />
    </div>
  );
}
