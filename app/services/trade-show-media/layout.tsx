import type { Metadata } from "next";
import {
  generateServiceSchema,
  generateBreadcrumbListSchema,
  serializeSchemas,
} from "@/lib/structured-data";

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
  }),
  generateBreadcrumbListSchema([
    { name: "Home", url: "/" },
    { name: "Services", url: "/services" },
    { name: "Trade-Show Media", url: "/services/trade-show-media" },
  ]),
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
