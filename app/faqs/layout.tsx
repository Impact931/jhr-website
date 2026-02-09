import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about JHR Photography services, headshot activations, event coverage, logistics, and pricing for corporate events in Nashville.",
  openGraph: {
    title: "FAQs | JHR Photography",
    description:
      "Find answers about corporate event photography, headshot activations, logistics, and pricing from JHR Photography.",
  },
};

export default function FAQsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
