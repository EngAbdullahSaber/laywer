"use client";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Checkbox } from "@/components/ui/checkbox";
import { data } from ".";
import { DataTable } from "../../tables/advanced/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../../tables/advanced/components/data-table-column-header";
import Actions from "@/components/common/Actions/Actions";

interface Task {
  id: string;
  Category?: string;
  Describtion?: string;
}
const TableData = () => {
  const columns: ColumnDef<Task>[] = [
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
          className="t-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="t-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },

    // {
    //   id: "actions",
    //   cell: ({ row }) => (
    //     <div className="flex flex-row gap-2 items-center justify-center">
    //       <Actions title={"Contact List"} row={row} />
    //     </div>
    //   ),
    // },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"id"} />
      ),
      cell: ({ row }) => <div className="">{row.original.id}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "Category",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Category"} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex  items-center justify-center gap-2 mx-auto">
            <span className="max-w-[500px] truncate font-medium">
              {row.original.Category}
            </span>
          </div>
        );
      },
    },

    {
      accessorKey: "Describtion",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Describtion"} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex  items-center justify-center gap-2 mx-auto">
            <span className="max-w-[500px] truncate font-medium">
              {row.original.Describtion}
            </span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
  ];
  return (
    <div>
      {/* Render your data table here using the fetched tasks */}
      {/* Assuming you have a table component that takes columns and data */}
      <DataTable data={data} columns={columns} />
    </div>
  );
};

export default TableData;
