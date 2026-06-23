import type { Role } from "@/types/role";

interface User {
  id: number;
  role_id: number | null;
  name: string;
  email: string;
  pending_email: string | null;
  email_change_requested_at: string | null;
  phone: string | null;
  gender: "male" | "female" | "other" | null;
  email_verified_at: string | null;
  avatar: string | null;
  avatar_url: string | null;
  has_password: boolean;
  created_at: string;
  updated_at: string;
  two_factor_enabled: boolean;
  google_id: string | null;
  github_id: string | null;
  role: Role | null;
}

type BasicUser = Pick<User, "id" | "name" | "email" | "avatar_url">;

export type { BasicUser, User };
export type { Role } from "@/types/role";
