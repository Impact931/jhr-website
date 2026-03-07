import type { Metadata } from "next";
import {
  generateVenueSchema,
  generateBreadcrumbListSchema,
  serializeSchemas,
} from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Music City Center Photographer | Convention Event Photography",
  description:
    "JHR Photography is Nashville's go-to photographer at Music City Center. We know every hall, ballroom, and meeting room for seamless convention and event coverage.",
  openGraph: {
    title: "Music City Center Photography | JHR Photography",
    description:
      "Expert event photography at Music City Center. We know every hall, ballroom, and meeting room in Nashville's premier convention center.",
  },
};

const schemas = [
  generateVenueSchema({
    name: "Music City Center",
    description:
      "Nashville's premier convention center. JHR Photography provides expert event photography across all halls, ballrooms, and meeting rooms.",
    url: "/venues/music-city-center",
  }),
  generateBreadcrumbListSchema([
    { name: "Home", url: "/" },
    { name: "Venues", url: "/venues" },
    { name: "Music City Center", url: "/venues/music-city-center" },
  ]),
];

export default function MusicCityCenterLayout({
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
