"use client";

import { CrossCircledIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {
  memo,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";
import type { Params } from "@/types";

interface TableSearchbarProps {
  params: Params;
  setParams: Dispatch<SetStateAction<Params>>;
  showClearButton?: boolean;
  fullWidth?: boolean;
}

const SearchIcon = memo(() => (
  <MagnifyingGlassIcon className="text-muted-foreground size-4" />
));
SearchIcon.displayName = "SearchIcon";

export function TableSearchbar({
  params,
  setParams,
  showClearButton = false,
  fullWidth = false,
}: TableSearchbarProps) {
  const [searchTerm, setSearchTerm] = useState(params.search || "");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const skipExternalSync = useRef(false);

  useEffect(() => {
    const nextSearch = debouncedSearch || undefined;
    let didUpdate = false;

    setParams((prev) => {
      if (prev.search === nextSearch) return prev;
      didUpdate = true;
      return { ...prev, page: 1, search: nextSearch };
    });

    if (didUpdate) {
      skipExternalSync.current = true;
    }
  }, [debouncedSearch, setParams]);

  useEffect(() => {
    if (skipExternalSync.current) {
      skipExternalSync.current = false;
      return;
    }

    setSearchTerm(params.search || "");
  }, [params.search]);

  const handleClear = () => {
    setSearchTerm("");
  };

  return (
    <InputGroup
      className={cn(
        "h-8 w-full ring-inset has-[[data-slot=input-group-control]:focus-visible]:ring-1",
        fullWidth ? "w-full" : "md:w-[250px]",
      )}
    >
      <InputGroupInput
        placeholder="Search..."
        aria-label="Search"
        name="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="h-8"
      />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        {showClearButton && searchTerm && (
          <InputGroupButton
            variant="ghost"
            size="icon-xs"
            onClick={handleClear}
            aria-label="Clear search"
            className="rounded-full"
          >
            <CrossCircledIcon className="size-4" />
          </InputGroupButton>
        )}
      </InputGroupAddon>
    </InputGroup>
  );
}
