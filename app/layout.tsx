import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { LayoutShell } from "@/components/layout/LayoutShell";
import TrackingScripts from "@/components/analytics/TrackingScripts";
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  serializeSchemas,
} from "@/lib/structured-data";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "JHR Photography | Nashville Corporate Event & Headshot Specialists",
    template: "%s | JHR Photography",
  },
  description:
    "Nashville's trusted partner for corporate event photography, headshot activations, and conference media. Agency-grade execution. Zero friction. Professional results.",
  keywords: [
    "Nashville event photography",
    "corporate headshots Nashville",
    "conference photography",
    "trade show photography",
    "headshot activation",
    "corporate event coverage",
    "Nashville photographer",
    "Music City Center photography",
    "Gaylord Opryland photographer",
  ],
  authors: [{ name: "JHR Photography" }],
  creator: "JHR Photography",
  publisher: "JHR Photography",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://jhr-photography.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "JHR Photography | Nashville Corporate Event & Headshot Specialists",
    description:
      "Nashville's trusted partner for corporate event photography and headshot activations. Agency-grade execution for national events.",
    url: "https://jhr-photography.com",
    siteName: "JHR Photography",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "JHR Photography - Corporate Event & Headshot Specialists",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "JHR Photography | Nashville Corporate Event & Headshot Specialists",
    description:
      "Nashville's trusted partner for corporate event photography and headshot activations.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// Generate Organization + WebSite structured data from centralized helpers
const siteSchemas = [generateOrganizationSchema(), generateWebSiteSchema()];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {serializeSchemas(siteSchemas).map((json, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: json }}
          />
        ))}
        {/* Editor fonts — Google Fonts for inline editor font picker */}
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700;800&family=Open+Sans:wght@300;400;500;600;700;800&family=Lato:wght@300;400;700&family=Montserrat:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600;700;800&family=Merriweather:wght@300;400;700&family=Poppins:wght@300;400;500;600;700;800&family=Raleway:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-jhr-black text-jhr-white min-h-screen flex flex-col`}
      >
        <LayoutShell>{children}</LayoutShell>
        <TrackingScripts />
      </body>
    </html>
  );
}
