"use client";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Checkbox } from "@/components/ui/checkbox";
import { data } from ".";
import { ColumnDef } from "@tanstack/react-table";
import Actions from "@/components/common/Actions/Actions";
import View from "./View";
import CreateDate from "./CreateDate";
import CaseStatus from "./CaseStatus";
import FileRequest from "./FileRequest";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslate } from "@/config/useTranslation";
import { DataTable } from "../../tables/advanced/components/data-table";
import { DataTableColumnHeader } from "../../tables/advanced/components/data-table-column-header";
interface Task {
  id: string;
  Case_Name?: string;
  Case_Status?: string;
  Client_Name?: string;
  Court_Name?: string;
  Case_Number?: string;
  Key_Dates?: string;
}
const TableData = () => {
  const { t, loading, error } = useTranslate();

  const columns: ColumnDef<Task>[] = [
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex flex-row gap-2 items-center justify-center">
          <View />
          <CaseStatus />
          <CreateDate />
          <FileRequest />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Link href={"lawyer-cases/follow-report"} className="mt-1">
                  {" "}
                  <Button
                    size="icon"
                    variant="outline"
                    className=" h-7 w-7"
                    color="secondary"
                  >
                    <Icon icon="gridicons:create" width="24" height="24" />{" "}
                  </Button>
                </Link>{" "}
              </TooltipTrigger>
              <TooltipContent>
                <p>{t("Case follow-up report")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Link href={"lawyer-cases/attend-report"} className="mt-1">
                  {" "}
                  <Button
                    size="icon"
                    variant="outline"
                    className=" h-7 w-7"
                    color="secondary"
                  >
                    <Icon
                      icon="gridicons:reader-follow"
                      width="24"
                      height="24"
                    />{" "}
                  </Button>
                </Link>{" "}
              </TooltipTrigger>
              <TooltipContent>
                <p> {t("Report of attendance at a judicial hearing")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
      accessorKey: "Case_Name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Case_Name"} />
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
              {row.original.Case_Name}
            </motion.span>
          </div>
        );
      },
    },

    {
      accessorKey: "Case_Status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Case_Status"} />
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
                  (row.original.Case_Status === "قيد التنفيذ" &&
                    "destructive") ||
                  (row.original.Case_Status === "قيدالانتظار" && "warning") ||
                  (row.original.Case_Status === "مكتملة" && "success") ||
                  "default"
                }
              >
                {row.original.Case_Status}
              </Badge>{" "}
            </motion.span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },

    {
      accessorKey: "Client_Name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Client_Name"} />
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
              {row.original.Client_Name}
            </motion.span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },

    {
      accessorKey: "Court_Name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Court_Name"} />
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
              {row.original.Court_Name}
            </motion.span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "Case_Number",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Case_Number"} />
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
              {row.original.Case_Number}
            </motion.span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "Key_Dates",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Key_Dates"} />
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
              {row.original.Key_Dates}
            </motion.span>{" "}
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
