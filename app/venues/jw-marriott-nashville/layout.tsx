import type { Metadata } from "next";
import {
  generateVenueSchema,
  generateBreadcrumbListSchema,
  serializeSchemas,
} from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "JW Marriott Nashville | Corporate Event Photography Downtown",
  description:
    "JHR Photography has extensive experience at the JW Marriott Nashville. We know Nashville's largest hotel and its extensive event spaces.",
  openGraph: {
    title: "JW Marriott Nashville Event Photography | JHR Photography",
    description:
      "Professional event photography at the JW Marriott Nashville.",
  },
};

const schemas = [
  generateVenueSchema({
    name: "JW Marriott Nashville",
    description:
      "Nashville's largest hotel with extensive event spaces. JHR Photography provides professional corporate event photography throughout the property.",
    url: "/venues/jw-marriott-nashville",
  }),
  generateBreadcrumbListSchema([
    { name: "Home", url: "/" },
    { name: "Venues", url: "/venues" },
    { name: "JW Marriott Nashville", url: "/venues/jw-marriott-nashville" },
  ]),
];

export default function JWMarriottLayout({
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
