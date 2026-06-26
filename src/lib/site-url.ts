import { headers } from "next/headers";

const LOCALHOST_SITE_URL = "http://localhost:3000";

function normalizeSiteUrl(url: string): string {
  return url.replace(/\/$/, "");
}

function isLocalhostUrl(url: string): boolean {
  try {
    const { hostname } = new URL(url);
    return hostname === "localhost" || hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

function getConfiguredSiteUrl(): string | null {
  const configured = process.env.NEXT_PUBLIC_FRONTEND_URL?.trim();
  if (!configured) {
    return null;
  }

  return normalizeSiteUrl(configured);
}

export async function getSiteUrl(): Promise<string> {
  const configured = getConfiguredSiteUrl();
  if (configured && !isLocalhostUrl(configured)) {
    return configured;
  }

  try {
    const headersList = await headers();
    const host =
      headersList.get("x-forwarded-host") ?? headersList.get("host");

    if (host) {
      const protocol =
        headersList.get("x-forwarded-proto") ??
        (host.startsWith("localhost") ? "http" : "https");

      return normalizeSiteUrl(`${protocol}://${host}`);
    }
  } catch {
    // headers() is unavailable outside a request context.
  }

  return configured ?? LOCALHOST_SITE_URL;
}
