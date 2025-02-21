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
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslate } from "@/config/useTranslation";
import useDebounce from "../../(category-mangement)/shared/useDebounce";
import { useParams } from "next/navigation";
import {
  getClientCases,
  getClientCasesPanigation,
  getFilterClientCases,
  SearchClientCases,
} from "@/services/client-cases/client-cases";

interface Task {
  id: string;
  Case_Name?: string;
  Case_Number?: string;
  Court_Name?: string;
  Court_Category?: string;
  Case_Status?: string;
  Client_Name?: string;
  Hearing_Dates?: string;
}

const TableData = () => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const debouncedSearch = useDebounce(search, 1000); // 300ms debounce time
  const searchPalsceholder = "Search By Email ,Phone and Name";
  const { lang } = useParams();
  const { t } = useTranslate();

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

  const filtersConfig = [];

  const handleFilterChange = (updatedFilters: Record<string, string>) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...updatedFilters,
    }));
  };

  const handleFilterSubmit = () => {
    // Perform filtering logic here
    console.log("Filters submitted:", filters);
    getClientData();
  };

  const getClientData = async () => {
    setLoading(true);
    if (queryString.length > 0) {
      try {
        const res = await getFilterClientCases(queryString, lang);

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
            ? await getClientCases(lang)
            : await getClientCasesPanigation(page, lang);

        setData(res?.body?.data || []);
        console.log(res.body.data);
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
      const res = await SearchClientCases(search, lang);

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
        </div>
      ),
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"id"} />
      ),
      cell: ({ row }) => (
        <motion.div
          className=""
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.7 }}
        >
          {row.original.id}
        </motion.div>
      ),
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
      accessorKey: "Court_Category",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Court_Category"} />
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
              {" "}
              <Badge
                className="!text-center"
                color={
                  (row.original.Court_Category === "جنائي" && "destructive") ||
                  (row.original.Court_Category === "عائلى " && "info") ||
                  (row.original.Court_Category === "مدنى" && "warning") ||
                  "default"
                }
              >
                {row.original.Court_Category}
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
      accessorKey: "Case_Status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Case_Status"} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex  items-center justify-center gap-2 mx-auto">
            <Badge
              className="!text-center"
              color={
                (row.original.Case_Status === "قيد التنفيذ" && "destructive") ||
                (row.original.Case_Status === "قيد التنفيذ" && "info") ||
                (row.original.Case_Status === "مكتملة" && "warning") ||
                "default"
              }
            >
              {row.original.Case_Status}
            </Badge>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    // {
    //   accessorKey: "Client_Name",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title={"Client_Name"} />
    //   ),
    //   cell: ({ row }) => {
    //     return (
    //       <div className="flex  items-center justify-center gap-2 mx-auto">
    //         <span className="max-w-[500px] truncate font-medium">
    //           {row.original.Client_Name}
    //         </span>
    //       </div>
    //     );
    //   },
    //   filterFn: (row, id, value) => {
    //     return value.includes(row.getValue(id));
    //   },
    // },
    {
      accessorKey: "Hearing_Dates",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Hearing_Dates"} />
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
              {row.original.Hearing_Dates}
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
