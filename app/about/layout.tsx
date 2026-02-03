import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About JHR Photography",
  description:
    "Meet Jayson Rivas and the JHR Photography team. Nashville's trusted partner for corporate event photography, headshot activations, and conference media coverage.",
  openGraph: {
    title: "About JHR Photography",
    description:
      "Meet Jayson Rivas and the JHR Photography team. Nashville's trusted corporate event and headshot photography partner.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
