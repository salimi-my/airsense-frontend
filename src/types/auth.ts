import type { User } from "@/types/user";
import { AxiosError } from "axios";

/**
 * Auth-related type definitions for the authentication system
 */

// OAuth provider types
export type OAuthProvider = "google" | "github";

export interface LinkedProvider {
  provider: OAuthProvider;
  isLinked: boolean;
  label: string;
}

// API Error response structure from Laravel
export interface ApiErrorResponse {
  message?: string;
  errors?: AuthErrors;
}

export interface AuthErrors {
  [key: string]: string[];
}

export interface AuthError {
  type: "UNAUTHORIZED" | "NETWORK_ERROR" | "SERVER_ERROR" | "VALIDATION_ERROR";
  message: string;
  status?: number;
}

export interface UseAuthProps {
  /** Middleware type to apply authentication checks */
  middleware?: "auth" | "guest";
  /** Route to redirect to when user is authenticated (for guest middleware) */
  redirectIfAuthenticated?: string;
}

// Base interface for all auth operations
interface BaseAuthProps {
  setErrors: (errors: AuthErrors) => void;
}

export interface RegisterProps extends BaseAuthProps {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface LoginProps extends BaseAuthProps {
  setRequire2FA?: (require2FA: boolean) => void;
  email: string;
  password: string;
  remember?: boolean;
}

export interface VerifyTwoFactorProps extends BaseAuthProps {
  email: string;
  code: string;
}

export interface ForgotPasswordProps extends BaseAuthProps {
  setMessage: (message: string | null) => void;
  email: string;
}

export interface ResetPasswordProps extends BaseAuthProps {
  setMessage: (message: string | null) => void;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface ResendEmailVerificationProps extends BaseAuthProps {
  setMessage: (message: string) => void;
}

// Two-factor authentication types
export interface TwoFactorSetupData {
  secret: string;
  qr_code_url: string;
  qr_code_svg: string;
}

export interface TwoFactorEnableData {
  user: User;
  recovery_codes: string[];
}

export interface RecoveryCodesStatus {
  total_codes: number;
  unused_codes: number;
  used_codes: number;
  has_unused_codes: boolean;
}

export interface RecoveryCodesRegenerateData {
  recovery_codes: string[];
  message: string;
}

export interface EnableTwoFactorProps extends BaseAuthProps {
  code: string;
}

// Email change types
export interface EmailChangeStatus {
  has_pending_change: boolean;
  pending_email: string | null;
  requested_at: string | null;
}

export interface EmailChangeRequest {
  new_email: string;
  password: string;
}

export interface UseAuthReturn {
  /** Current authenticated user or undefined if not authenticated */
  user: User | undefined;
  /** Register a new user */
  register: (props: RegisterProps) => Promise<void>;
  /** Login with email and password */
  login: (props: LoginProps) => Promise<void>;
  /** Verify two-factor authentication code */
  verifyTwoFactor: (props: VerifyTwoFactorProps) => Promise<void>;
  /** Send forgot password email */
  forgotPassword: (props: ForgotPasswordProps) => Promise<void>;
  /** Reset password with token */
  resetPassword: (props: ResetPasswordProps) => Promise<void>;
  /** Resend email verification */
  resendEmailVerification: (
    props: ResendEmailVerificationProps,
  ) => Promise<void>;
  /** Logout current user */
  logout: () => Promise<void>;
  /** Setup two-factor authentication */
  setupTwoFactor: () => Promise<TwoFactorSetupData>;
  /** Enable two-factor authentication */
  enableTwoFactor: (
    props: EnableTwoFactorProps,
  ) => Promise<TwoFactorEnableData>;
  /** Disable two-factor authentication */
  disableTwoFactor: () => Promise<User>;
  /** Get recovery codes status */
  getRecoveryCodesStatus: () => Promise<RecoveryCodesStatus>;
  /** Regenerate recovery codes */
  regenerateRecoveryCodes: () => Promise<RecoveryCodesRegenerateData>;
  /** Whether user data is currently loading */
  isLoading: boolean;
  /** Error from the user fetch request */
  error: AxiosError | undefined;
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Whether user's email is verified */
  isEmailVerified: boolean;
  /** Whether user has admin role */
  isAdmin: boolean;
}
