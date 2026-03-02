import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Omni Hotel Nashville | Luxury Event Photography Downtown",
  description:
    "JHR Photography has extensive experience at the Omni Nashville Hotel. We understand the luxury service expectations and deliver photography that matches the venue's standards.",
  openGraph: {
    title: "Omni Hotel Nashville Event Photography | JHR Photography",
    description:
      "Professional event photography at the Omni Nashville Hotel.",
  },
};

export default function OmniHotelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
