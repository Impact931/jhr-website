import type { Metadata } from "next";
import {
  generateVenueSchema,
  generateBreadcrumbListSchema,
  serializeSchemas,
} from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Omni Hotel Nashville | Luxury Event Photography Downtown",
  description:
    "JHR Photography has extensive experience at the Omni Nashville Hotel. We understand the luxury service expectations and deliver photography that matches the venue's standards.",
  openGraph: {
    title: "Omni Hotel Nashville Event Photography | JHR Photography",
    description:
      "Professional event photography at the Omni Nashville Hotel.",
  },
};

const schemas = [
  generateVenueSchema({
    name: "Omni Nashville Hotel",
    description:
      "Luxury downtown Nashville hotel. JHR Photography delivers event photography that matches the venue's premium standards.",
    url: "/venues/omni-hotel-nashville",
  }),
  generateBreadcrumbListSchema([
    { name: "Home", url: "/" },
    { name: "Venues", url: "/venues" },
    { name: "Omni Hotel Nashville", url: "/venues/omni-hotel-nashville" },
  ]),
];

export default function OmniHotelLayout({
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
