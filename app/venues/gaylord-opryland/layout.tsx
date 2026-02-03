import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gaylord Opryland | Resort Event Photography",
  description:
    "JHR Photography has extensive experience at Gaylord Opryland Resort. We navigate the sprawling property and deliver exceptional event photography across all venues.",
  openGraph: {
    title: "Gaylord Opryland Photography | JHR Photography",
    description:
      "Expert event photography at Gaylord Opryland Resort. We know every ballroom, atrium, and event space in Nashville's largest resort.",
  },
};

export default function GaylordOprylandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
