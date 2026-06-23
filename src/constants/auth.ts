/**
 * Authentication-related constants
 */

// HTTP status codes for authentication
export const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  VALIDATION_ERROR: 422,
  EMAIL_VERIFICATION_REQUIRED: 409,
  SERVER_ERROR: 500,
} as const;

// Empty objects for performance optimization
export const EMPTY_ERRORS = {} as const;
