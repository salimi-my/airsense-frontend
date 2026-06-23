"use client";

import { Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function BreadcrumbContent() {
  const paths = usePathname();
  const pathNames = paths.split("/").filter((path) => path);

  if (paths === "/dashboard") {
    return null;
  }

  const formatItemName = (item: string) => {
    return item
      .split("-")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Collapse breadcrumb if there are more than 3 items
  const shouldCollapse = pathNames.length > 3;
  const ITEMS_TO_DISPLAY = 2; // Show first 2 items, then ellipsis, then last item

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/" className="flex items-center">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {pathNames.length > 0 && <BreadcrumbSeparator />}
        {pathNames.length > 0 && (
          <>
            {shouldCollapse ? (
              <>
                {/* Show first items */}
                {pathNames.slice(0, ITEMS_TO_DISPLAY).map((item, index) => {
                  const href = `/${pathNames.slice(0, index + 1).join("/")}`;
                  const itemName = formatItemName(item);
                  return (
                    <Fragment key={index}>
                      <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                          <Link href={href}>{itemName}</Link>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                    </Fragment>
                  );
                })}

                {/* Collapsible dropdown for middle items */}
                <BreadcrumbItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="hover:bg-muted flex cursor-pointer items-center gap-1 rounded-sm p-1">
                      <BreadcrumbEllipsis className="h-4 w-4" />
                      <span className="sr-only">Toggle menu</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {pathNames
                        .slice(ITEMS_TO_DISPLAY, -1)
                        .map((item, index) => {
                          const actualIndex = index + ITEMS_TO_DISPLAY;
                          const href = `/${pathNames.slice(0, actualIndex + 1).join("/")}`;
                          const itemName = formatItemName(item);
                          return (
                            <DropdownMenuItem key={actualIndex} asChild>
                              <Link href={href} className="cursor-pointer">
                                {itemName}
                              </Link>
                            </DropdownMenuItem>
                          );
                        })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </BreadcrumbItem>
                <BreadcrumbSeparator />

                {/* Show last item */}
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {formatItemName(pathNames[pathNames.length - 1])}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : (
              /* Show all items if not too many */
              pathNames.map((item, index) => {
                const href = `/${pathNames.slice(0, index + 1).join("/")}`;
                const itemName = formatItemName(item);
                if (paths === href) {
                  return (
                    <BreadcrumbItem key={index}>
                      <BreadcrumbPage>{itemName}</BreadcrumbPage>
                    </BreadcrumbItem>
                  );
                }
                return (
                  <Fragment key={index}>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link href={href}>{itemName}</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </Fragment>
                );
              })
            )}
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
