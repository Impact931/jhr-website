import type { Metadata } from "next";
import { generateServiceSchema, serializeSchemas } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Executive Imaging",
  description:
    "Professional executive headshots and group imaging for leadership teams in Nashville. Aligned to brand standards with AI-accelerated delivery by JHR Photography.",
  openGraph: {
    title: "Executive Imaging | JHR Photography",
    description:
      "Professional executive headshots and group imaging sessions. On-site convenience, brand-aligned results, and AI-accelerated delivery.",
  },
};

const serviceSchema = generateServiceSchema({
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
});

export default function ExecutiveImagingLayout({
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
