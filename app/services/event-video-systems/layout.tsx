import type { Metadata } from "next";
import { generateServiceSchema, serializeSchemas } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Event Video Systems",
  description:
    "Professional event video systems for corporate conferences and trade shows in Nashville. Live streaming, highlight reels, and multi-camera production by JHR Photography.",
  openGraph: {
    title: "Event Video Systems | JHR Photography",
    description:
      "Professional event video production including live streaming, highlight reels, and multi-camera coverage for corporate events.",
  },
};

const serviceSchema = generateServiceSchema({
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
});

export default function EventVideoSystemsLayout({
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
