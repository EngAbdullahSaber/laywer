"use client";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Checkbox } from "@/components/ui/checkbox";
import { data } from ".";
import { ColumnDef } from "@tanstack/react-table";
import Actions from "@/components/common/Actions/Actions";
import { DataTableColumnHeader } from "../../tables/advanced/components/data-table-column-header";
import { DataTable } from "../../tables/advanced/components/data-table";
import View from "./View";
import Block from "./Block";
import Delete from "./Delete";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslate } from "@/config/useTranslation";
interface Task {
  id: string;
  Name?: string;
  Address?: string;
  Mobile_Number?: string;
  Email?: string;
  Category?: string;
}
const TableData = () => {
  const { t, loading, error } = useTranslate();

  const columns: ColumnDef<Task>[] = [
    // {
    //   id: "select",
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={
    //         table.getIsAllPageRowsSelected() ||
    //         (table.getIsSomePageRowsSelected() && "indeterminate")
    //       }
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //       className="t-y-0.5"
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value) => row.toggleSelected(!!value)}
    //       aria-label="Select row"
    //       className="t-y-0.5"
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // },

    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex flex-row gap-2 items-center justify-center">
          <View />
          <Block />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  size="icon"
                  variant="outline"
                  className=" h-7 w-7"
                  color="secondary"
                >
                  {" "}
                  <Link href={"lawyer/edit"}>
                    <Icon icon="heroicons:pencil" className="h-4 w-4" />{" "}
                  </Link>{" "}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p> {t("Update Laywer")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Delete />
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
      accessorKey: "Name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Name"} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex  items-center justify-center gap-2 mx-auto">
            <motion.span className="max-w-[500px] truncate font-medium">
              {row.original.Name}
            </motion.span>
          </div>
        );
      },
    },

    {
      accessorKey: "Address",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Address"} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex  items-center justify-center gap-2 mx-auto">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.7 }}
              className="max-w-[500px] truncate font-medium"
            >
              {row.original.Address}
            </motion.span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "Category",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Category"} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex  items-center justify-center gap-2 mx-auto">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.7 }}
            >
              <Badge
                className="!text-center"
                color={
                  (row.original.Category === "جنائي" && "destructive") ||
                  (row.original.Category === "مدنى" && "warning") ||
                  (row.original.Category === "عائلى" && "info") ||
                  "default"
                }
              >
                {row.original.Category}
              </Badge>
            </motion.span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "Mobile_Number",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Mobile_Number"} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex  items-center justify-center gap-2 mx-auto">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.7 }}
              className="max-w-[500px] truncate font-medium"
            >
              {row.original.Mobile_Number}
            </motion.span>
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
        <DataTableColumnHeader column={column} title={"Email"} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex  items-center justify-center gap-2 mx-auto">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.7 }}
              className="max-w-[500px] truncate font-medium"
            >
              {row.original.Email}
            </motion.span>
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
