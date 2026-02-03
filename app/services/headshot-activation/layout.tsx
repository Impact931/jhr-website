import type { Metadata } from "next";

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

export default function HeadshotActivationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
