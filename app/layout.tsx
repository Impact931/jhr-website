import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "@/components/layout/ClientLayout";

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

// JSON-LD Schema for Organization
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://jhr-photography.com/#organization",
  name: "JHR Photography",
  url: "https://jhr-photography.com",
  logo: "https://jhr-photography.com/images/jhr-logo-white.png",
  description:
    "Nashville's trusted partner for corporate event photography, headshot activations, and conference media coverage.",
  telephone: "+1-615-555-0123",
  email: "info@jhr-photography.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Nashville",
    addressRegion: "TN",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 36.1627,
    longitude: -86.7816,
  },
  areaServed: [
    {
      "@type": "City",
      name: "Nashville",
    },
    {
      "@type": "State",
      name: "Tennessee",
    },
    {
      "@type": "Country",
      name: "United States",
    },
  ],
  priceRange: "$$$$",
  sameAs: [
    "https://www.linkedin.com/company/jhr-photography",
    "https://www.instagram.com/jhrphotography",
    "https://www.facebook.com/jhrphotography",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-jhr-black text-jhr-white min-h-screen`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
