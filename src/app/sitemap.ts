import type { MetadataRoute } from "next";
import { siteContent } from "@/../content/siteContent";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.meddyglobalsolutions.com";

  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/capabilities",
    "/hsse",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const serviceRoutes = siteContent.services.items.map((svc) => ({
    url: `${baseUrl}/services/${svc.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...serviceRoutes];
}

