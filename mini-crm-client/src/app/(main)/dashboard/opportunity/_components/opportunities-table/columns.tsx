"use client";
"use no memo";

import type { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

import type { OpportunityRow } from "./schema";
import { EditOpportunitySheet } from "../edit-opportunity-form";
import React from "react";

const healthStripSlots = Array.from({ length: 18 }, (_, index) => ({
  id: `strip-${index + 1}`,
  threshold: index + 1,
}));

// function getHealthScore(health: CustomerRow["health"]) {
//   switch (health) {
//     case "On Track":
//       return 18;
//     case "Needs Review":
//       return 11;
//     case "At Risk":
//       return 7;
//     case "On Hold":
//       return 4;
//     default:
//       return 0;
//   }
// }

export const opportunitiesColumns: ColumnDef<OpportunityRow>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all customers"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label={`Select ${row.original.id}`}
      />
    ),
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="text-sm tracking-tight">{"OP-" + row.original.id}</div>,
    enableHiding: false,
  },
  {
    accessorKey: "customerName",
    header: "Customer",
    cell: ({ row }) => (
      <div className="text-sm font-medium">
        {row.original.customerName}
      </div>
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => <div className="font-medium text-sm">{row.original.title}</div>,
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => (
      <div className="text-sm">
        {new Intl.NumberFormat("en-US").format(row.original.value)}
      </div>
    ),
  },
  {
    accessorKey: "stage",
    header: "Stage",
    cell: ({ row }) => (
      <Badge variant="outline" className="rounded-full px-2.5">
        {row.original.stage}
      </Badge>
    ),
    filterFn: "equalsString",
  },
  
  {
    id: "actions",
    header: () => <div className="text-right">Edit</div>,
    cell: ({ row }) => {
      const [isOpen, setIsOpen] = React.useState(false);
      const customer = row.original;

      return (
        <>
          <div className="text-right">
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-full text-muted-foreground hover:bg-transparent focus-visible:bg-transparent"
              onClick={() => setIsOpen(true)}
            >
              <Pencil />
              <span className="sr-only">Edit customer</span>
            </Button>
          </div>

          {isOpen && (
            <EditOpportunitySheet
              opportunity={row.original}
              open={isOpen}
              onOpenChange={setIsOpen}
            />
          )}
        </>
      );
    },
    enableHiding: false,
  },
];
