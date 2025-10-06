"use client";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { motion } from "framer-motion";
import { DataTableColumnHeader } from "../../tables/advanced/components/data-table-column-header";
import { DataTable } from "../../tables/advanced/components/data-table";
import View from "./View";
import TaskStatus from "./TaskStatus";
import { useEffect, useState } from "react";
import { useTranslate } from "@/config/useTranslation";
import useDebounce from "../../(category-mangement)/shared/useDebounce";
import { useParams } from "next/navigation";
import {
  getFilterTasks,
  getTasks,
  getTasksPanigation,
  SearchTasks,
} from "@/services/tasks/tasks";

interface Task {
  id: string;
  title?: string;
  importance_level?: string;
  lawyer?: any;
  due_date?: string;
  law_suit?: any;
  status?: string;
}

const TableData = () => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const debouncedSearch = useDebounce(search, 1000); // 300ms debounce time
  const searchPalsceholder = "Searchs";
  const { lang } = useParams();
  const { t } = useTranslate();
  const [open, setOpen] = useState(false);

  const [filters, setFilters] = useState<Record<string, string>>({
    full_name: "",
    email: "",
    phone: "",
  });
  const buildQueryString = (filters: { [key: string]: string }) => {
    const queryParams = Object.entries(filters)
      .filter(([key, value]) => value) // Only include filters with values
      .map(([key, value]) => `field:${key}=${value}`) // Format as "field:key=value"
      .join("&"); // Join them with "&"

    return queryParams ? `?${queryParams}` : "";
  };

  const queryString = buildQueryString(filters);

  const filtersConfig: any = [];

  const handleFilterChange = (updatedFilters: Record<string, string>) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...updatedFilters,
    }));
  };

  const handleFilterSubmit = () => {
    getClientData();
    setOpen(false); // Close the sheet after applying filters  };
  };
  const getClientData = async () => {
    setLoading(true);
    if (queryString.length > 0) {
      try {
        const res = await getFilterTasks(queryString, lang);

        setData(res?.body?.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);

        setLoading(false);
      }
    } else {
      try {
        const res =
          page === 1
            ? await getTasks(lang)
            : await getTasksPanigation(page, lang);

        setData(res?.body?.data || []);
        setData(res?.body?.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);

        setLoading(false);
      }
    }
  };

  const SearchData = async () => {
    setLoading(true);

    try {
      const res = await SearchTasks(search, lang);

      setData(res?.body?.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);

      setLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedSearch) {
      SearchData();
    } else {
      getClientData();
    }
  }, [debouncedSearch, page, filters]);
  const columns: ColumnDef<Task>[] = [
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex flex-row gap-2 items-center justify-center">
          <View row={row} />
          <TaskStatus id={row.original.id} getClientData={getClientData} />
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
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.7 }}
              className="max-w-[500px] truncate font-medium"
            >
              {row.original?.title}
            </motion.span>
          </div>
        );
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
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.7 }}
            >
              <Badge
                className="!text-center"
                color={
                  (row.original?.importance_level == "high" && "destructive") ||
                  (row.original?.importance_level == "low" && "secondary") ||
                  (row.original?.importance_level == "mid" && "warning") ||
                  "default"
                }
              >
                {lang == "en"
                  ? row.original?.importance_level == "high"
                    ? "Very Important"
                    : row.original?.importance_level == "mid"
                    ? "Moderately Important"
                    : "Low Importance"
                  : row.original?.importance_level == "high"
                  ? " مهمة جدا"
                  : row.original?.importance_level == "mid"
                  ? "متوسطة الاهمية"
                  : "ذات اهمية ضعيفة"}
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
      accessorKey: "Assigned_To",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Assigned_To"} />
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
              {row.original?.lawyer?.name}
            </motion.span>
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
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.7 }}
              className="max-w-[500px] truncate font-medium"
            >
              {row.original?.due_date}
            </motion.span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "case_number",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"case_number"} />
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
              {row.original?.law_suit?.case_number}
            </motion.span>
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
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.7 }}
            >
              <Badge
                className="!text-center"
                color={
                  (row.original?.status === "pending" && "destructive") ||
                  (row.original?.status === "in_progress" && "warning") ||
                  (row.original?.status === "completed" && "success") ||
                  "default"
                }
              >
                {lang == "en"
                  ? row.original?.status == "completed"
                    ? "Completed"
                    : row.original?.status == "in_progress"
                    ? "In Progress"
                    : "Pending"
                  : row.original?.status == "completed"
                  ? "مكتملة"
                  : row.original?.status == "in_progress"
                  ? "قيد التنفيذ"
                  : "قيدالانتظار"}{" "}
              </Badge>
            </motion.span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
  ];
  const isPaginationDisabled = data.length < 10 || data.length === 0;
  return (
    <div>
      {/* Render your data table here using the fetched tasks */}
      {/* Assuming you have a table component that takes columns and data */}
      <DataTable
        data={data}
        setPage={setPage}
        setSearch={setSearch}
        searchPalsceholder={searchPalsceholder}
        page={page}
        open={open}
        setOpen={setOpen}
        search={search}
        filtersConfig={filtersConfig}
        onFilterChange={handleFilterChange}
        onFilterSubmit={handleFilterSubmit}
        columns={columns}
        isPaginationDisabled={isPaginationDisabled}
      />{" "}
    </div>
  );
};

export default TableData;
