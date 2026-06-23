"use client";
"use no memo";

import type { ColumnDef } from "@tanstack/react-table";
import { Download, Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

import type { NoteRow } from "./schema";
// import { EditNoteSheet } from "../edit-note-form";
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

export const notesColumns: ColumnDef<NoteRow>[] = [
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
    cell: ({ row }) => <div className="text-sm tracking-tight">{"DC-" + row.original.id}</div>,
    enableHiding: false,
  },
  {
    accessorKey: "fileName",
    header: "Document Name",
    cell: ({ row }) => (
      <div className="text-sm font-medium">
        {row.original.fileName}
      </div>
    ),
  },
  {
    accessorKey: "extension",
    header: "Extension",
    cell: ({ row }) => (
      <div className="max-w-xl truncate text-sm font-medium">
        {row.original.extension.toUpperCase()}
      </div>
    ),
  },

  {
    accessorKey: "uploadedAt",
    header: "Uploaded At",
    cell: ({ row }) => (
      <div className="max-w-xl truncate text-sm font-medium">
        {new Date(row.original.uploadedAt).toLocaleDateString()}
      </div>
    ),
  },
  
  {
    id: "actions",
    header: () => <div className="text-right">Download</div>,
    cell: ({ row }) => {
      const document = row.original;

      const handleDownload = () => {
          window.open(
              `/api/documents/${document.id}/download`,
              "_blank"
          );
      };

      return (
        <div className="text-right">
          <Button
            variant="ghost"
            size="icon"
            className="size-8 rounded-full text-muted-foreground hover:bg-transparent focus-visible:bg-transparent"
            onClick={handleDownload}
          >
            <Download className="size-4" />
            <span className="sr-only">
              Download {document.fileName}
            </span>
          </Button>
        </div>
      );
    },
    enableHiding: false,
  },
];
