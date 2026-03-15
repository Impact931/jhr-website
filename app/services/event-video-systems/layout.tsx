import type { Metadata } from "next";
import {
  generateServiceSchema,
  generateBreadcrumbListSchema,
  serializeSchemas,
} from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Event Video Production Nashville | Live Streaming & Highlight Reels",
  description:
    "Professional event video systems for corporate conferences and trade shows in Nashville. Live streaming, highlight reels, and multi-camera production by JHR Photography.",
  openGraph: {
    title: "Event Video Systems | JHR Photography",
    description:
      "Professional event video production including live streaming, highlight reels, and multi-camera coverage for corporate events.",
  },
};

const schemas = [
  generateServiceSchema({
    name: "Event Video Systems",
    description:
      "Professional event video production for corporate conferences and trade shows. Live streaming, multi-camera capture, highlight reels, and speaker session recording.",
    url: "/services/event-video-systems",
    serviceTypes: [
      "Event Videography",
      "Live Streaming",
      "Multi-Camera Video Production",
      "Highlight Reel Production",
    ],
    startingPrice: 3500,
  }),
  generateBreadcrumbListSchema([
    { name: "Home", url: "/" },
    { name: "Services", url: "/services" },
    { name: "Event Video Systems", url: "/services/event-video-systems" },
  ]),
];

export default function EventVideoSystemsLayout({
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
