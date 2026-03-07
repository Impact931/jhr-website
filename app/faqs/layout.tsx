import type { Metadata } from "next";
import { generateBreadcrumbListSchema, serializeSchemas } from "@/lib/structured-data";

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

const schemas = [
  generateBreadcrumbListSchema([
    { name: "Home", url: "/" },
    { name: "FAQs", url: "/faqs" },
  ]),
];

export default function FAQsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {serializeSchemas(schemas).map((json, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: json }}
        />
      ))}
      {children}
    </>
  );
}
