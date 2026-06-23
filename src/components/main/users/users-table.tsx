"use client";

import { useCallback, useMemo } from "react";

import {
  TableBulkDeleteMultiple,
  TableBulkDeleteMultipleMobile,
} from "@/components/main/table-bulk-delete-multiple";
import { TableColumnHeader } from "@/components/main/table-column-header";
import { TableFacetedFilter } from "@/components/main/table-faceted-filter";
import { TablePagination } from "@/components/main/table-pagination";
import {
  TableDesktopFrame,
  TableDesktopToolbar,
  TableMobileToolbar,
  TableQueryState,
  TableSelectAllHead,
  TableShell,
} from "@/components/main/table-shell";
import { TableSkeleton } from "@/components/main/table-skeleton";
import { UserCreate } from "@/components/main/users/user-create";
import { UserCreateFab } from "@/components/main/users/user-create-fab";
import { UsersCardRow } from "@/components/main/users/users-card-row";
import { UsersFilterDrawer } from "@/components/main/users/users-filter-drawer";
import { UsersTableRow } from "@/components/main/users/users-table-row";
import {
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useInfinitePaginatedOptions } from "@/hooks/use-infinite-paginated-options";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTableParams } from "@/hooks/use-table-params";
import { useTableSelection } from "@/hooks/use-table-selection";
import { useUser } from "@/hooks/use-user";
import { useUsers } from "@/hooks/use-users";
import { capitalizeWords } from "@/lib/utils";
import type { PaginatedResponse, RoleWithUsersCount, User } from "@/types";

const GENDER_OPTIONS = [
  { id: "male", name: "Male" },
  { id: "female", name: "Female" },
  { id: "other", name: "Other" },
];

export function UsersTable() {
  const isMobile = useIsMobile();
  const { user: loggedInUser } = useUser();
  const { params, setParams, isFiltered, resetFilters } = useTableParams();

  const rolesOptionsQuery = useInfinitePaginatedOptions<
    RoleWithUsersCount,
    RoleWithUsersCount
  >({
    endpoint: "/api/roles",
    mapOption: (role) => role,
    getItemId: (role) => role.id,
  });

  const { data: usersData, error, isLoading, mutate } = useUsers(params);

  const roles: RoleWithUsersCount[] = useMemo(
    () => rolesOptionsQuery.options,
    [rolesOptionsQuery.options],
  );
  const roleKnownOptions = useMemo(
    () =>
      rolesOptionsQuery.knownOptions.map((role) => ({
        id: role.id,
        name: capitalizeWords(role.name),
      })),
    [rolesOptionsQuery.knownOptions],
  );
  const users: PaginatedResponse<User> | null = usersData?.data ?? null;

  const pageUserIds = useMemo(
    () => users?.data.map((user) => user.id) ?? [],
    [users?.data],
  );

  const isUserSelectable = useCallback(
    (id: number) => id !== loggedInUser?.id,
    [loggedInUser?.id],
  );

  const {
    selectedIds,
    setSelectedIds,
    handleToggleSelect,
    handleToggleSelectAll,
    selectAllChecked,
    selectableCount,
  } = useTableSelection({
    params,
    pageIds: pageUserIds,
    isSelectable: isUserSelectable,
  });

  const mobileFilterConfigs = useMemo(
    () => [
      { key: "roles" as const, label: "Role", options: roleKnownOptions },
      { key: "genders" as const, label: "Gender", options: GENDER_OPTIONS },
    ],
    [roleKnownOptions],
  );

  const columnLabels = useMemo(
    () => ({
      name: "Name",
      email: "Email",
      role_id: "Role",
      gender: "Gender",
      department_id: "Department",
      email_verified_at: "Verified",
      created_at: "Created Date",
    }),
    [],
  );

  return (
    <TableShell>
      {isMobile ? (
        <TableMobileToolbar
          params={params}
          setParams={setParams}
          filterDrawer={
            <UsersFilterDrawer
              params={params}
              setParams={setParams}
              roles={roles}
              rolesHasMore={rolesOptionsQuery.hasMore}
              rolesIsLoadingMore={rolesOptionsQuery.isLoadingMore}
              rolesIsFetching={rolesOptionsQuery.isFetching}
              onRolesLoadMore={rolesOptionsQuery.loadMore}
              onRolesSearch={rolesOptionsQuery.setSearch}
              rolesSearchValue={rolesOptionsQuery.search}
            />
          }
          filterConfigs={mobileFilterConfigs}
          columnLabels={columnLabels}
        />
      ) : (
        <TableDesktopToolbar
          params={params}
          setParams={setParams}
          isFiltered={isFiltered}
          onResetFilters={resetFilters}
          filters={
            <>
              <TableFacetedFilter
                title="Roles"
                column="roles"
                params={params}
                setParams={setParams}
                options={roles}
                knownOptions={rolesOptionsQuery.knownOptions}
                hasMore={rolesOptionsQuery.hasMore}
                isLoadingMore={rolesOptionsQuery.isLoadingMore}
                onLoadMore={rolesOptionsQuery.loadMore}
                onSearch={rolesOptionsQuery.setSearch}
                searchValue={rolesOptionsQuery.search}
                isFetching={rolesOptionsQuery.isFetching}
              />
              <TableFacetedFilter
                title="Gender"
                column="genders"
                params={params}
                setParams={setParams}
                options={GENDER_OPTIONS}
              />
            </>
          }
          actions={
            <>
              {selectedIds.size > 0 && (
                <TableBulkDeleteMultiple
                  selectedIds={selectedIds}
                  setSelectedIds={setSelectedIds}
                  mutate={mutate}
                  endpoint="/api/users/bulk-delete"
                  entityName="user"
                  serializeIds={(ids) => ids.map(Number)}
                />
              )}
              <UserCreate mutate={mutate} />
            </>
          }
        />
      )}

      <TableQueryState
        isLoading={isLoading}
        error={error}
        data={users}
        resourceName="users"
        onRetry={() => mutate()}
        skeleton={
          <TableSkeleton
            columnCount={9}
            cellWidths={[
              "2.5rem",
              "12rem",
              "12rem",
              "8rem",
              "8rem",
              "8rem",
              "8rem",
              "8rem",
              "8rem",
            ]}
            shrinkZero
            mobileCard
          />
        }
      >
        {(data) => (
          <>
            {isMobile ? (
              <>
                <UsersCardRow
                  results={data}
                  loggedInUser={loggedInUser}
                  selectedIds={selectedIds}
                  handleToggleSelect={handleToggleSelect}
                  mutate={mutate}
                />
                <TableBulkDeleteMultipleMobile
                  selectedIds={selectedIds}
                  setSelectedIds={setSelectedIds}
                  mutate={mutate}
                  endpoint="/api/users/bulk-delete"
                  entityName="user"
                  serializeIds={(ids) => ids.map(Number)}
                  selectableCount={selectableCount}
                  selectAllAriaLabel="Select all users"
                  onToggleSelectAll={handleToggleSelectAll}
                />
                <UserCreateFab mutate={mutate} />
              </>
            ) : (
              <TableDesktopFrame>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8">
                      <TableSelectAllHead
                        ariaLabel="Select all users"
                        checked={selectAllChecked}
                        onCheckedChange={handleToggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>
                      <TableColumnHeader
                        title="Name"
                        column="name"
                        params={params}
                        setParams={setParams}
                      />
                    </TableHead>
                    <TableHead>
                      <TableColumnHeader
                        title="Email"
                        column="email"
                        params={params}
                        setParams={setParams}
                      />
                    </TableHead>
                    <TableHead>
                      <TableColumnHeader
                        title="Role"
                        column="role_id"
                        params={params}
                        setParams={setParams}
                      />
                    </TableHead>
                    <TableHead>
                      <TableColumnHeader
                        title="Gender"
                        column="gender"
                        params={params}
                        setParams={setParams}
                      />
                    </TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>
                      <TableColumnHeader
                        title="Verified"
                        column="email_verified_at"
                        params={params}
                        setParams={setParams}
                      />
                    </TableHead>
                    <TableHead>
                      <TableColumnHeader
                        title="Created Date"
                        column="created_at"
                        params={params}
                        setParams={setParams}
                      />
                    </TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <UsersTableRow
                    results={data}
                    loggedInUser={loggedInUser}
                    selectedIds={selectedIds}
                    handleToggleSelect={handleToggleSelect}
                    mutate={mutate}
                  />
                </TableBody>
              </TableDesktopFrame>
            )}

            <TablePagination
              total={data.total || 0}
              params={params}
              setParams={setParams}
            />
          </>
        )}
      </TableQueryState>
    </TableShell>
  );
}
