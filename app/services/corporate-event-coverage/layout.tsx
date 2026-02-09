import type { Metadata } from "next";
import { generateServiceSchema, serializeSchemas } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Corporate Event Coverage",
  description:
    "Professional corporate event photography in Nashville. Conferences, galas, trade shows, and corporate gatherings captured with editorial precision by JHR Photography.",
  openGraph: {
    title: "Corporate Event Coverage | JHR Photography",
    description:
      "Professional corporate event photography for conferences, galas, trade shows, and corporate gatherings in Nashville and nationwide.",
  },
};

const serviceSchema = generateServiceSchema({
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
});

export default function CorporateEventCoverageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {serializeSchemas([serviceSchema]).map((json, i) => (
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
