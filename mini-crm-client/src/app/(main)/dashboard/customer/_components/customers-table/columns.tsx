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
import { useAuth } from "@/app/contexts/auth-context";

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
export const getCustomersColumns = (isAdmin: boolean): ColumnDef<CustomerRow>[] => {
const columns: ColumnDef<CustomerRow>[] = [
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
        aria-label={`Select ${row.original.name}`}
      />
    ),
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="text-sm tracking-tight">{"CT-" + row.original.id}</div>,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="font-medium text-sm">{row.original.name}</div>,
  },
  {
    accessorKey: "industry",
    header: "Industry",
    cell: ({ row }) => (
      <Badge variant="outline" className="rounded-full px-2.5">
        {row.original.industry}
      </Badge>
    ),
    filterFn: "equalsString",
  },
  {
    accessorKey: "website",
    header: "Website",
    cell: ({ row }) => <div className="text-sm">{row.original.website || "No Website"}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className="text-sm">{row.original.email}</div>,
    filterFn: "equalsString",
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => <div className="text-sm tabular-nums">{row.original.phone || "No Phone Number"}</div>,
  },
];
 if (isAdmin) {
    columns.push({
      id: "actions",
      header: () => <div className="text-right">Edit</div>,
      cell: ({ row }) => {
        const [isOpen, setIsOpen] = React.useState(false);

        return (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-full text-muted-foreground hover:bg-transparent focus-visible:bg-transparent"
              onClick={() => setIsOpen(true)}
            >
              <Pencil />
            </Button>

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
    });
  }

  return columns;
}