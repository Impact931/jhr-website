import type { Metadata } from "next";
import { generateServiceSchema, serializeSchemas } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Trade-Show Media Services",
  description:
    "Professional trade show photography and media coverage in Nashville. Booth documentation, exhibitor activations, and sponsor deliverables by JHR Photography.",
  openGraph: {
    title: "Trade-Show Media Services | JHR Photography",
    description:
      "Comprehensive trade show media coverage for organizers, exhibitors, and venue partners in Nashville.",
  },
};

const serviceSchema = generateServiceSchema({
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
});

export default function TradeShowMediaLayout({
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
