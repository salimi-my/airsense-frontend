// Page routes
const LOGIN_ROUTE = "/login";
const REGISTER_ROUTE = "/register";
const FORGOT_PASSWORD_ROUTE = "/forgot-password";
const RESET_PASSWORD_ROUTE = "/password-reset";
const VERIFY_EMAIL_ROUTE = "/verify-email";

// API endpoints
const API_ENDPOINTS = {
  USER: "/api/user",
  CSRF: "/sanctum/csrf-cookie",
  REGISTER: "/register",
  LOGIN: "/login",
  LOGOUT: "/logout",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  EMAIL_VERIFICATION: "/email/verification-notification",
  TWO_FACTOR_VERIFY: "/two-factor/verify",
  TWO_FACTOR_SETUP: "/api/two-factor/setup",
  TWO_FACTOR_ENABLE: "/api/two-factor/enable",
  TWO_FACTOR_DISABLE: "/api/two-factor/disable",
  TWO_FACTOR_RECOVERY_CODES: "/api/two-factor/recovery-codes",
  TWO_FACTOR_RECOVERY_CODES_REGENERATE:
    "/api/two-factor/recovery-codes/regenerate",
  STATIONS: "/api/stations",
  STATION: (id: number) => `/api/stations/${id}`,
  STATION_READINGS: (id: number, days = 7) =>
    `/api/stations/${id}/readings?days=${days}`,
  STATION_PREDICTION: (id: number) => `/api/stations/${id}/prediction`,
  STATION_ALERTS: "/api/stations/alerts",
  ASSESSMENTS: "/api/assessments",
  ADMIN_READINGS: "/api/admin/readings",
  ADMIN_ASSESSMENTS: "/api/admin/assessments",
  DASHBOARD: "/api/dashboard",
  ME_ASSESSMENTS: "/api/me/assessments",
  STATIONS_NEARBY: (lat: number, lng: number) =>
    `/api/stations/nearby?lat=${lat}&lng=${lng}`,
  OAUTH_REDIRECT: (provider: string) => `/auth/${provider}/redirect`,
  OAUTH_LINK: (provider: string) => `/auth/${provider}/link`,
  OAUTH_UNLINK: (provider: string) => `/auth/${provider}/unlink`,
} as const;

// Feature flags
/**
 * Check if user registration is enabled via environment variable
 * @returns {boolean} true if registration is enabled, false otherwise
 */
export const isRegistrationEnabled = (): boolean => {
  return process.env.NEXT_PUBLIC_ENABLE_REGISTRATION === "true";
};

/**
 * Check if Google OAuth is enabled via environment variable
 * @returns {boolean} true if Google OAuth is enabled, false otherwise
 */
export const isGoogleOAuthEnabled = (): boolean => {
  return process.env.NEXT_PUBLIC_ENABLE_OAUTH_GOOGLE === "true";
};

/**
 * Check if GitHub OAuth is enabled via environment variable
 * @returns {boolean} true if GitHub OAuth is enabled, false otherwise
 */
export const isGithubOAuthEnabled = (): boolean => {
  return process.env.NEXT_PUBLIC_ENABLE_OAUTH_GITHUB === "true";
};

/**
 * Check if any OAuth provider is enabled
 * @returns {boolean} true if at least one OAuth provider is enabled, false otherwise
 */
export const isOAuthEnabled = (): boolean => {
  return isGoogleOAuthEnabled() || isGithubOAuthEnabled();
};

export {
  // API endpoints
  API_ENDPOINTS,
  // Page routes
  FORGOT_PASSWORD_ROUTE,
  LOGIN_ROUTE,
  REGISTER_ROUTE,
  RESET_PASSWORD_ROUTE,
  VERIFY_EMAIL_ROUTE,
};
