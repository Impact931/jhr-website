import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Belmont University | Academic & Corporate Event Photography",
  description:
    "JHR Photography has extensive experience at Belmont University. We know the campus venues for academic conferences, corporate retreats, and special events.",
  openGraph: {
    title: "Belmont University Event Photography | JHR Photography",
    description:
      "Professional event photography at Belmont University Nashville.",
  },
};

export default function BelmontUniversityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
