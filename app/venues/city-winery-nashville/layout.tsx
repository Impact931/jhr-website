import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "City Winery Nashville | Unique Event Photography Downtown",
  description:
    "JHR Photography has extensive experience at City Winery Nashville. We capture the energy and intimate atmosphere of this unique entertainment venue.",
  openGraph: {
    title: "City Winery Nashville Event Photography | JHR Photography",
    description:
      "Professional event photography at City Winery Nashville.",
  },
};

export default function CityWineryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
