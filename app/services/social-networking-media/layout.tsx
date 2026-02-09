import type { Metadata } from "next";
import { generateServiceSchema, serializeSchemas } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Social & Networking Event Media",
  description:
    "Professional photography for networking events, cocktail hours, and social gatherings in Nashville. Fast-turn social-first content by JHR Photography.",
  openGraph: {
    title: "Social & Networking Event Media | JHR Photography",
    description:
      "Social-first media coverage for networking events, receptions, and community gatherings in Nashville.",
  },
};

const serviceSchema = generateServiceSchema({
  name: "Social & Networking Event Media",
  description:
    "Professional photography for networking events, cocktail receptions, and social gatherings. Fast-turn social-first content optimized for real-time posting and post-event marketing.",
  url: "/services/social-networking-media",
  serviceTypes: [
    "Networking Event Photography",
    "Social Event Photography",
    "Cocktail Reception Photography",
    "Community Event Photography",
  ],
});

export default function SocialNetworkingMediaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {serializeSchemas([serviceSchema]).map((json, i) => (
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
