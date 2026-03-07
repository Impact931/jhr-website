import type { Metadata } from "next";
import {
  generateVenueSchema,
  generateBreadcrumbListSchema,
  serializeSchemas,
} from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Belmont University | Academic & Corporate Event Photography",
  description:
    "JHR Photography has extensive experience at Belmont University. We know the campus venues for academic conferences, corporate retreats, and special events.",
  openGraph: {
    title: "Belmont University Event Photography | JHR Photography",
    description:
      "Professional event photography at Belmont University Nashville.",
  },
};

const schemas = [
  generateVenueSchema({
    name: "Belmont University",
    description:
      "Nashville university campus with venues for academic conferences, corporate retreats, and special events. JHR Photography knows the campus for seamless coverage.",
    url: "/venues/belmont-university",
  }),
  generateBreadcrumbListSchema([
    { name: "Home", url: "/" },
    { name: "Venues", url: "/venues" },
    { name: "Belmont University", url: "/venues/belmont-university" },
  ]),
];

export default function BelmontUniversityLayout({
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
