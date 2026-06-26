import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    scope: "/",
    name: "AirSense — Personalized Smart Air Quality Awareness",
    short_name: "AirSense",
    description:
      "AirSense delivers real-time air quality data, pollution trends, and AI-powered personalized health risk alerts for urban Malaysians facing haze and pollution.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0d9488",
    orientation: "portrait-primary",
    icons: [
      { src: "/favicons/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { src: "/favicons/icon-180x180.png", sizes: "180x180", type: "image/png" },
      {
        src: "/favicons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/favicons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
