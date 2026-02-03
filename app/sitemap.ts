import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://jhr-photography.com";
  const currentDate = new Date().toISOString();

  // Core pages
  const corePages = [
    { url: "", priority: 1.0, changeFrequency: "weekly" as const },
    { url: "/services", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/venues", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/about", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/faqs", priority: 0.8, changeFrequency: "weekly" as const },
    { url: "/contact", priority: 0.8, changeFrequency: "monthly" as const },
    { url: "/schedule", priority: 0.9, changeFrequency: "monthly" as const },
  ];

  // Service pages
  const servicePages = [
    { url: "/services/headshot-activation", priority: 0.9 },
    { url: "/services/corporate-event-coverage", priority: 0.9 },
    { url: "/services/corporate-headshot-program", priority: 0.8 },
    { url: "/services/event-video-systems", priority: 0.8 },
  ];

  // ICP solution pages
  const solutionPages = [
    { url: "/solutions/dmcs-agencies", priority: 0.8 },
    { url: "/solutions/exhibitors-sponsors", priority: 0.8 },
    { url: "/solutions/associations", priority: 0.8 },
    { url: "/solutions/venues", priority: 0.8 },
  ];

  // Venue pages
  const venuePages = [
    { url: "/venues/music-city-center", priority: 0.8 },
    { url: "/venues/gaylord-opryland", priority: 0.8 },
    { url: "/venues/renaissance-hotel-nashville", priority: 0.7 },
    { url: "/venues/omni-hotel-nashville", priority: 0.7 },
    { url: "/venues/jw-marriott-nashville", priority: 0.7 },
    { url: "/venues/embassy-suites-nashville", priority: 0.7 },
    { url: "/venues/city-winery-nashville", priority: 0.7 },
    { url: "/venues/belmont-university", priority: 0.7 },
  ];

  return [
    ...corePages.map((page) => ({
      url: `${baseUrl}${page.url}`,
      lastModified: currentDate,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...servicePages.map((page) => ({
      url: `${baseUrl}${page.url}`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: page.priority,
    })),
    ...solutionPages.map((page) => ({
      url: `${baseUrl}${page.url}`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: page.priority,
    })),
    ...venuePages.map((page) => ({
      url: `${baseUrl}${page.url}`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: page.priority,
    })),
  ];
}
