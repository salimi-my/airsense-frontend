import type { ApiResponse } from "@/types/api";
import type { PaginatedResponse } from "@/types/pagination";
import type { Role } from "@/types/role";

interface RoleWithUsersCount extends Role {
  users_count: number;
}

type RolesPaginatedResponse = ApiResponse<PaginatedResponse<RoleWithUsersCount>>;

// Kept for compatibility with existing imports.
type RolesApiResponse = RolesPaginatedResponse;

export type { RolesApiResponse, RolesPaginatedResponse, RoleWithUsersCount };
