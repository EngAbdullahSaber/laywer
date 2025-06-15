"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import View from "./View";
import { motion } from "framer-motion";

import { useTranslate } from "@/config/useTranslation";
import { DataTable } from "../../tables/advanced/components/data-table";
import { DataTableColumnHeader } from "../../tables/advanced/components/data-table-column-header";
import {
  getArchivedCases,
  getArchivedCasesPanigation,
  SearchArchivedCases,
} from "@/services/cases/cases";
import { useEffect, useState } from "react";
import useDebounce from "../../(category-mangement)/shared/useDebounce";
import { useParams } from "next/navigation";
import DeleteButton from "./Delete";

interface Task {
  id: string;
  Case_Name?: string;
  main_case_number?: string;
  client?: any;
  category?: any;
  lawyer?: any;
  session_date?: string;
  status?: string;
}

const TableData = () => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const debouncedSearch = useDebounce(search, 1000); // 300ms debounce time
  const searchPalsceholder = "Searchs";
  const { lang } = useParams();
  const { t } = useTranslate();
  const permissionString = localStorage.getItem("permissions");
  const permission = permissionString ? JSON.parse(permissionString) : null;
  const [filters, setFilters] = useState<Record<string, string>>({
    status_filter: "",
    category_filter: "",
    claim_status_filter: "",
  });
  const buildQueryString = (filters: { [key: string]: string }) => {
    const queryParams = Object.entries(filters)
      .filter(([key, value]) => value) // Only include filters with values
      .map(([key, value]) => `${key}=${value}`) // Format as "field:key=value"
      .join("&"); // Join them with "&"

    return queryParams ? `&${queryParams}` : "";
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
    // Perform filtering logic here
    getCasesData();
    setOpen(false); // Close the sheet after applying filters
  };

  const getCasesData = async () => {
    setLoading(true);

    try {
      const res =
        page === 1
          ? await getArchivedCases(lang)
          : await getArchivedCasesPanigation(page, lang);

      setData(res?.body?.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);

      setLoading(false);
    }
  };

  const SearchData = async () => {
    setLoading(true);

    try {
      const res = await SearchArchivedCases(search, lang);

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
      getCasesData();
    }
  }, [debouncedSearch, page, filters]);
  const columns: ColumnDef<Task>[] = [
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex flex-row gap-2 items-center justify-center">
          <View row={row} />

          {permission
            .find((item: any) => item.id === 12 || item.id === 138)
            .permissions.some(
              (item: any) => item.id === 16 || item.id === 142
            ) && (
            <DeleteButton getCasesData={getCasesData} id={row.original.id} />
          )}
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
              {row.original.client?.name}
            </motion.span>
          </div>
        );
      },
    },
    {
      accessorKey: "Lawyer_Name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Lawyer_Name"} />
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
              {row.original.lawyer?.name}
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
              {row.original.main_case_number}
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
              {row.original.category?.name}
            </motion.span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },

    {
      accessorKey: "Next_Appointment_Date",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"Next_Appointment_Date"}
        />
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
              {new Date(row.original.session_date).toLocaleDateString("en-GB", {
                weekday: "long", // "Monday"
                year: "numeric", // "2025"
                month: "long", // "February"
                day: "numeric", // "14"
              })}
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
