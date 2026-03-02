import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Embassy Suites Nashville | Corporate Event Photography Downtown",
  description:
    "JHR Photography has extensive experience at Embassy Suites Nashville. A versatile property popular with corporate groups for meetings and events.",
  openGraph: {
    title: "Embassy Suites Nashville Event Photography | JHR Photography",
    description:
      "Professional event photography at Embassy Suites Nashville downtown.",
  },
};

export default function EmbassySuitesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
