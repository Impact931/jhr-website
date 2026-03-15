import type { Metadata } from "next";
import {
  generateServiceSchema,
  generateBreadcrumbListSchema,
  serializeSchemas,
} from "@/lib/structured-data";
import type { StructuredDataSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Nashville Trade Show Photographer | Booth & Convention Media Coverage",
  description:
    "Professional trade show photography and media coverage in Nashville. Booth documentation, exhibitor activations, and sponsor deliverables by JHR Photography.",
  openGraph: {
    title: "Trade-Show Media Services | JHR Photography",
    description:
      "Comprehensive trade show media coverage for organizers, exhibitors, and venue partners in Nashville.",
  },
};

const faqSchema: StructuredDataSchema = {
  type: "FAQPage",
  data: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Do you photograph individual exhibitor booths at trade shows?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. JHR Photography systematically photographs every exhibitor booth, creating individual asset packages that exhibitors can use for their own post-show marketing. This is a high-value deliverable that strengthens exhibitor relationships and supports sponsor renewal conversations.",
        },
      },
      {
        "@type": "Question",
        name: "Can you deliver photos during the trade show?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely. JHR provides same-day edited highlights ready for social media, press releases, and sponsor communications within hours. For multi-day shows, rolling deliveries provide usable content each day so your marketing team can post while the event is still trending.",
        },
      },
      {
        "@type": "Question",
        name: "How do you handle multi-day trade shows?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We maintain the same team throughout the entire show, ensuring consistency and familiarity with your exhibitors and venue. Rolling deliveries provide usable content each day, and the final curated gallery covers the complete arc of the event from setup through teardown.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between trade show coverage and corporate event coverage?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Trade show coverage is designed around exhibitor and sponsor deliverables, booth documentation, and show floor energy. Corporate event coverage focuses on keynotes, sessions, and organizational storytelling. Many events benefit from both services, and JHR can bundle them with a single coordinated team.",
        },
      },
      {
        "@type": "Question",
        name: "Can you add headshot activations to our trade show?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, this is one of JHR Photography's most popular service pairings. A Headshot Activation deployed at your booth drives attendee traffic, captures qualified leads through integrated lead capture, and gives attendees immediate professional value. The activation creates extended dwell time averaging 5+ minutes per attendee.",
        },
      },
    ],
  },
};

const schemas = [
  generateServiceSchema({
    name: "Trade-Show Media Services",
    description:
      "Professional trade show photography and media coverage. Booth documentation, exhibitor activations, sponsor deliverables, and show floor highlights.",
    url: "/services/trade-show-media",
    serviceTypes: [
      "Trade Show Photography",
      "Exhibitor Photography",
      "Booth Documentation",
      "Trade Show Videography",
    ],
    startingPrice: 2500,
  }),
  generateBreadcrumbListSchema([
    { name: "Home", url: "/" },
    { name: "Services", url: "/services" },
    { name: "Trade-Show Media", url: "/services/trade-show-media" },
  ]),
  faqSchema,
];

export default function TradeShowMediaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {serializeSchemas(schemas).map((json, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: json }}
        />
      ))}
      {children}
    </>
  );
}
