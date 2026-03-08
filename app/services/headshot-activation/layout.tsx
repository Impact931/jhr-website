import type { Metadata } from "next";
import {
  generateServiceSchema,
  generateProductSchema,
  generateBreadcrumbListSchema,
  serializeSchemas,
} from "@/lib/structured-data";
import type { StructuredDataSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Headshot Activation for Conferences & Trade Shows | Nashville",
  description:
    "On-site headshot activations for conferences and trade shows in Nashville. Professional headshots delivered in under 5 minutes with instant digital delivery by JHR Photography.",
  openGraph: {
    title: "Headshot Activation | JHR Photography",
    description:
      "On-site headshot activations with professional results in under 5 minutes and instant digital delivery for conferences and events.",
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
        name: "What is a headshot activation and how does it work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A Headshot Activation is a turnkey, on-site professional headshot experience deployed at your trade show booth, conference, or corporate event. JHR Photography brings professional lighting, a Camera Ready Touchup Service, live image selection, and direct-to-attendee delivery. Each attendee receives a polished, retouched headshot within minutes.",
        },
      },
      {
        "@type": "Question",
        name: "How many headshots can you produce in a day?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A single JHR operator can comfortably handle 100 to 150 attendees in a full-day activation. For higher-volume events, additional operators are added to increase throughput without sacrificing quality. The average dwell time per attendee is approximately 5 minutes.",
        },
      },
      {
        "@type": "Question",
        name: "Does the headshot activation include lead capture?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Every headshot captured includes integrated lead capture. Contact data is collected seamlessly as part of the experience and can be delivered to your sales team in real time. The system integrates with most standard CRM platforms and event lead retrieval systems.",
        },
      },
      {
        "@type": "Question",
        name: "Can you brand the headshot activation with our company identity?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Absolutely. Every touchpoint is white-labeled to your brand. The delivery gallery, email notifications, and image overlays all carry your logo and brand colors. When attendees share their headshots on LinkedIn, your brand travels with them.",
        },
      },
      {
        "@type": "Question",
        name: "What is the Camera Ready Touchup Service?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The Camera Ready Touchup Service is a professional hair and makeup touchup provided on-site for every attendee. A dedicated touchup artist is present for the full activation day, ensuring every person feels confident before stepping in front of the camera. This service is included with every Headshot Activation.",
        },
      },
    ],
  },
};

const schemas = [
  generateServiceSchema({
    name: "Headshot Activation",
    description:
      "On-site headshot activation stations for conferences, trade shows, and corporate events. Professional headshots in under 5 minutes with AI-retouched instant digital delivery.",
    url: "/services/headshot-activation",
    serviceTypes: [
      "Professional Headshot Photography",
      "On-Site Headshot Station",
      "Event Headshot Activation",
      "Corporate Headshots",
    ],
  }),
  generateProductSchema({
    name: "Headshot Activation",
    description:
      "A turnkey, on-site professional headshot experience for trade shows, conferences, and corporate events. Includes professional lighting, Camera Ready Touchup Service, live image selection, integrated lead capture, and direct-to-attendee delivery. Process 150+ attendees per day with white-label branding.",
    url: "/services/headshot-activation",
    image: "/images/generated/service-headshot-activation.jpg",
    category: "Event Photography Services",
  }),
  generateBreadcrumbListSchema([
    { name: "Home", url: "/" },
    { name: "Services", url: "/services" },
    { name: "Headshot Activation", url: "/services/headshot-activation" },
  ]),
  faqSchema,
];

export default function HeadshotActivationLayout({
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
