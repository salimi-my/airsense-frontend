import { useEffect, useMemo, useState } from "react";
import useSWRInfinite from "swr/infinite";

import { useDebounce } from "@/hooks/use-debounce";

import { fetcher } from "@/lib/fetcher";
import type { ApiResponse, PaginatedResponse } from "@/types";

type QueryValue =
  | string
  | number
  | boolean
  | Array<string | number>
  | undefined;

type CollectionPayload<T> = PaginatedResponse<T> | T[];

interface UseInfinitePaginatedOptionsParams<TItem, TOption> {
  /** API endpoint to fetch paginated items from (e.g. `"/api/roles"`). */
  endpoint: string;
  /** Static query params merged into every request (e.g. `{ status: "active" }`). */
  query?: Record<string, QueryValue>;
  /** Transform a raw API item into the option shape consumed by the UI. */
  mapOption: (item: TItem) => TOption;
  /** Return a stable unique identifier for an item. Used to deduplicate across pages. */
  getItemId?: (item: TItem) => string | number;
  /** Number of items to request per page. Defaults to `10`. */
  perPage?: number;
  /** Set to `false` to skip fetching entirely (e.g. when a parent dependency isn't ready). Defaults to `true`. */
  enabled?: boolean;
  /**
   * Query-string key used for server-side search. Defaults to `"search"`.
   * Override if your API expects a different param name (e.g. `"q"`).
   */
  searchKey?: string;
  /** Debounce delay in ms applied to `setSearch` before the API request fires. Defaults to `300`. */
  searchDebounce?: number;
}

interface UseInfinitePaginatedOptionsResult<TItem, TOption> {
  /** Raw deduplicated items across all loaded pages. */
  items: TItem[];
  /** Items transformed via `mapOption` — ready to pass to filter dropdown lists. */
  options: TOption[];
  /**
   * Accumulated options from every fetch (all searches and pages).
   * Use for resolving labels of selected filters that may no longer appear in `options`.
   */
  knownOptions: TOption[];
  /** `true` while the very first page is loading and no data exists yet. */
  isLoadingInitial: boolean;
  /** `true` while an additional page is being fetched (infinite scroll). */
  isLoadingMore: boolean;
  /** `true` whenever any request is in flight (initial load, re-search, or load-more). Use this to show spinners in filter UIs. */
  isFetching: boolean;
  /** `true` when there are further pages available to load. */
  hasMore: boolean;
  /** Fetch the next page. No-op if `hasMore` is `false` or a request is already in flight. */
  loadMore: () => void;
  /** Current search input value. Pass to filter components as `searchValue` for a controlled input. */
  search: string;
  /**
   * Update the server-side search query.
   * The value is debounced before being sent, and the page index resets to 1 on each new search.
   * Pass directly to `TableFacetedFilter`'s `onSearch` prop or `FilterGroup`'s `onSearch` prop.
   */
  setSearch: (value: string) => void;
  /** SWR fetch error, if any. */
  error: unknown;
}

function buildQueryString(query: Record<string, QueryValue>) {
  const params = new URLSearchParams();

  Object.entries(query)
    .filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    )
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([key, value]) => {
      if (Array.isArray(value)) {
        if (value.length > 0) {
          params.set(key, value.map(String).join(","));
        }
      } else {
        params.set(key, String(value));
      }
    });

  return params;
}

/**
 * Fetches a paginated list of items from an API endpoint with infinite-scroll support and optional server-side search.
 *
 * @example
 * // Basic usage — load all pages, no search
 * const query = useInfinitePaginatedOptions({
 *   endpoint: "/api/roles",
 *   mapOption: (role) => role,
 *   getItemId: (role) => role.id,
 * });
 *
 * <TableFacetedFilter
 *   options={query.options}
 *   hasMore={query.hasMore}
 *   isLoadingMore={query.isLoadingMore}
 *   onLoadMore={query.loadMore}
 * />
 *
 * @example
 * // With server-side search — typing in the filter sends a debounced `?search=` request
 * const query = useInfinitePaginatedOptions({
 *   endpoint: "/api/roles",
 *   mapOption: (role) => role,
 *   getItemId: (role) => role.id,
 * });
 *
 * <TableFacetedFilter
 *   options={query.options}
 *   hasMore={query.hasMore}
 *   isLoadingMore={query.isLoadingMore}
 *   isFetching={query.isFetching}
 *   onLoadMore={query.loadMore}
 *   onSearch={query.setSearch}
 *   searchValue={query.search}
 * />
 */
export function useInfinitePaginatedOptions<TItem, TOption>({
  endpoint,
  query = {},
  mapOption,
  getItemId,
  perPage = 10,
  enabled = true,
  searchKey = "search",
  searchDebounce = 300,
}: UseInfinitePaginatedOptionsParams<
  TItem,
  TOption
>): UseInfinitePaginatedOptionsResult<TItem, TOption> {
  const [searchQuery, setSearch] = useState("");
  const debouncedSearch = useDebounce(searchQuery, searchDebounce);

  const queryParams = buildQueryString({
    ...query,
    ...(debouncedSearch ? { [searchKey]: debouncedSearch } : {}),
  });
  const queryParamsString = queryParams.toString();

  const getKey = (
    pageIndex: number,
    previousPageData: ApiResponse<CollectionPayload<TItem>> | null,
  ) => {
    if (!enabled) {
      return null;
    }

    if (previousPageData && !Array.isArray(previousPageData.data)) {
      const { current_page, last_page } = previousPageData.data;
      if (current_page >= last_page) {
        return null;
      }
    }

    const params = new URLSearchParams(queryParams.toString());
    params.set("page", String(pageIndex + 1));
    params.set("per_page", String(perPage));

    return `${endpoint}?${params.toString()}`;
  };

  const { data, size, setSize, isLoading, isValidating, error } =
    useSWRInfinite<ApiResponse<CollectionPayload<TItem>>>(getKey, fetcher, {
      revalidateFirstPage: false,
    });

  useEffect(() => {
    void setSize(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParamsString]);

  const pages = data ?? [];
  const rawItems = pages.flatMap((page) =>
    Array.isArray(page.data) ? page.data : page.data.data,
  );

  const items = useMemo(() => {
    if (!getItemId) {
      return rawItems;
    }

    const seen = new Set<string>();
    const uniqueItems: TItem[] = [];

    rawItems.forEach((item) => {
      const id = String(getItemId(item));
      if (!seen.has(id)) {
        seen.add(id);
        uniqueItems.push(item);
      }
    });

    return uniqueItems;
  }, [getItemId, rawItems]);

  const options = useMemo(() => items.map(mapOption), [items, mapOption]);

  const [knownOptionsMap, setKnownOptionsMap] = useState(
    () => new Map<string, TOption>(),
  );

  const pendingKnownOptionsMap = useMemo(() => {
    const next = new Map(knownOptionsMap);
    let changed = false;

    items.forEach((item) => {
      const id = getItemId
        ? String(getItemId(item))
        : String(mapOption(item));
      if (!next.has(id)) {
        next.set(id, mapOption(item));
        changed = true;
      }
    });

    return changed ? next : knownOptionsMap;
  }, [items, mapOption, getItemId, knownOptionsMap]);

  if (pendingKnownOptionsMap !== knownOptionsMap) {
    setKnownOptionsMap(pendingKnownOptionsMap);
  }

  const knownOptions = useMemo(
    () => Array.from(pendingKnownOptionsMap.values()),
    [pendingKnownOptionsMap],
  );

  const lastPage = pages[pages.length - 1];
  const hasMore =
    !lastPage || Array.isArray(lastPage.data)
      ? false
      : lastPage.data.current_page < lastPage.data.last_page;

  const isLoadingMore = isValidating && pages.length > 0;

  const loadMore = () => {
    if (!hasMore || isLoadingMore) {
      return;
    }
    void setSize(size + 1);
  };

  return {
    items,
    options,
    knownOptions,
    isLoadingInitial: isLoading,
    isLoadingMore,
    isFetching: isValidating,
    hasMore,
    loadMore,
    search: searchQuery,
    setSearch,
    error,
  };
}
