"use client";

import { useEffect, useState } from "react";
import { DataTable } from "../../tables/advanced/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../../tables/advanced/components/data-table-column-header";
import { useParams } from "next/navigation";
import useDebounce from "../shared/useDebounce";
import { motion } from "framer-motion";
import {
  SearchCategory,
  getCategory,
  getCategoryPanigation,
  getFilterCategory,
} from "@/services/category/category";
import UpdateStaffCategory from "./UpdateStaffCategory";
import DeleteButton from "./DeleteButton";

interface Task {
  id: string;
  name?: string;
  description?: string;
}
const TableData = ({ flag }: { flag: any }) => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const debouncedSearch = useDebounce(search, 1000); // 300ms debounce time
  const searchPalsceholder = "";
  const { lang } = useParams();
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
    // Perform filtering logic here
    getCategoryData();
    setOpen(false); // Close the sheet after applying filters
  };

  const getCategoryData = async () => {
    setLoading(true);
    if (queryString.length > 0) {
      try {
        const res = await getFilterCategory(queryString, "crew", lang);

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
            ? await getCategory("crew", lang)
            : await getCategoryPanigation(page, "crew", lang);

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
      const res = await SearchCategory(search, "crew", lang);

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
      getCategoryData();
    }
  }, [debouncedSearch, page, flag]);

  const columns: ColumnDef<Task>[] = [
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
      id: "actions",
      cell: ({ row }) => (
        <div className="flex flex-row gap-2 items-center justify-center">
          {/* <Actions viewBtn={false} title={"Users Details"} row={row} /> */}

          <UpdateStaffCategory row={row} getCategoryData={getCategoryData} />

          <DeleteButton
            id={row.original.id}
            getCategoryData={getCategoryData}
          />
        </div>
      ),
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
              className="max-w-[500px] truncate font-medium"
            >
              {row.original?.name}
            </motion.span>
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
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.7 }}
              className="max-w-[500px] truncate font-medium"
            >
              {row.original?.description}
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
