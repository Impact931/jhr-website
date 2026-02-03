import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nashville Venues",
  description:
    "JHR Photography has deep experience at Nashville's top event venues. We know the spaces, lighting, and logistics at Music City Center, Gaylord Opryland, and more.",
  openGraph: {
    title: "Nashville Venues | JHR Photography",
    description:
      "Deep venue expertise at Nashville's top event spaces including Music City Center, Gaylord Opryland, and more.",
  },
};

export default function VenuesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
