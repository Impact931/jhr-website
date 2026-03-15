import type { Metadata } from "next";
import {
  generateServiceSchema,
  generateBreadcrumbListSchema,
  serializeSchemas,
} from "@/lib/structured-data";
import type { StructuredDataSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Nashville Corporate Event Photographer | Conference & Meeting Coverage",
  description:
    "Professional corporate event photography in Nashville. Conferences, galas, trade shows, and corporate gatherings captured with editorial precision by JHR Photography.",
  openGraph: {
    title: "Corporate Event Coverage | JHR Photography",
    description:
      "Professional corporate event photography for conferences, galas, trade shows, and corporate gatherings in Nashville and nationwide.",
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
        name: "What is included in corporate event photography coverage?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "JHR Photography's Corporate Event Coverage includes a certified operator for the full day, keynote and general session documentation, breakout and workshop coverage, networking and candid photography, sponsor and brand imaging, same-day highlight delivery (5-10 curated images), a full curated gallery within 72 hours, and a standard commercial license for all delivered images.",
        },
      },
      {
        "@type": "Question",
        name: "How quickly do we receive photos from our corporate event?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Same-day highlights consisting of 5 to 10 curated images are delivered during or immediately after each day's programming for real-time social media posting. Your full curated gallery is delivered within 72 hours of event completion. For multi-day events, day-by-day galleries can be provided.",
        },
      },
      {
        "@type": "Question",
        name: "Can you cover multi-day conferences with concurrent sessions?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. For events with concurrent programming, JHR deploys additional certified operators so sessions happening simultaneously all receive professional coverage. You receive a single unified gallery, not separate deliveries from separate photographers. We coordinate through one team for consistent quality across all days.",
        },
      },
      {
        "@type": "Question",
        name: "What Nashville venues do you work in for corporate events?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "JHR Photography has covered corporate events at virtually every major Nashville venue including Gaylord Opryland, Music City Center, Renaissance Nashville, JW Marriott, Grand Hyatt, Omni Nashville, and Loews Vanderbilt. We know the layouts, lighting conditions, load-in logistics, and venue staff at each location.",
        },
      },
      {
        "@type": "Question",
        name: "Do you also offer video coverage for corporate events?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. JHR offers Event Video Systems that pair directly with photography coverage, including highlight reels, attendee testimonials, and dedicated executive interview production. When bundled, photography and video are coordinated by a single team with a unified delivery timeline, ensuring consistent quality across all media.",
        },
      },
    ],
  },
};

const schemas = [
  generateServiceSchema({
    name: "Corporate Event Coverage",
    description:
      "Professional corporate event photography for conferences, galas, award ceremonies, and corporate gatherings. Editorial-quality documentation with same-day delivery.",
    url: "/services/corporate-event-coverage",
    serviceTypes: [
      "Corporate Event Photography",
      "Conference Photography",
      "Gala Photography",
      "Award Ceremony Photography",
    ],
    startingPrice: 2500,
  }),
  generateBreadcrumbListSchema([
    { name: "Home", url: "/" },
    { name: "Services", url: "/services" },
    { name: "Corporate Event Coverage", url: "/services/corporate-event-coverage" },
  ]),
  faqSchema,
];

export default function CorporateEventCoverageLayout({
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
