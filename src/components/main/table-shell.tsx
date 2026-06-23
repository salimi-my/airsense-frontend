"use client";

import { X } from "lucide-react";
import type { Dispatch, ReactNode, SetStateAction } from "react";

import { TableActiveBadges } from "@/components/main/table-active-badges";
import { TableFetchError } from "@/components/main/table-fetch-error";
import { TableSearchbar } from "@/components/main/table-searchbar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table } from "@/components/ui/table";
import type { Params } from "@/types";

type FilterConfig = {
  key: keyof Params;
  label: string;
  options: { id: number | string; name: string }[];
};

type ColumnLabels = Record<string, string>;

export function TableShell({ children }: { children: ReactNode }) {
  return (
    <div className="w-full space-y-4 overflow-visible md:overflow-auto">
      {children}
    </div>
  );
}

interface TableMobileToolbarProps {
  params: Params;
  setParams: Dispatch<SetStateAction<Params>>;
  filterDrawer: ReactNode;
  filterConfigs: FilterConfig[];
  columnLabels: ColumnLabels;
}

export function TableMobileToolbar({
  params,
  setParams,
  filterDrawer,
  filterConfigs,
  columnLabels,
}: TableMobileToolbarProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <TableSearchbar
            params={params}
            setParams={setParams}
            showClearButton={true}
          />
        </div>
        {filterDrawer}
      </div>
      <TableActiveBadges
        params={params}
        setParams={setParams}
        filterConfigs={filterConfigs}
        columnLabels={columnLabels}
      />
    </div>
  );
}

interface TableDesktopToolbarProps {
  params: Params;
  setParams: Dispatch<SetStateAction<Params>>;
  isFiltered: boolean;
  onResetFilters: () => void;
  filters: ReactNode;
  actions: ReactNode;
}

export function TableDesktopToolbar({
  params,
  setParams,
  isFiltered,
  onResetFilters,
  filters,
  actions,
}: TableDesktopToolbarProps) {
  return (
    <div className="flex w-full items-center justify-between space-x-2 overflow-auto">
      <div className="flex flex-1 items-center space-x-2">
        <TableSearchbar params={params} setParams={setParams} />
        {filters}
        {isFiltered && (
          <Button
            aria-label="Reset filters"
            variant="ghost"
            className="h-8 px-2 lg:px-3"
            onClick={onResetFilters}
          >
            Reset
            <X className="ml-2 size-4" aria-hidden="true" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">{actions}</div>
    </div>
  );
}

interface TableQueryStateProps<T> {
  isLoading: boolean;
  error: unknown;
  data: T | null | undefined;
  resourceName: string;
  onRetry: () => void;
  skeleton: ReactNode;
  children: (data: T) => ReactNode;
}

export function TableQueryState<T>({
  isLoading,
  error,
  data,
  resourceName,
  onRetry,
  skeleton,
  children,
}: TableQueryStateProps<T>) {
  if (isLoading) return skeleton;

  if (error) {
    return <TableFetchError resource={resourceName} onRetry={onRetry} />;
  }

  if (!data) return null;

  return children(data);
}

export function TableDesktopFrame({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-md border">
      <Table>{children}</Table>
    </div>
  );
}

interface TableSelectAllHeadProps {
  ariaLabel: string;
  checked: boolean | "indeterminate";
  onCheckedChange: () => void;
}

export function TableSelectAllHead({
  ariaLabel,
  checked,
  onCheckedChange,
}: TableSelectAllHeadProps) {
  return (
    <Checkbox
      aria-label={ariaLabel}
      checked={checked}
      onCheckedChange={onCheckedChange}
    />
  );
}
