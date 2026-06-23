"use client";
"use no memo";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";

import {
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type PaginationState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";

import { ChevronDownIcon, ListFilter } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { opportunitiesColumns } from "./opportunities-table/columns";
import { opportunitiesSchema } from "./opportunities-table/schema";


async function fetchOpportunities() {
  const response = await fetch(
        "/api/opportunities"
    );

    if (!response.ok) {
        throw new Error(
            `Failed to fetch opportunities: ${response.status}`
        );
    }

    return response.json();
}

export function OpportunitiesSection() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["opportunities"], // renamed
    queryFn: fetchOpportunities,
    select: (data) => ({
      opportunities: opportunitiesSchema.parse(data),
      industries: [],
    }),
  });

  const opportunities = data?.opportunities ?? [];

  const customerOptions = React.useMemo(() => {
  const unique = new Set<string>();

  opportunities.forEach((c) => {
      if (c.customerName) unique.add(c.customerName);
    });

    return ["all", ...Array.from(unique)];
  }, [opportunities]);

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility] = React.useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });


  const table = useReactTable({
    data: opportunities,
    columns: opportunitiesColumns,
    state: {
      rowSelection,
      columnFilters,
      columnVisibility,
      globalFilter,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: "includesString",
  });

  const searchQuery = table.getState().globalFilter ?? "";
  const customerFilter =
  (table.getColumn("customerName")?.getFilterValue() as string) ?? "all";
  const currentPage = table.getState().pagination.pageIndex + 1;
  const pageCount = table.getPageCount();
  const filteredCustomerCount = table.getFilteredRowModel().rows.length;
  const visibleCustomerCount = table.getRowModel().rows.length;

  const pageNumbers = React.useMemo(() => {
    if (pageCount <= 3) return Array.from({ length: pageCount }, (_, i) => i + 1);
    if (currentPage <= 2) return [1, 2, 3];
    if (currentPage >= pageCount - 1) return [pageCount - 2, pageCount - 1, pageCount];
    return [currentPage - 1, currentPage, currentPage + 1];
  }, [currentPage, pageCount]);

  function preventPaginationNavigation(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
  }

  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle className="leading-none">Recent Opportunities</CardTitle>
          <CardDescription>
            Track opportunities across manufacturing, logistics, and other industries.
          </CardDescription>
          <CardAction>
            <div className="flex items-center gap-2">
              <Input
                className="h-7 w-44 md:w-52"
                placeholder="Search opportunities..."
                value={searchQuery}
                onChange={(event) => {
                  table.setGlobalFilter(event.target.value || undefined);
                  table.setPageIndex(0);
                }}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <ListFilter data-icon="inline-start" />
                    Customers
                    <ChevronDownIcon data-icon="inline-end" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuRadioGroup
                    value={customerFilter}
                    onValueChange={(value) => {
                      table.getColumn("customerName")?.setFilterValue(
                        value === "all" ? undefined : value
                      );
                      table.setPageIndex(0);
                    }}
                  >
                    {customerOptions.map((option) => (
                      <DropdownMenuRadioItem key={option} value={option}>
                        {option === "all" ? "All Customers" : option}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 px-0">
          {isLoading && (
            <div className="h-24 text-center text-muted-foreground flex items-center justify-center">
              Loading opportunities...
            </div>
          )}
          {error && (
            <div className="h-24 text-center text-red-500 flex items-center justify-center">
              Error: {error.message}
            </div>
          )}
          {!isLoading && !error && (
            <>
              <div className="overflow-hidden">
                <Table className="**:data-[slot='table-cell']:px-4 **:data-[slot='table-head']:px-4 **:data-[slot='table-cell']:py-4">
                  <TableHeader className="border-t **:data-[slot='table-head']:h-11 **:data-[slot='table-head']:font-medium **:data-[slot='table-head']:text-foreground **:data-[slot='table-head']:text-sm">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id} colSpan={header.colSpan}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody className="**:data-[slot='table-row']:border-border/50 **:data-[slot='table-row']:hover:bg-transparent">
                    {table.getRowModel().rows.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={table.getVisibleLeafColumns().length}
                          className="h-24 text-center"
                        >
                          No results found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-between gap-4 px-4 pb-1">
                <p className="text-muted-foreground text-sm">
                  Viewing {visibleCustomerCount} out of {filteredCustomerCount.toLocaleString()} opportunities
                </p>
                <Pagination className="mx-0 w-auto justify-end">
                  <PaginationContent className="gap-1.5">
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        className={
                          !table.getCanPreviousPage()
                            ? "pointer-events-none opacity-50"
                            : undefined
                        }
                        onClick={(event) => {
                          preventPaginationNavigation(event);
                          table.previousPage();
                        }}
                      />
                    </PaginationItem>
                    {pageNumbers[0] > 1 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    {pageNumbers.map((pageNumber) => (
                      <PaginationItem key={`page-${pageNumber}`}>
                        <PaginationLink
                          href="#"
                          isActive={table.getState().pagination.pageIndex === pageNumber - 1}
                          onClick={(event) => {
                            preventPaginationNavigation(event);
                            table.setPageIndex(pageNumber - 1);
                          }}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    {pageNumbers[pageNumbers.length - 1] < pageCount && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        className={
                          !table.getCanNextPage()
                            ? "pointer-events-none opacity-50"
                            : undefined
                        }
                        onClick={(event) => {
                          preventPaginationNavigation(event);
                          table.nextPage();
                        }}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </section>
  );
}