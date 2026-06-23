import { cache } from "react";

import { createServerAxios } from "@/lib/server-axios";
import { AuthError, User } from "@/types";
import { AxiosError } from "axios";

export const getUser = cache(async (): Promise<User | null> => {
  // createServerAxios() reads cookies() — kept outside try so Next.js can detect
  // dynamic usage and opt the route into server-rendering at build time
  const axios = await createServerAxios();
  try {
    const response = await axios.get("/api/user");

    // Validate response structure
    if (!response.data || typeof response.data.data !== "object") {
      console.error("Invalid user data structure received from API");
      return null;
    }

    return response.data.data as User;
  } catch (error) {
    const authError = handleAuthError(error);

    // 401/403 are expected for guest pages — don't surface as runtime errors in dev
    if (authError.type !== "UNAUTHORIZED") {
      console.error("Authentication error:", {
        type: authError.type,
        message: authError.message,
        status: authError.status,
        timestamp: new Date().toISOString(),
      });
    }

    return null;
  }
});

function handleAuthError(error: unknown): AuthError {
  if (error instanceof AxiosError) {
    const status = error.response?.status;

    switch (status) {
      case 401:
        return {
          type: "UNAUTHORIZED",
          message: "User is not authenticated",
          status: 401,
        };
      case 403:
        return {
          type: "UNAUTHORIZED",
          message: "User is not authorized",
          status: 403,
        };
      case 404:
        return {
          type: "SERVER_ERROR",
          message: "User endpoint not found",
          status: 404,
        };
      case 422:
        return {
          type: "VALIDATION_ERROR",
          message: "Invalid request format",
          status: 422,
        };
      case 500:
      case 502:
      case 503:
        return {
          type: "SERVER_ERROR",
          message: "Backend server error",
          status,
        };
      default:
        if (error.code === "ECONNREFUSED" || error.code === "ETIMEDOUT") {
          return {
            type: "NETWORK_ERROR",
            message: "Cannot connect to backend server",
          };
        }
        return {
          type: "NETWORK_ERROR",
          message: error.message || "Network request failed",
          status,
        };
    }
  }

  return {
    type: "SERVER_ERROR",
    message: error instanceof Error ? error.message : "Unknown error occurred",
  };
}

// Optional: lightweight check — avoids parsing the full user object
export const isAuthenticated = async (): Promise<boolean> => {
  const axios = await createServerAxios();
  try {
    await axios.get("/api/user");
    return true;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      return false;
    }
    // For other errors, we can't be sure, so assume not authenticated
    return false;
  }
};

/**
 * Check if the current user has admin role
 * @returns Promise<boolean> - true if user is admin, false otherwise
 */
export const isUserAdmin = async (): Promise<boolean> => {
  const user = await getUser();
  return user?.role?.name === "admin";
};
