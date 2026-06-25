import type { ApiResponse } from "@/types/api";
import type { PaginatedResponse } from "@/types/pagination";

export type AqiColorClass =
  | "good"
  | "moderate"
  | "unhealthy"
  | "very-unhealthy"
  | "hazardous";

export type RiskLevel = "Low" | "Moderate" | "High" | "Critical";

export interface StationReading {
  aqi: number;
  pm25: number | null;
  pm10: number | null;
  no2: number | null;
  o3: number | null;
  co: number | null;
  temperature: number | null;
  humidity: number | null;
  wind_speed: number | null;
  fetched_at: string | null;
  category: string;
  color_class: AqiColorClass;
  hex_color: string;
  stale: boolean;
}

export interface Station {
  id: number;
  name: string;
  city: string;
  lat: number;
  lng: number;
  waqi_slug: string;
  latest_reading: StationReading | null;
}

export interface StationsData {
  stations: Station[];
  last_updated: string | null;
  stale: boolean;
}

export interface ReadingPoint {
  id: number;
  aqi: number;
  pm25: number | null;
  pm10: number | null;
  no2: number | null;
  o3: number | null;
  co: number | null;
  temperature: number | null;
  humidity: number | null;
  wind_speed: number | null;
  fetched_at: string | null;
}

export interface StationReadingsData {
  station: Station;
  readings: ReadingPoint[];
}

export interface AqiAlert {
  id: number;
  name: string;
  aqi: number;
  category: string;
  color_class: AqiColorClass;
  message: string;
}

export interface AlertsData {
  alerts: AqiAlert[];
  has_alerts: boolean;
}

export interface AssessmentResult {
  id: number;
  risk: RiskLevel;
  advice: string;
  precautions: string[];
  confidence: number;
  used_fallback: boolean;
  current_aqi: number;
  category: string;
  station_name: string;
  low_confidence: boolean;
}

export interface AssessmentFormValues {
  station_id: number;
  age_group: "child" | "teen" | "adult" | "elderly";
  conditions: Array<
    "none" | "asthma" | "heart_disease" | "respiratory" | "diabetes"
  >;
  activity:
    | "indoor"
    | "light_outdoor"
    | "moderate_exercise"
    | "strenuous_exercise";
}

export interface PredictionData {
  predicted_aqi: number;
  category: string;
  color_class: AqiColorClass;
  confidence: number;
  used_fallback: boolean;
  disclaimer: string;
  message?: string;
}

export interface PredictionResponse {
  station_id: number;
  station_name: string;
  prediction: PredictionData;
}

export type StationsApiResponse = ApiResponse<StationsData>;
export type StationApiResponse = ApiResponse<Station>;
export type StationReadingsApiResponse = ApiResponse<StationReadingsData>;
export type AlertsApiResponse = ApiResponse<AlertsData>;
export type AssessmentApiResponse = ApiResponse<{ assessment: AssessmentResult }>;
export type PredictionApiResponse = ApiResponse<PredictionResponse>;

export interface AdminReadingLog {
  id: number;
  station_id: number;
  aqi: number;
  fetched_at: string;
  created_at: string;
  station?: { id: number; name: string; city: string };
}

export interface AdminAssessmentLog {
  id: number;
  station_id: number;
  age_group: string;
  conditions: string[];
  activity: string;
  risk_level: string;
  advice: string;
  confidence: number | null;
  used_fallback: boolean;
  assessed_at: string;
  station?: { id: number; name: string; city: string };
}

export interface DashboardLastAssessment {
  id: number;
  risk_level: RiskLevel;
  station_id: number;
  station_name: string | null;
  confidence: number | null;
  assessed_at: string | null;
}

export interface DashboardAdminStats {
  assessments_today: number;
  stale_stations_count: number;
  last_fetch_at: string | null;
}

export interface DashboardData {
  preferred_station: Station | null;
  last_assessment: DashboardLastAssessment | null;
  assessment_count_week: number;
  active_alerts_count: number;
  valley_avg_aqi: number;
  admin?: DashboardAdminStats;
}

export interface MyAssessmentLog {
  id: number;
  station_id: number;
  age_group: string;
  conditions: string[];
  activity: string;
  risk_level: RiskLevel;
  advice: string;
  confidence: number | null;
  used_fallback: boolean;
  assessed_at: string;
  station?: { id: number; name: string; city: string };
}

export interface NearbyStationData {
  station: Station;
  distance_km: number;
  within_coverage: boolean;
}

export type DashboardApiResponse = ApiResponse<DashboardData>;
export type NearbyStationApiResponse = ApiResponse<NearbyStationData>;
export type MyAssessmentsApiResponse = ApiResponse<
  PaginatedResponse<MyAssessmentLog>
>;
