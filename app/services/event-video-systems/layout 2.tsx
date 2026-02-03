import type { Metadata } from "next";

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

export default function EventVideoSystemsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
