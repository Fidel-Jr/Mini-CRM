"use client";
"use no memo";

import type { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

import type { CustomerRow } from "./schema";
import { EditCustomerSheet } from "../edit-customer-form";
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

export const customersColumns: ColumnDef<CustomerRow>[] = [
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
        aria-label={`Select ${row.original.firstName}`}
      />
    ),
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="text-sm tracking-tight">{"CN-" + row.original.id}</div>,
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
    accessorKey: "firstName",
    header: "First Name",
    cell: ({ row }) => <div className="font-medium text-sm">{row.original.firstName}</div>,
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
    cell: ({ row }) => <div className="text-sm">{row.original.lastName || "No Lastname"}</div>,
  },
  {
    accessorKey: "position",
    header: "Position",
    cell: ({ row }) => (
      <Badge variant="outline" className="rounded-full px-2.5">
        {row.original.position}
      </Badge>
    ),
    filterFn: "equalsString",
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className="text-sm">{row.original.email}</div>,
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
            <EditCustomerSheet
              customer={row.original}
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
