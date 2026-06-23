import {
  useCallback,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import { DEFAULT_PARAMS } from "@/constants";
import { filtered } from "@/lib/utils";
import type { Params } from "@/types";

export function useTableParams(initialParams: Params = DEFAULT_PARAMS) {
  const [params, setParams] = useState<Params>(initialParams);

  const isFiltered = useMemo(() => filtered(params, DEFAULT_PARAMS), [params]);

  const resetFilters = useCallback(() => {
    setParams((prev) => ({
      ...DEFAULT_PARAMS,
      page: prev.page,
      per_page: prev.per_page,
      sort: prev.sort,
    }));
  }, []);

  return {
    params,
    setParams: setParams as Dispatch<SetStateAction<Params>>,
    isFiltered,
    resetFilters,
  };
}
