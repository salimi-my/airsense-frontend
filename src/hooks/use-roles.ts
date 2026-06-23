import { AxiosError } from "axios";
import useSWR from "swr";

import { fetcher } from "@/lib/fetcher";
import type { Params, RolesApiResponse } from "@/types";

export function useRoles({ page, per_page, search, sort }: Params) {
  const params = new URLSearchParams();

  if (page) params.set("page", String(page));
  if (per_page) params.set("per_page", String(per_page));
  if (search) params.set("search", search);
  if (sort) params.set("sort", sort);

  const { data, error, isLoading } = useSWR<RolesApiResponse, AxiosError>(
    `/api/roles?${params.toString()}`,
    fetcher,
  );

  return {
    data,
    error,
    isLoading,
  };
}
