interface FilterOption {
  id: number | string;
  name: string;
}

interface Params {
  page?: number;
  per_page?: number;
  search?: string;
  sort?: string;
  tags?: string[];
  countries?: string[];
  roles?: string[];
  genders?: string[];
  start_date?: string;
  end_date?: string;
}

type NonFacetedParamKey =
  | "page"
  | "per_page"
  | "search"
  | "sort"
  | "start_date"
  | "end_date";

export type ArrayFilterParamKey = Exclude<keyof Params, NonFacetedParamKey>;

export type { FilterOption, Params };
