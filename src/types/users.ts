import type { ApiResponse } from "@/types/api";
import type { PaginatedResponse } from "@/types/pagination";
import type { User } from "@/types/user";

type UsersPaginatedResponse = ApiResponse<PaginatedResponse<User>>;

// Kept for compatibility with existing imports.
type UsersApiResponse = UsersPaginatedResponse;

export type { UsersApiResponse, UsersPaginatedResponse };
