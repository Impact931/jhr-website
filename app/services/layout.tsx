import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore JHR Photography's corporate event photography services including event coverage, headshot programs, headshot activations, and event video systems in Nashville.",
  openGraph: {
    title: "Services | JHR Photography",
    description:
      "Corporate event photography, headshot programs, headshot activations, and event video systems from Nashville's trusted photography partner.",
  },
};

const servicesStructuredData = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Service",
        name: "Corporate Event Coverage",
        description:
          "Professional photography for conferences, galas, trade shows, and corporate gatherings with editorial precision.",
        url: "https://jhr-photography.com/services/corporate-event-coverage",
        provider: {
          "@type": "ProfessionalService",
          name: "JHR Photography",
        },
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Service",
        name: "Corporate Headshot Program",
        description:
          "Scalable on-site corporate headshot programs with consistent quality and fast turnaround for teams and organizations.",
        url: "https://jhr-photography.com/services/corporate-headshot-program",
        provider: {
          "@type": "ProfessionalService",
          name: "JHR Photography",
        },
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "Service",
        name: "Headshot Activation",
        description:
          "On-site headshot activations for conferences and trade shows with professional results in under 5 minutes and instant digital delivery.",
        url: "https://jhr-photography.com/services/headshot-activation",
        provider: {
          "@type": "ProfessionalService",
          name: "JHR Photography",
        },
      },
    },
    {
      "@type": "ListItem",
      position: 4,
      item: {
        "@type": "Service",
        name: "Event Video Systems",
        description:
          "Professional event video production including live streaming, highlight reels, and multi-camera coverage for corporate events.",
        url: "https://jhr-photography.com/services/event-video-systems",
        provider: {
          "@type": "ProfessionalService",
          name: "JHR Photography",
        },
      },
    },
  ],
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(servicesStructuredData),
        }}
      />
      {children}
    </>
  );
}
