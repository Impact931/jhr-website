import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Schedule a Consultation",
  description:
    "Book a free consultation with JHR Photography. Discuss your corporate event photography, headshot activation, or conference media coverage needs.",
  openGraph: {
    title: "Schedule a Consultation | JHR Photography",
    description:
      "Book a free consultation to discuss your corporate event photography and headshot activation needs with JHR Photography.",
  },
};

export default function ScheduleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
