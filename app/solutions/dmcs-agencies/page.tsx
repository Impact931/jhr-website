import { getSSRSections } from '@/lib/ssr-content';
import { EditablePage } from '@/components/inline-editor/EditablePage';
import { DMC_SECTIONS } from '@/content/schemas/dmcs-agencies';

// ============================================================================
// Static FAQ data for JSON-LD schema
// ============================================================================

const staticFaqs = [
  {
    question: "How do you handle EAC requirements?",
    answer:
      "We're experienced with Nashville's major venues and understand EAC (Exhibitor Appointed Contractor) processes completely. We handle our own paperwork, carry appropriate insurance, and coordinate directly with venue contacts as needed.",
  },
  {
    question: "Can you work on tight timelines?",
    answer:
      "Yes. We understand that DMCs often receive final requirements close to event dates. We can typically accommodate last-minute additions or changes as long as we have clear communication about priorities.",
  },
  {
    question: "Do you have experience with high-profile corporate clients?",
    answer:
      "Yes. We've worked with DMCs supporting Fortune 500 companies, national associations, and high-stakes corporate events. We understand discretion, professionalism, and the stakes involved.",
  },
  {
    question: "How do you handle communication during events?",
    answer:
      "We establish clear communication protocols before the event. You'll have direct contact with our lead photographer, and we provide updates as needed throughout the event without requiring constant oversight.",
  },
];

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Event Photography for DMCs & Agencies",
  description:
    "JHR Photography partners with DMCs and agencies managing corporate events in Nashville.",
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
  "partnership": "section-padding bg-jhr-black-light",
};

export default async function DMCsAgenciesPage() {
  const sections = await getSSRSections('dmcs-agencies');
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
        pageSlug="dmcs-agencies"
        initialSections={sections}
        defaultSections={DMC_SECTIONS}
        sectionClassMap={SECTION_CLASS_MAP}
      />
    </div>
  );
}
