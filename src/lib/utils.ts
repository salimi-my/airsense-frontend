import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import type { Params } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number;
    sizeType?: "accurate" | "normal";
  } = {},
) {
  const { decimals = 0, sizeType = "normal" } = opts;

  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const accurateSizes = ["Bytes", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === "accurate"
      ? (accurateSizes[i] ?? "Bytes")
      : (sizes[i] ?? "Bytes")
  }`;
}

export function filtered(params: Params, defaultParams: Params) {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sort: _sort,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    page: _page,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    per_page: _perPage,
    ...restParams
  } = params;
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sort: _defaultSort,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    page: _defaultPage,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    per_page: _defaultPerPage,
    ...defaultRestParams
  } = defaultParams;

  return JSON.stringify(restParams) !== JSON.stringify(defaultRestParams);
}

export function capitalizeWords(input: string): string {
  return input
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getInitials(name: string): string {
  if (!name) return "";

  const parts = name.split(" ");

  if (parts.length === 1) {
    // If only one word, take the first two letters
    return name.substring(0, 2).toUpperCase();
  } else {
    // Take first letter of first word and first letter of last word
    const firstInitial = parts[0].charAt(0);
    const lastInitial = parts[parts.length - 1].charAt(0);
    return (firstInitial + lastInitial).toUpperCase();
  }
}
