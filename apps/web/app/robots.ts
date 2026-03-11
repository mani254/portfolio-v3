import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://example.com"; // User should set NEXT_PUBLIC_BASE_URL to actual domain

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/private/",
        "/api/", // Do not let crawlers hit internal API if any
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
