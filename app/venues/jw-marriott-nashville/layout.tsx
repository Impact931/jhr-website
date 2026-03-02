import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JW Marriott Nashville | Corporate Event Photography Downtown",
  description:
    "JHR Photography has extensive experience at the JW Marriott Nashville. We know Nashville's largest hotel and its extensive event spaces.",
  openGraph: {
    title: "JW Marriott Nashville Event Photography | JHR Photography",
    description:
      "Professional event photography at the JW Marriott Nashville.",
  },
};

export default function JWMarriottLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
