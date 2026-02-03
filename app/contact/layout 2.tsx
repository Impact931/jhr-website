import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with JHR Photography for corporate event photography, headshot activations, and conference media coverage in Nashville and nationwide.",
  openGraph: {
    title: "Contact JHR Photography",
    description:
      "Reach out to discuss your corporate event photography and headshot activation needs. Nashville and nationwide coverage.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
