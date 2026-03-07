import type { Metadata } from "next";
import {
  generateVenueSchema,
  generateBreadcrumbListSchema,
  serializeSchemas,
} from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Renaissance Hotel Nashville | Convention Center Event Photography",
  description:
    "JHR Photography has extensive experience at the Renaissance Nashville. We know the connected Music City Center access and the hotel's premium event spaces.",
  openGraph: {
    title: "Renaissance Hotel Nashville Event Photography | JHR Photography",
    description:
      "Professional event photography at the Renaissance Nashville hotel.",
  },
};

const schemas = [
  generateVenueSchema({
    name: "Renaissance Nashville Hotel",
    description:
      "Connected to Music City Center with premium event spaces. JHR Photography knows the hotel's layout and lighting for seamless convention photography.",
    url: "/venues/renaissance-hotel-nashville",
  }),
  generateBreadcrumbListSchema([
    { name: "Home", url: "/" },
    { name: "Venues", url: "/venues" },
    { name: "Renaissance Hotel", url: "/venues/renaissance-hotel-nashville" },
  ]),
];

export default function RenaissanceHotelLayout({
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
