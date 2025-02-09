"use client";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Checkbox } from "@/components/ui/checkbox";
import { data } from ".";
import { ColumnDef } from "@tanstack/react-table";
import Actions from "@/components/common/Actions/Actions";
import { motion } from "framer-motion";
import { DataTableColumnHeader } from "../../tables/advanced/components/data-table-column-header";
import { DataTable } from "../../tables/advanced/components/data-table";

interface Task {
  id: string;
  Categories?: string;
  User_Name?: string;
  Email?: string;
  Gender?: string;
  Mobile_Number?: string;
}
const TableData = () => {
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
      accessorKey: "Userss",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Userss"} />
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
              {row.original.User_Name}
            </motion.span>{" "}
          </div>
        );
      },
    },
    {
      accessorKey: "Categories",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Categories"} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex  items-center justify-center gap-2 mx-auto">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.7 }}
            >
              {" "}
              <Badge
                className="!text-center"
                color={
                  (row.original.Categories === "سكرتير" && "destructive") ||
                  (row.original.Categories === "محامى" && "info") ||
                  (row.original.Categories === "مساعد" && "warning") ||
                  "default"
                }
              >
                {row.original.Categories}
              </Badge>
            </motion.span>{" "}
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
            </motion.span>{" "}
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "Mobile Number",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Mobile Number"} />
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
            </motion.span>{" "}
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },

    // {
    //   accessorKey: "Gender",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title={"Gender"} />
    //   ),
    //   cell: ({ row }) => {
    //     return (
    //       <div className="flex  items-center justify-center gap-2 mx-auto">
    //         <Badge
    //           className="!text-center"
    //           color={
    //             (row.original.Gender === "Male" && "success") ||
    //             (row.original.Gender === "Female" && "warning") ||
    //             "default"
    //           }
    //         >
    //           {row.original.Gender}
    //         </Badge>
    //       </div>
    //     );
    //   },
    //   filterFn: (row, id, value) => {
    //     return value.includes(row.getValue(id));
    //   },
    // },
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
