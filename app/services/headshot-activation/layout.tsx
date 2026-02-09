import type { Metadata } from "next";
import { generateServiceSchema, serializeSchemas } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Headshot Activation",
  description:
    "On-site headshot activations for conferences and trade shows in Nashville. Professional headshots delivered in under 5 minutes with instant digital delivery by JHR Photography.",
  openGraph: {
    title: "Headshot Activation | JHR Photography",
    description:
      "On-site headshot activations with professional results in under 5 minutes and instant digital delivery for conferences and events.",
  },
};

const serviceSchema = generateServiceSchema({
  name: "Headshot Activation",
  description:
    "On-site headshot activation stations for conferences, trade shows, and corporate events. Professional headshots in under 5 minutes with AI-retouched instant digital delivery.",
  url: "/services/headshot-activation",
  serviceTypes: [
    "Professional Headshot Photography",
    "On-Site Headshot Station",
    "Event Headshot Activation",
    "Corporate Headshots",
  ],
});

export default function HeadshotActivationLayout({
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
