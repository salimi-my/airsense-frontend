export const AQI_COLORS: Record<string, string> = {
  good: "#22c55e",
  moderate: "#eab308",
  unhealthy: "#f97316",
  "very-unhealthy": "#ef4444",
  hazardous: "#a855f7",
};

export const AQI_LEGEND = [
  { class: "good", label: "Good", range: "0–50" },
  { class: "moderate", label: "Moderate", range: "51–100" },
  { class: "unhealthy", label: "Unhealthy", range: "101–200" },
  { class: "very-unhealthy", label: "Very Unhealthy", range: "201–300" },
  { class: "hazardous", label: "Hazardous", range: ">300" },
] as const;

export const RISK_COLORS: Record<string, string> = {
  Low: "#22c55e",
  Moderate: "#eab308",
  High: "#f97316",
  Critical: "#ef4444",
};

export const RISK_GRADIENTS: Record<string, string> = {
  Low: "from-emerald-500/20 via-emerald-500/5 to-transparent",
  Moderate: "from-amber-500/20 via-amber-500/5 to-transparent",
  High: "from-orange-500/25 via-orange-500/5 to-transparent",
  Critical: "from-red-500/25 via-red-500/5 to-transparent",
};

export const HEALTH_PROFILE_STORAGE_KEY = "airsense-health-profile";

export const GEO_ATTEMPTED_STORAGE_KEY = "airsense-geo-attempted";
