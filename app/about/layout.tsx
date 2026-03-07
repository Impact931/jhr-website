import type { Metadata } from "next";
import { generateBreadcrumbListSchema, serializeSchemas } from "@/lib/structured-data";

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

const schemas = [
  generateBreadcrumbListSchema([
    { name: "Home", url: "/" },
    { name: "About", url: "/about" },
  ]),
];

export default function AboutLayout({
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
