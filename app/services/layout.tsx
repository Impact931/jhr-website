import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Professional event media services in Nashville. Corporate event coverage, convention media, trade-show documentation, headshot activations, executive imaging, and event video systems.",
  openGraph: {
    title: "Services | JHR Photography",
    description:
      "The right media partner for what you're planning. Explore our event media services designed around the situations event professionals actually face.",
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
          "Professional photography for conferences, summits, and corporate meetings with same-day delivery.",
        url: "https://jhr-photography.com/services/corporate-event-coverage",
        provider: { "@type": "ProfessionalService", name: "JHR Photography" },
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Service",
        name: "Convention Media Services",
        description:
          "Multi-day convention and conference media coverage with comprehensive documentation and same-day highlights.",
        url: "https://jhr-photography.com/services/convention-media",
        provider: { "@type": "ProfessionalService", name: "JHR Photography" },
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "Service",
        name: "Trade-Show Media Services",
        description:
          "Comprehensive trade show photography and media documentation for organizers, exhibitors, and venue partners.",
        url: "https://jhr-photography.com/services/trade-show-media",
        provider: { "@type": "ProfessionalService", name: "JHR Photography" },
      },
    },
    {
      "@type": "ListItem",
      position: 4,
      item: {
        "@type": "Service",
        name: "Headshot Activation",
        description:
          "On-site headshot activations for conferences and trade shows with professional results in under 5 minutes and instant digital delivery.",
        url: "https://jhr-photography.com/services/headshot-activation",
        provider: { "@type": "ProfessionalService", name: "JHR Photography" },
      },
    },
    {
      "@type": "ListItem",
      position: 5,
      item: {
        "@type": "Service",
        name: "Executive Imaging",
        description:
          "Professional executive headshots and group imaging for leadership teams, aligned to brand standards with AI-accelerated delivery.",
        url: "https://jhr-photography.com/services/executive-imaging",
        provider: { "@type": "ProfessionalService", name: "JHR Photography" },
      },
    },
    {
      "@type": "ListItem",
      position: 6,
      item: {
        "@type": "Service",
        name: "Social & Networking Event Media",
        description:
          "Social-first media coverage for networking events, cocktail hours, receptions, and community gatherings.",
        url: "https://jhr-photography.com/services/social-networking-media",
        provider: { "@type": "ProfessionalService", name: "JHR Photography" },
      },
    },
    {
      "@type": "ListItem",
      position: 7,
      item: {
        "@type": "Service",
        name: "Event Video Systems",
        description:
          "Professional event video production including highlight reels, executive stories, and social-ready content.",
        url: "https://jhr-photography.com/services/event-video-systems",
        provider: { "@type": "ProfessionalService", name: "JHR Photography" },
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
