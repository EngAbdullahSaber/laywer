"use client";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Checkbox } from "@/components/ui/checkbox";
import { data } from ".";
import { ColumnDef } from "@tanstack/react-table";
import Actions from "@/components/common/Actions/Actions";
import { DataTableColumnHeader } from "../tables/advanced/components/data-table-column-header";
import { DataTable } from "../tables/advanced/components/data-table";
import View from "./View";
import TaskStatus from "./TaskStatus";

interface Task {
  id: string;
  Task_Name?: string;
  Case_Name?: string;
  Due_Date?: string;
  Task_Status?: string;
  Importance_Level?: string;
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

    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex flex-row gap-2 items-center justify-center">
          <View />
          <TaskStatus />
        </div>
      ),
    },
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
      accessorKey: "Task_Name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Task_Name"} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex  items-center justify-center gap-2 mx-auto">
            <span className="max-w-[500px] truncate font-medium">
              {row.original.Task_Name}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "Case_Name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Case_Name"} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex  items-center justify-center gap-2 mx-auto">
            <span className="max-w-[500px] truncate font-medium">
              {row.original.Case_Name}
            </span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "Importance_Level",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Importance_Level"} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex  items-center justify-center gap-2 mx-auto">
            <Badge
              className="!text-center"
              color={
                (row.original.Importance_Level === "مهمة جدا" &&
                  "destructive") ||
                (row.original.Importance_Level === "متوسطة الاهمية" &&
                  "info") ||
                (row.original.Importance_Level === "ذات اهمية ضعيفة" &&
                  "warning") ||
                "default"
              }
            >
              {row.original.Importance_Level}
            </Badge>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },

    {
      accessorKey: "Due_Date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Due_Date"} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex  items-center justify-center gap-2 mx-auto">
            <span className="max-w-[500px] truncate font-medium">
              {row.original.Due_Date}
            </span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },

    {
      accessorKey: "Task_Status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Task_Status"} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex  items-center justify-center gap-2 mx-auto">
            <Badge
              className="!text-center"
              color={
                (row.original.Task_Status === "قيد التنفيذ" && "destructive") ||
                (row.original.Task_Status === "قيد التنفيذ" && "info") ||
                (row.original.Task_Status === "مكتملة" && "warning") ||
                "default"
              }
            >
              {row.original.Task_Status}
            </Badge>
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
