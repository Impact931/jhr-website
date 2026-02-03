import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Exhibitor & Sponsor Photography",
  description:
    "Maximize your trade show ROI with professional booth photography and headshot activations. Drive booth traffic and capture leads at Nashville events with JHR Photography.",
  openGraph: {
    title: "Exhibitor & Sponsor Photography | JHR Photography",
    description:
      "Maximize trade show ROI with professional booth photography and headshot activations that drive traffic and capture leads.",
  },
};

export default function ExhibitorsSponsorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
