import { getSSRSections } from '@/lib/ssr-content';
import { EditablePage } from '@/components/inline-editor/EditablePage';
import { VSOL_SECTIONS } from '@/content/schemas/venues-solution';

// ============================================================================
// Static FAQ data for JSON-LD schema
// ============================================================================

const staticFaqs = [
  {
    question: "Are you familiar with venue vendor requirements?",
    answer:
      "Yes. We understand EAC processes, insurance requirements, load-in procedures, and union considerations for Nashville's major venues. We handle our paperwork and coordinate with venue contacts as needed.",
  },
  {
    question: "Can you be added to our preferred vendor list?",
    answer:
      "Absolutely. We'd welcome the opportunity to discuss our qualifications and how we can serve your clients. We can provide insurance certificates, references, and portfolio samples.",
  },
  {
    question: "How do you coordinate with venue staff?",
    answer:
      "We arrive early, introduce ourselves to key personnel, and establish clear communication protocols. We're experienced working alongside AV teams, catering staff, and venue operations. We fit into your ecosystem—not the other way around.",
  },
  {
    question: "What if a client needs last-minute photography?",
    answer:
      "We understand events change. While we prefer advance booking, we can often accommodate last-minute needs. Contact us and we'll do our best to help your client.",
  },
  {
    question: "Do you photograph the venue itself for marketing purposes?",
    answer:
      "Yes. We can provide venue photography for your marketing materials—both empty space documentation and event-in-progress images that show your venue at its best.",
  },
];

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Photography Services for Venue Coordinators",
  description:
    "JHR Photography partners with Nashville venues as a preferred photography vendor.",
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
  "venue-experience": "section-padding bg-jhr-black-light",
};

export default async function VenueCoordinatorsPage() {
  const sections = await getSSRSections('venues-solution');
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
        pageSlug="venues-solution"
        initialSections={sections}
        defaultSections={VSOL_SECTIONS}
        sectionClassMap={SECTION_CLASS_MAP}
      />
    </div>
  );
}
