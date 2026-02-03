import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Music City Center | Convention Event Photography",
  description:
    "JHR Photography is Nashville's go-to photographer at Music City Center. We know every hall, ballroom, and meeting room for seamless convention and event coverage.",
  openGraph: {
    title: "Music City Center Photography | JHR Photography",
    description:
      "Expert event photography at Music City Center. We know every hall, ballroom, and meeting room in Nashville's premier convention center.",
  },
};

export default function MusicCityCenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
