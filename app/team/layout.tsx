import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Team | JHR Photography",
  description:
    "Meet the JHR Photography team. Every operator is recruited, trained, and certified to deliver reliable, professional event media coverage in Nashville.",
  openGraph: {
    title: "Our Team — JHR Photography Certified Media Operators",
    description:
      "Meet the certified media operators behind JHR Photography. Recruited from military and professional networks, trained to our standard.",
  },
};

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
