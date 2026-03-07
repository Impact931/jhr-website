import type { Metadata } from "next";
import {
  generateVenueSchema,
  generateBreadcrumbListSchema,
  serializeSchemas,
} from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Embassy Suites Nashville | Corporate Event Photography Downtown",
  description:
    "JHR Photography has extensive experience at Embassy Suites Nashville. A versatile property popular with corporate groups for meetings and events.",
  openGraph: {
    title: "Embassy Suites Nashville Event Photography | JHR Photography",
    description:
      "Professional event photography at Embassy Suites Nashville downtown.",
  },
};

const schemas = [
  generateVenueSchema({
    name: "Embassy Suites by Hilton Nashville Downtown",
    description:
      "Versatile downtown Nashville property popular with corporate groups. JHR Photography provides professional event coverage for meetings and events.",
    url: "/venues/embassy-suites-nashville",
  }),
  generateBreadcrumbListSchema([
    { name: "Home", url: "/" },
    { name: "Venues", url: "/venues" },
    { name: "Embassy Suites Nashville", url: "/venues/embassy-suites-nashville" },
  ]),
];

export default function EmbassySuitesLayout({
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
