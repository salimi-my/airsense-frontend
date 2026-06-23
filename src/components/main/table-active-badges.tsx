"use client";

import { ArrowDown, ArrowUp, Ban, X } from "lucide-react";
import { useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DEFAULT_PARAMS } from "@/constants";
import type { FilterOption, Params } from "@/types";

/**
 * TableActiveBadges - A reusable component for displaying active filters and sort badges
 *
 * @example
 * // For Users table
 * <TableActiveBadges
 *   params={params}
 *   setParams={setParams}
 *   filterConfigs={[
 *     { key: "roles", label: "Role", options: roles }
 *   ]}
 *   columnLabels={{
 *     name: "Name",
 *     email: "Email",
 *     role_id: "Role",
 *     email_verified_at: "Verified",
 *     created_at: "Created Date"
 *   }}
 * />
 *
 * @example
 * // For Participants table with multiple filters
 * <TableActiveBadges
 *   params={params}
 *   setParams={setParams}
 *   filterConfigs={[
 *     { key: "statuses", label: "Status", options: statuses },
 *     { key: "categories", label: "Category", options: categories }
 *   ]}
 *   columnLabels={{
 *     name: "Name",
 *     phone: "Phone",
 *     created_at: "Created Date"
 *   }}
 * />
 */

interface ColumnLabel {
  [key: string]: string;
}

interface TableActiveBadgesProps {
  params: Params;
  setParams: React.Dispatch<React.SetStateAction<Params>>;
  filterConfigs?: {
    key: keyof Params;
    label: string;
    options: FilterOption[];
  }[];
  columnLabels?: ColumnLabel;
}

export function TableActiveBadges({
  params,
  setParams,
  filterConfigs = [],
  columnLabels = {},
}: TableActiveBadgesProps) {
  // Check if there are filters or sort other than search
  const hasNonSearchFilters = useMemo(() => {
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      search: _search,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      page: _page,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      per_page: _perPage,
      ...otherFilters
    } = params;
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      search: _defaultSearch,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      page: _defaultPage,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      per_page: _defaultPerPage,
      ...defaultOtherFilters
    } = DEFAULT_PARAMS;
    return JSON.stringify(otherFilters) !== JSON.stringify(defaultOtherFilters);
  }, [params]);

  const removeFilter = (filterKey: keyof Params, valueToRemove: string) => {
    setParams((prev) => {
      const filtered = (prev[filterKey] as string[])?.filter(
        (id) => id !== valueToRemove,
      );
      return {
        ...prev,
        page: 1,
        [filterKey]: filtered?.length ? filtered : undefined,
      };
    });
  };

  const removeSort = () => {
    setParams((prev) => ({
      ...prev,
      sort: undefined,
    }));
  };

  const getSortLabel = (sort: string | undefined) => {
    if (!sort) return null;
    const [column, direction] = sort.split(".");
    const defaultColumnLabels: ColumnLabel = {
      name: "Name",
      email: "Email",
      role_id: "Role",
      email_verified_at: "Verified",
      created_at: "Created Date",
      ...columnLabels,
    };
    return {
      label: defaultColumnLabels[column] || column,
      direction: direction as "asc" | "desc",
    };
  };

  // Don't render if no filters or sort applied (excluding search)
  if (!hasNonSearchFilters) {
    return null;
  }

  return (
    <div className="flex w-full items-center justify-between gap-3">
      <div className="flex [scrollbar-width:none] items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
        {/* Dynamic Filters */}
        {filterConfigs.map((config) => {
          const filterValues = params[config.key] as string[] | undefined;
          if (!filterValues || filterValues.length === 0) return null;

          return filterValues.map((value) => {
            const option = config.options.find(
              (opt) => opt.id.toString() === value,
            );
            if (!option) return null;

            return (
              <Badge
                key={`${config.key}-${value}`}
                variant="secondary"
                className="gap-1 px-2 text-xs"
              >
                {config.label}: {option.name}
                <button
                  onClick={() => removeFilter(config.key, value)}
                  className="hover:bg-muted ml-1 rounded-full"
                  aria-label={`Remove ${option.name} filter`}
                >
                  <X className="size-3" />
                </button>
              </Badge>
            );
          });
        })}

        {/* Sort Badge */}
        {params.sort && getSortLabel(params.sort) && (
          <Badge variant="secondary" className="gap-1 px-2 text-xs">
            Sort: {getSortLabel(params.sort)?.label}
            {getSortLabel(params.sort)?.direction === "asc" ? (
              <ArrowUp className="size-3" />
            ) : (
              <ArrowDown className="size-3" />
            )}
            <button
              onClick={removeSort}
              className="hover:bg-muted ml-1 rounded-full"
              aria-label="Remove sort"
            >
              <X className="size-3" />
            </button>
          </Badge>
        )}
      </div>

      {/* Reset All Button */}
      {hasNonSearchFilters && (
        <Button
          variant="outline"
          size="sm"
          className="h-5.5 rounded-full text-xs"
          onClick={() =>
            setParams({
              ...DEFAULT_PARAMS,
              page: params.page,
              per_page: params.per_page,
            })
          }
        >
          <Ban className="size-3" />
          Reset
        </Button>
      )}
    </div>
  );
}
