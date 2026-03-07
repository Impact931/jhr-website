import { getSSRSections } from '@/lib/ssr-content';
import { EditablePage } from '@/components/inline-editor/EditablePage';
import { EXSP_SECTIONS } from '@/content/schemas/exhibitors-sponsors';
import { ROICalculator } from '@/components/ui/ROICalculator';

// ============================================================================
// Static FAQ data for JSON-LD schema
// ============================================================================

const staticFaqs = [
  {
    question: "How does this drive booth traffic?",
    answer:
      "Professional headshots are universally valuable—everyone needs one for LinkedIn, company profiles, or speaking submissions. Attendees actively seek out booths offering headshots because they want what you're giving, not just a chance to spin a wheel.",
  },
  {
    question: "What data do we get from attendees?",
    answer:
      "At check-in, we capture name, email, phone, and company. Fields are customizable—you can add job title, specific interests, or qualification questions. Data flows to you in real-time during the event.",
  },
  {
    question: "How quickly do attendees receive their photos?",
    answer:
      "Within minutes. Attendees receive their AI-retouched, branded headshot via text or email before they leave your booth. This instant gratification creates a memorable positive experience associated with your brand.",
  },
  {
    question: "Can the photos be branded with our company?",
    answer:
      "Absolutely. We apply your logo, brand colors, and messaging to every image. When attendees share their new headshot on LinkedIn, your brand travels with it.",
  },
  {
    question: "How many people can you photograph in a day?",
    answer:
      "Our standard setup handles 300+ attendees per day. For high-traffic trade shows, we can scale to 500+ with premium configuration and additional staff.",
  },
];

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Headshot Activation for Exhibitors & Sponsors",
  description:
    "Professional headshot activation service for trade show exhibitors and sponsors. Drive booth traffic and capture qualified leads.",
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
  "advantage": "section-padding bg-jhr-black-light",
  "results": "section-padding bg-jhr-black-light",
};

export default async function ExhibitorsSponsorPage() {
  const sections = await getSSRSections('exhibitors-sponsors');
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
        pageSlug="exhibitors-sponsors"
        initialSections={sections}
        defaultSections={EXSP_SECTIONS}
        sectionClassMap={SECTION_CLASS_MAP}
      />
      {/* ROI Calculator - Static interactive component outside CMS */}
      <section className="section-padding section-light">
        <div className="section-container">
          <div className="text-center mb-12">
            <p className="text-jhr-gold-dark font-medium text-body-lg mb-2">Calculate Your ROI</p>
            <h2 className="text-display-sm font-display font-bold text-jhr-black mb-4">
              See the Value of Your Activation
            </h2>
            <p className="text-body-lg text-jhr-light-text-muted max-w-2xl mx-auto">
              Understand the lead generation and dwell time value a Headshot Activation brings to your booth.
            </p>
          </div>
          <ROICalculator variant="light" />
        </div>
      </section>
    </div>
  );
}
