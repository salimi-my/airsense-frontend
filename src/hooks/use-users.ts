import { AxiosError } from "axios";
import useSWR from "swr";

import { fetcher } from "@/lib/fetcher";
import type { Params, UsersApiResponse } from "@/types";

export function useUsers({
  page,
  per_page,
  search,
  sort,
  roles,
  genders,
}: Params) {
  const params = new URLSearchParams();

  if (page) params.set("page", String(page));
  if (per_page) params.set("per_page", String(per_page));
  if (search) params.set("search", search);
  if (sort) params.set("sort", sort);
  if (roles) params.set("roles", roles.join(","));
  if (genders) params.set("genders", genders.join(","));

  const { data, error, isLoading, mutate } = useSWR<
    UsersApiResponse,
    AxiosError
  >(`/api/users?${params.toString()}`, fetcher, { keepPreviousData: true });

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}
