import type { Metadata } from "next";

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

export default function CorporateEventCoverageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
