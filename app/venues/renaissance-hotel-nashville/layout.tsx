import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Renaissance Hotel Nashville | Convention Center Event Photography",
  description:
    "JHR Photography has extensive experience at the Renaissance Nashville. We know the connected Music City Center access and the hotel's premium event spaces.",
  openGraph: {
    title: "Renaissance Hotel Nashville Event Photography | JHR Photography",
    description:
      "Professional event photography at the Renaissance Nashville hotel.",
  },
};

export default function RenaissanceHotelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
