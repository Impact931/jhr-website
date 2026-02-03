import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DMC & Agency Photography Partner",
  description:
    "Reliable photography partner for DMCs and event agencies in Nashville. White-label event coverage and headshot activations that make your team look great with JHR Photography.",
  openGraph: {
    title: "DMC & Agency Photography Partner | JHR Photography",
    description:
      "Reliable white-label photography partner for DMCs and event agencies. Seamless event coverage in Nashville and nationwide.",
  },
};

export default function DMCsAgenciesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
