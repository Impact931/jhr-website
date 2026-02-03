import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Venue Photography Partner",
  description:
    "Dedicated photography partner for Nashville venues. JHR Photography knows your spaces, lighting, and logistics to deliver seamless event coverage every time.",
  openGraph: {
    title: "Venue Photography Partner | JHR Photography",
    description:
      "Dedicated photography partner for Nashville venues. We know your spaces, lighting, and logistics for seamless event coverage.",
  },
};

export default function VenuesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
