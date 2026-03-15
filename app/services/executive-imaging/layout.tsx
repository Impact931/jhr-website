import type { Metadata } from "next";
import {
  generateServiceSchema,
  generateBreadcrumbListSchema,
  serializeSchemas,
} from "@/lib/structured-data";
import type { StructuredDataSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Executive Headshots Nashville | C-Suite & Leadership Portraits",
  description:
    "Professional executive headshots and group imaging for leadership teams in Nashville. Aligned to brand standards with AI-accelerated delivery by JHR Photography.",
  openGraph: {
    title: "Executive Imaging | JHR Photography",
    description:
      "Professional executive headshots and group imaging sessions. On-site convenience, brand-aligned results, and AI-accelerated delivery.",
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
        name: "How long does each executive headshot session take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Individual executive sessions take approximately 10 to 15 minutes, including multiple poses and on-screen selection. For group programs with 16 or more team members, sessions are scheduled in efficient time slots to keep things moving smoothly while maintaining individual quality.",
        },
      },
      {
        "@type": "Question",
        name: "Can you match our company brand guidelines for headshots?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely. Before the session, JHR Photography reviews your brand standards including preferred backgrounds, lighting style, and any specific requirements. Every headshot is aligned to your established look so the entire leadership team has a consistent, brand-cohesive professional presence.",
        },
      },
      {
        "@type": "Question",
        name: "Do you come to our office for executive headshots?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. JHR Photography brings the complete studio setup to your location in Nashville or anywhere nationwide. We need approximately a 15x15 foot space. We bring all equipment including lights, backdrop, and everything else. Your team gets professional results without leaving the office.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between Executive Imaging and a Headshot Activation?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Executive Imaging is a dedicated headshot session for leadership teams of 1 to 50+ people, with personalized direction, multiple poses, and brand alignment. A Headshot Activation is a high-volume engagement system for trade shows and events designed to drive booth traffic and capture leads. Both deliver professional-quality headshots but serve different purposes.",
        },
      },
      {
        "@type": "Question",
        name: "How quickly are executive headshots delivered?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Edited executive headshots are delivered within 5 to 7 business days. All images are professionally retouched with AI-enhanced processing and formatted ready for use across websites, LinkedIn profiles, internal communications, and marketing materials. Rush delivery is available upon request.",
        },
      },
    ],
  },
};

const schemas = [
  generateServiceSchema({
    name: "Executive Imaging",
    description:
      "Professional executive headshots and group imaging for leadership teams. On-site sessions aligned to brand standards with AI-accelerated retouching and delivery.",
    url: "/services/executive-imaging",
    serviceTypes: [
      "Executive Headshot Photography",
      "Corporate Portrait Photography",
      "Leadership Team Photography",
      "Brand-Aligned Headshots",
    ],
    startingPrice: 1500,
  }),
  generateBreadcrumbListSchema([
    { name: "Home", url: "/" },
    { name: "Services", url: "/services" },
    { name: "Executive Imaging", url: "/services/executive-imaging" },
  ]),
  faqSchema,
];

export default function ExecutiveImagingLayout({
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
