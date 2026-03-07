import type { Metadata } from "next";
import {
  generateVenueSchema,
  generateBreadcrumbListSchema,
  serializeSchemas,
} from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "City Winery Nashville | Unique Event Photography Downtown",
  description:
    "JHR Photography has extensive experience at City Winery Nashville. We capture the energy and intimate atmosphere of this unique entertainment venue.",
  openGraph: {
    title: "City Winery Nashville Event Photography | JHR Photography",
    description:
      "Professional event photography at City Winery Nashville.",
  },
};

const schemas = [
  generateVenueSchema({
    name: "City Winery Nashville",
    description:
      "Unique downtown Nashville entertainment venue. JHR Photography captures the energy and intimate atmosphere for corporate and private events.",
    url: "/venues/city-winery-nashville",
  }),
  generateBreadcrumbListSchema([
    { name: "Home", url: "/" },
    { name: "Venues", url: "/venues" },
    { name: "City Winery Nashville", url: "/venues/city-winery-nashville" },
  ]),
];

export default function CityWineryLayout({
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
