import type { Metadata } from "next";
import { generateServiceSchema, serializeSchemas } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Convention Media Services",
  description:
    "Professional convention and conference media coverage in Nashville. Multi-day documentation, same-day highlights, and comprehensive media libraries by JHR Photography.",
  openGraph: {
    title: "Convention Media Services | JHR Photography",
    description:
      "Professional convention media coverage for multi-day conferences and large-scale events in Nashville.",
  },
};

const serviceSchema = generateServiceSchema({
  name: "Convention Media Services",
  description:
    "Comprehensive multi-day convention and conference media coverage. Same-day highlights, speaker documentation, exhibitor photography, and searchable media libraries.",
  url: "/services/convention-media",
  serviceTypes: [
    "Convention Photography",
    "Conference Media Coverage",
    "Multi-Day Event Photography",
    "Convention Videography",
  ],
});

export default function ConventionMediaLayout({
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
