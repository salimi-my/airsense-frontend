import { AxiosError } from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef } from "react";

import { useOptionalUserContext } from "@/components/providers/user-provider";
import {
  API_ENDPOINTS,
  EMPTY_ERRORS,
  HTTP_STATUS,
  LOGIN_ROUTE,
  VERIFY_EMAIL_ROUTE,
} from "@/constants";
import { useUserSWR } from "@/hooks/use-user-swr";
import axios from "@/lib/axios";
import type {
  ApiErrorResponse,
  ApiResponse,
  AuthErrors,
  EnableTwoFactorProps,
  ForgotPasswordProps,
  LoginProps,
  RecoveryCodesRegenerateData,
  RecoveryCodesStatus,
  RegisterProps,
  ResendEmailVerificationProps,
  ResetPasswordProps,
  TwoFactorEnableData,
  TwoFactorSetupData,
  UseAuthProps,
  UseAuthReturn,
  User,
  VerifyTwoFactorProps,
} from "@/types";

/**
 * Authentication hook for managing user authentication state and operations
 * Provides login, register, logout, and password reset functionality with proper TypeScript types
 */

/**
 * Authentication hook that provides user state and auth operations
 *
 * @param props - Configuration options for the auth hook
 * @returns Object containing user state, auth operations, and loading states
 *
 * @example
 * ```tsx
 * const { user, login, logout, isLoading } = useAuth({
 *   middleware: 'auth',
 *   redirectIfAuthenticated: '/dashboard'
 * });
 * ```
 */
export const useAuth = ({
  middleware,
  redirectIfAuthenticated,
}: UseAuthProps = {}): UseAuthReturn => {
  const router = useRouter();
  const isLoggingOutRef = useRef(false);
  const userContext = useOptionalUserContext();
  const standaloneSession = useUserSWR({ disabled: userContext !== null });
  const {
    user,
    error,
    mutate,
    isLoading,
    isAuthenticated,
    isEmailVerified,
    isAdmin,
  } = userContext ?? standaloneSession;

  const errorStatus = useMemo(
    () => error?.response?.status,
    [error?.response?.status],
  );

  const currentPathname = usePathname();
  const isOnVerifyEmailPage = currentPathname === VERIFY_EMAIL_ROUTE;

  // CSRF token helper with better error handling
  const csrf = useCallback(async (): Promise<void> => {
    try {
      await axios.get(API_ENDPOINTS.CSRF);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("CSRF token fetch failed:", error);
      }
      throw error;
    }
  }, []);

  // Enhanced API error handler with more specific error types
  const handleApiError = useCallback(
    (error: unknown, setErrors: (errors: AuthErrors) => void): void => {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const statusCode = axiosError.response?.status;
      const errorMessage =
        axiosError.response?.data?.message || axiosError.message;

      switch (statusCode) {
        case HTTP_STATUS.BAD_REQUEST:
        case HTTP_STATUS.VALIDATION_ERROR: {
          // Validation errors - display field-specific errors
          const validationErrors =
            axiosError.response?.data?.errors || EMPTY_ERRORS;

          // If no field-specific errors but there's a general message, treat it as a code error
          if (Object.keys(validationErrors).length === 0 && errorMessage) {
            setErrors({ code: [errorMessage] });
          } else {
            setErrors(validationErrors);
          }
          break;
        }

        case HTTP_STATUS.UNAUTHORIZED:
          // Unauthorized - log and let auth middleware handle
          if (process.env.NODE_ENV === "development") {
            console.warn("Unauthorized access:", errorMessage);
          }
          break;

        case HTTP_STATUS.EMAIL_VERIFICATION_REQUIRED:
          // Email verification required - will be handled by useEffect
          if (process.env.NODE_ENV === "development") {
            console.info("Email verification required");
          }
          break;

        default: {
          if (statusCode && statusCode >= HTTP_STATUS.SERVER_ERROR) {
            // Server errors
            setErrors({
              server: ["A server error occurred. Please try again later."],
            });
            if (process.env.NODE_ENV === "development") {
              console.error("Server error:", errorMessage);
            }
          } else if (!statusCode) {
            // Network errors
            setErrors({
              network: [
                "Network error. Please check your connection and try again.",
              ],
            });
            if (process.env.NODE_ENV === "development") {
              console.error("Network error:", errorMessage);
            }
          } else {
            // Other client errors
            setErrors({
              general: [errorMessage || "An unexpected error occurred."],
            });
            if (process.env.NODE_ENV === "development") {
              console.error("Client error:", errorMessage);
            }
          }
          break;
        }
      }
    },
    [],
  );

  // Auth operations with improved error handling
  const register = useCallback(
    async ({ setErrors, ...props }: RegisterProps): Promise<void> => {
      try {
        await csrf();
        setErrors(EMPTY_ERRORS);

        await axios.post(API_ENDPOINTS.REGISTER, props);
        await mutate(); // Refresh user data
      } catch (error) {
        handleApiError(error, setErrors);
      }
    },
    [csrf, mutate, handleApiError],
  );

  const login = useCallback(
    async ({
      setErrors,
      setRequire2FA,
      ...props
    }: LoginProps): Promise<void> => {
      try {
        await csrf();
        setErrors(EMPTY_ERRORS);

        const response = await axios.post(API_ENDPOINTS.LOGIN, props);

        // Check if 2FA is required
        if (response.data?.data?.two_factor_auth_required) {
          setRequire2FA?.(true);
          return;
        }

        await mutate(); // Refresh user data
      } catch (error) {
        handleApiError(error, setErrors);
      }
    },
    [csrf, mutate, handleApiError],
  );

  const verifyTwoFactor = useCallback(
    async ({ setErrors, ...props }: VerifyTwoFactorProps): Promise<void> => {
      try {
        await csrf();
        setErrors(EMPTY_ERRORS);

        await axios.post(API_ENDPOINTS.TWO_FACTOR_VERIFY, props);
        await mutate(); // Refresh user data
      } catch (error) {
        handleApiError(error, setErrors);
      }
    },
    [csrf, mutate, handleApiError],
  );

  const forgotPassword = useCallback(
    async ({
      setErrors,
      setMessage,
      email,
    }: ForgotPasswordProps): Promise<void> => {
      try {
        await csrf();
        setErrors(EMPTY_ERRORS);
        setMessage(null);

        const response = await axios.post(API_ENDPOINTS.FORGOT_PASSWORD, {
          email,
        });
        setMessage(response.data.message);
      } catch (error) {
        handleApiError(error, setErrors);
      }
    },
    [csrf, handleApiError],
  );

  const resetPassword = useCallback(
    async ({
      setErrors,
      setMessage,
      ...props
    }: ResetPasswordProps): Promise<void> => {
      try {
        await csrf();
        setErrors(EMPTY_ERRORS);
        setMessage(null);

        const response = await axios.post(API_ENDPOINTS.RESET_PASSWORD, props);
        setMessage(response.data.message);
      } catch (error) {
        handleApiError(error, setErrors);
      }
    },
    [csrf, handleApiError],
  );

  const resendEmailVerification = useCallback(
    async ({
      setErrors,
      setMessage,
    }: ResendEmailVerificationProps): Promise<void> => {
      try {
        await csrf();
        setErrors(EMPTY_ERRORS);
        const response = await axios.post(API_ENDPOINTS.EMAIL_VERIFICATION);
        setMessage(response.data.message);
      } catch (error) {
        handleApiError(error, setErrors);
      }
    },
    [csrf, handleApiError],
  );

  const logout = useCallback(async (): Promise<void> => {
    // Prevent multiple simultaneous logout calls
    if (isLoggingOutRef.current) return;
    isLoggingOutRef.current = true;

    try {
      // Always call logout API - even if user appears undefined due to 409 errors
      // The 409 error (EMAIL_VERIFICATION_REQUIRED) means user exists but needs verification
      if (
        user ||
        isAuthenticated ||
        errorStatus === HTTP_STATUS.EMAIL_VERIFICATION_REQUIRED
      ) {
        await axios.post(API_ENDPOINTS.LOGOUT);
      }

      // Clear user data from cache after server logout
      await mutate(undefined, false);
    } catch (logoutError) {
      const axiosError = logoutError as AxiosError<ApiErrorResponse>;
      if (process.env.NODE_ENV === "development") {
        console.error(
          "Logout error:",
          axiosError.response?.data?.message || axiosError.message,
        );
      }
    } finally {
      // Reset the logout flag before navigating
      isLoggingOutRef.current = false;

      // Use window.location.href for a clean navigation that resets all state
      if (typeof window !== "undefined") {
        window.location.href = LOGIN_ROUTE;
      }
    }
  }, [isAuthenticated, errorStatus, mutate, user]);

  // Two-factor authentication operations
  const setupTwoFactor = useCallback(async (): Promise<TwoFactorSetupData> => {
    await csrf();
    const response = await axios.get<ApiResponse<TwoFactorSetupData>>(
      API_ENDPOINTS.TWO_FACTOR_SETUP,
    );
    return response.data.data;
  }, [csrf]);

  const enableTwoFactor = useCallback(
    async ({
      setErrors,
      code,
    }: EnableTwoFactorProps): Promise<TwoFactorEnableData> => {
      try {
        await csrf();
        setErrors(EMPTY_ERRORS);

        const response = await axios.post<ApiResponse<TwoFactorEnableData>>(
          API_ENDPOINTS.TWO_FACTOR_ENABLE,
          { code },
        );

        // Refresh user data to reflect 2FA enabled status
        await mutate();

        return response.data.data;
      } catch (error) {
        handleApiError(error, setErrors);
        throw error;
      }
    },
    [csrf, mutate, handleApiError],
  );

  const disableTwoFactor = useCallback(async (): Promise<User> => {
    await csrf();
    const response = await axios.post<ApiResponse<User>>(
      API_ENDPOINTS.TWO_FACTOR_DISABLE,
    );

    // Refresh user data to reflect 2FA disabled status
    await mutate();

    return response.data.data;
  }, [csrf, mutate]);

  const getRecoveryCodesStatus =
    useCallback(async (): Promise<RecoveryCodesStatus> => {
      const response = await axios.get<ApiResponse<RecoveryCodesStatus>>(
        API_ENDPOINTS.TWO_FACTOR_RECOVERY_CODES,
      );
      return response.data.data;
    }, []);

  const regenerateRecoveryCodes =
    useCallback(async (): Promise<RecoveryCodesRegenerateData> => {
      await csrf();
      const response = await axios.post<
        ApiResponse<RecoveryCodesRegenerateData>
      >(API_ENDPOINTS.TWO_FACTOR_RECOVERY_CODES_REGENERATE);
      return response.data.data;
    }, [csrf]);

  // Handle authentication flow, redirects, and logout ref management
  useEffect(() => {
    // Reset logout ref when user state changes (safety net for edge cases)
    if (!isAuthenticated && !isLoading) {
      isLoggingOutRef.current = false;
    }

    // Don't run redirect effects while loading, if we don't have a router, or while logging out
    if (isLoading || !router || isLoggingOutRef.current) return;

    // Handle email verification redirect on specific error first
    if (errorStatus === HTTP_STATUS.EMAIL_VERIFICATION_REQUIRED) {
      router.push(VERIFY_EMAIL_ROUTE);
      return;
    }

    // Guest middleware: redirect authenticated users
    if (middleware === "guest" && redirectIfAuthenticated && isAuthenticated) {
      router.push(redirectIfAuthenticated);
      return;
    }

    // Auth middleware: handle verification and authentication
    if (middleware === "auth") {
      if (
        !isAuthenticated &&
        errorStatus &&
        errorStatus !== HTTP_STATUS.EMAIL_VERIFICATION_REQUIRED
      ) {
        // User is not authenticated and has an error (but not email verification required), logout to clean up
        logout();
        return;
      }

      if (isAuthenticated && !isEmailVerified) {
        // User is authenticated but email not verified
        router.push(VERIFY_EMAIL_ROUTE);
        return;
      }
    }

    // Handle email verification page redirect
    if (isOnVerifyEmailPage && isEmailVerified && redirectIfAuthenticated) {
      router.push(redirectIfAuthenticated);
    }
  }, [
    isLoading,
    router,
    errorStatus,
    middleware,
    redirectIfAuthenticated,
    isAuthenticated,
    logout,
    isEmailVerified,
    isOnVerifyEmailPage,
  ]);

  return {
    user,
    register,
    login,
    verifyTwoFactor,
    forgotPassword,
    resetPassword,
    resendEmailVerification,
    logout,
    setupTwoFactor,
    enableTwoFactor,
    disableTwoFactor,
    getRecoveryCodesStatus,
    regenerateRecoveryCodes,
    isLoading,
    error,
    isAuthenticated,
    isEmailVerified,
    isAdmin,
  };
};
