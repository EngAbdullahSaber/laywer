"use client";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";

import { Checkbox } from "@/components/ui/checkbox";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import Actions from "@/components/common/Actions/Actions";
import { DataTableColumnHeader } from "../tables/advanced/components/data-table-column-header";
import Link from "next/link";

interface Task {
  UserID: string;
  UserName?: string;
  Gender?: string;
  Phone?: string;
  Email?: string;
  JoinedDate?: string;
}

export const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-0.5"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-0.5 "
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex flex-row gap-2 items-center justify-start">
        <Actions viewBtn={false} title={"Users Details"} row={row} />
      </div>
    ),
  },
  {
    accessorKey: "User ID",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User ID" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex  items-center justify-center gap-2 mx-auto">
          <span className="max-w-[500px] truncate font-medium">
            {row.original.UserID}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "User Name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="User Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex  items-center justify-center gap-2 mx-auto">
          <span className="max-w-[500px] truncate font-medium">
            {row.original.UserName}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "Gender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gender" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex  items-center justify-center gap-2 mx-auto">
          <span className="max-w-[500px] truncate font-medium">
            {row.original.Gender}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "Phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex  items-center justify-center gap-2 mx-auto">
          <span className="max-w-[500px] truncate font-medium">
            {row.original.Phone}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "Email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex  items-center justify-center gap-2 mx-auto">
          <span className="max-w-[500px] truncate font-medium">
            {row.original.Email}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "Joined Date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Joined Date" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex  items-center justify-center gap-2 mx-auto">
          <span className="max-w-[500px] truncate font-medium">
            {row.original.JoinedDate}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];
