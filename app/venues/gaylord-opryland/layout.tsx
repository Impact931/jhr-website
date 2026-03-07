import type { Metadata } from "next";
import {
  generateVenueSchema,
  generateBreadcrumbListSchema,
  serializeSchemas,
} from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Gaylord Opryland Event Photographer | Resort Convention Photography",
  description:
    "JHR Photography has extensive experience at Gaylord Opryland Resort. We navigate the sprawling property and deliver exceptional event photography across all venues.",
  openGraph: {
    title: "Gaylord Opryland Photography | JHR Photography",
    description:
      "Expert event photography at Gaylord Opryland Resort. We know every ballroom, atrium, and event space in Nashville's largest resort.",
  },
};

const schemas = [
  generateVenueSchema({
    name: "Gaylord Opryland Resort & Convention Center",
    description:
      "Nashville's largest resort and convention center. JHR Photography navigates the sprawling property for exceptional event photography across all venues.",
    url: "/venues/gaylord-opryland",
  }),
  generateBreadcrumbListSchema([
    { name: "Home", url: "/" },
    { name: "Venues", url: "/venues" },
    { name: "Gaylord Opryland", url: "/venues/gaylord-opryland" },
  ]),
];

export default function GaylordOprylandLayout({
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
