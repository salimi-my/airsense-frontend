"use client";

import {
  Calendar,
  CircleCheckBig,
  Mail,
  ShieldUser,
  User2,
  VenusAndMars,
} from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

const GENDER_OPTIONS = [
  { id: "male", name: "Male" },
  { id: "female", name: "Female" },
  { id: "other", name: "Other" },
];

import {
  FilterDrawer,
  type FilterGroup,
  type SortColumn,
} from "@/components/main/table-filter-drawer";
import type { Params, RoleWithUsersCount } from "@/types";

interface UsersFilterDrawerProps {
  /** Current table query params. */
  params: Params;
  setParams: Dispatch<SetStateAction<Params>>;
  /** Loaded role options to display in the Roles filter group. */
  roles: RoleWithUsersCount[];
  /** `true` when more role pages are available. Pass `rolesOptionsQuery.hasMore`. */
  rolesHasMore?: boolean;
  /** `true` while the next roles page is loading. Pass `rolesOptionsQuery.isLoadingMore`. */
  rolesIsLoadingMore?: boolean;
  /** `true` whenever a roles request is in flight. Pass `rolesOptionsQuery.isFetching`. */
  rolesIsFetching?: boolean;
  /** Fetches the next page of roles. Pass `rolesOptionsQuery.loadMore`. */
  onRolesLoadMore?: () => void;
  /** Updates the server-side roles search query. Pass `rolesOptionsQuery.setSearch`. */
  onRolesSearch?: (value: string) => void;
  /** Current roles search input value. Pass `rolesOptionsQuery.search`. */
  rolesSearchValue?: string;
}

const sortColumns: SortColumn[] = [
  { value: "name", label: "Name", icon: User2 },
  { value: "email", label: "Email", icon: Mail },
  { value: "role_id", label: "Role", icon: ShieldUser },
  { value: "gender", label: "Gender", icon: VenusAndMars },
  { value: "email_verified_at", label: "Verified", icon: CircleCheckBig },
  { value: "created_at", label: "Created Date", icon: Calendar },
];

/**
 * Mobile filter + sort drawer pre-configured for the Users table.
 *
 * Wraps `FilterDrawer` with a Roles filter group and the standard Users sort columns.
 * Pass the relevant fields from `useInfinitePaginatedOptions` to enable server-side
 * role search with infinite scroll and loading indicators.
 *
 * @example
 * const rolesQuery = useInfinitePaginatedOptions({ endpoint: "/api/roles", ... });
 *
 * <UsersFilterDrawer
 *   params={params}
 *   setParams={setParams}
 *   roles={rolesQuery.options}
 *   rolesHasMore={rolesQuery.hasMore}
 *   rolesIsLoadingMore={rolesQuery.isLoadingMore}
 *   rolesIsFetching={rolesQuery.isFetching}
 *   onRolesLoadMore={rolesQuery.loadMore}
 *   onRolesSearch={rolesQuery.setSearch}
 *   rolesSearchValue={rolesQuery.search}
 * />
 *
 * @param props.params - Current table query params.
 * @param props.setParams - State setter for the table query params.
 * @param props.roles - Loaded role options. Pass `rolesOptionsQuery.options`.
 * @param props.rolesHasMore - `true` when more role pages are available. Pass `rolesOptionsQuery.hasMore`.
 * @param props.rolesIsLoadingMore - `true` while the next roles page is loading. Pass `rolesOptionsQuery.isLoadingMore`.
 * @param props.rolesIsFetching - `true` whenever a roles request is in flight. Pass `rolesOptionsQuery.isFetching`.
 * @param props.onRolesLoadMore - Fetches the next page of roles. Pass `rolesOptionsQuery.loadMore`.
 * @param props.onRolesSearch - Updates the server-side roles search query. Pass `rolesOptionsQuery.setSearch`.
 * @param props.rolesSearchValue - Current roles search input value. Pass `rolesOptionsQuery.search`.
 */
export function UsersFilterDrawer({
  params,
  setParams,
  roles,
  rolesHasMore = false,
  rolesIsLoadingMore = false,
  rolesIsFetching = false,
  onRolesLoadMore,
  onRolesSearch,
  rolesSearchValue,
}: UsersFilterDrawerProps) {
  const filterGroups: FilterGroup[] = [
    {
      key: "roles",
      label: "Roles",
      options: roles,
      paramKey: "roles",
      hasMore: rolesHasMore,
      isLoadingMore: rolesIsLoadingMore,
      isFetching: rolesIsFetching,
      onLoadMore: onRolesLoadMore,
      onSearch: onRolesSearch,
      searchValue: rolesSearchValue,
    },
    {
      key: "genders",
      label: "Gender",
      options: GENDER_OPTIONS,
      paramKey: "genders",
    },
  ];

  return (
    <FilterDrawer
      params={params}
      setParams={setParams}
      filterGroups={filterGroups}
      sortColumns={sortColumns}
      title="Filters & Sort"
      description="Filter and sort the users list"
      sortMaxHeight="max-h-[165px]"
    />
  );
}
