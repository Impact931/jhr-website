import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Corporate Headshot Program",
  description:
    "Scalable corporate headshot programs for teams and organizations in Nashville. Consistent, professional headshots delivered on-site with fast turnaround by JHR Photography.",
  openGraph: {
    title: "Corporate Headshot Program | JHR Photography",
    description:
      "Scalable on-site corporate headshot programs with consistent quality and fast turnaround for teams and organizations.",
  },
};

export default function CorporateHeadshotProgramLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
