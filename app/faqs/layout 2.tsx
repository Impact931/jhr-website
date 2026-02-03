import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about JHR Photography services, headshot activations, event coverage, logistics, and pricing for corporate events in Nashville.",
  openGraph: {
    title: "FAQs | JHR Photography",
    description:
      "Find answers about corporate event photography, headshot activations, logistics, and pricing from JHR Photography.",
  },
};

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What makes JHR different from other event photographers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We operate as a logistics-first media partner, not just a creative service. Our background in high-stakes operations means we bring agency-grade planning, redundant equipment, and professional protocols to every event.",
      },
    },
    {
      "@type": "Question",
      name: "What areas do you serve?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We're based in Nashville and serve events throughout Middle Tennessee. For national conferences and trade shows, we work with clients flying in from across the country who need a reliable local partner.",
      },
    },
    {
      "@type": "Question",
      name: "How far in advance should I book?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For large conferences and trade shows, we recommend reaching out 2-3 months in advance. For smaller corporate events, 4-6 weeks is typically sufficient.",
      },
    },
    {
      "@type": "Question",
      name: "How many attendees can you photograph in a day?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our standard Headshot Activation setup can process 300+ attendees per day. For high-volume events, we can scale to 500+ with our premium configuration and additional staff.",
      },
    },
    {
      "@type": "Question",
      name: "How quickly are photos delivered?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Attendees receive their AI-retouched, branded images within minutes of their session. The delivery is instant — directly to their phone via text or email.",
      },
    },
    {
      "@type": "Question",
      name: "Do you offer same-day delivery?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. For event coverage, we offer same-day delivery of edited highlights — typically 20-50 images selected and processed within hours of the event's conclusion.",
      },
    },
    {
      "@type": "Question",
      name: "What's included in corporate event coverage?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our coverage includes arrival/setup documentation, keynote and breakout session photography, candid networking moments, exhibitor and sponsor coverage, and VIP interactions.",
      },
    },
    {
      "@type": "Question",
      name: "Are you familiar with venue-specific requirements?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. We're well-versed in the operational requirements of Nashville's major venues. We handle EAC paperwork, understand marshaling yard procedures, carry appropriate insurance, and know the contact protocols for each property.",
      },
    },
    {
      "@type": "Question",
      name: "How does your pricing work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We price based on outcomes, not hours. Each service is a productized offering with clear deliverables. After our strategy call, we provide a detailed proposal specific to your event.",
      },
    },
    {
      "@type": "Question",
      name: "Do you require a deposit?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We require a 50% deposit to secure your date, with the balance due before the event.",
      },
    },
  ],
};

export default function FAQsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData),
        }}
      />
      {children}
    </>
  );
}
