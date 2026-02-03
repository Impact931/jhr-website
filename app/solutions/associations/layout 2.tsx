import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Association Event Photography",
  description:
    "Specialized photography for association conferences, annual meetings, and member events in Nashville. Capture every keynote, breakout, and networking moment with JHR Photography.",
  openGraph: {
    title: "Association Event Photography | JHR Photography",
    description:
      "Specialized photography for association conferences, annual meetings, and member events in Nashville and nationwide.",
  },
};

export default function AssociationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
