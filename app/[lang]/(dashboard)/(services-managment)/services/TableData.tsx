"use client";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Checkbox } from "@/components/ui/checkbox";
import { data } from ".";
import { ColumnDef } from "@tanstack/react-table";
import Actions from "@/components/common/Actions/Actions";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataTable } from "../../tables/advanced/components/data-table";
import { DataTableColumnHeader } from "../../tables/advanced/components/data-table-column-header";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import useDebounce from "../../(category-mangement)/shared/useDebounce";
import {
  getFilterServices,
  getServices,
  getServicesPanigation,
  SearchServices,
} from "@/services/services/services";
import DeleteButton from "./DeleteButton";

interface Task {
  id: string;
  service_file?: any;
  price?: string;
  description?: string;
  title?: string;
}
const TableData = ({ flag }: { flag: any }) => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const debouncedSearch = useDebounce(search, 1000); // 300ms debounce time
  const searchPalsceholder = "Searchs";
  const { lang } = useParams();

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
    getCategoryData();
  };

  const getCategoryData = async () => {
    setLoading(true);
    if (queryString.length > 0) {
      try {
        const res = await getFilterServices(queryString, lang);

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
            ? await getServices(lang)
            : await getServicesPanigation(page, lang);

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
      const res = await SearchServices(search, lang);

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
  }, [debouncedSearch, page, filters, flag]);
  const columns: ColumnDef<Task>[] = [
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex flex-row gap-2 items-center justify-center">
          {/* <Actions viewBtn={false} title={"Users Details"} row={row} /> */}

          {/* <UpdateContactlistCategory
            row={row}
            getCategoryData={getCategoryData}
          /> */}

          <DeleteButton
            id={row.original.id}
            getCategoryData={getCategoryData}
          />
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
      accessorKey: "Services Image",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Services Image"} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex  items-center justify-center gap-2 mx-auto">
            <Avatar>
              <AvatarImage src={row.original?.service_file?.url} />
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "Services Name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Services Name"} />
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
      accessorKey: "Price",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Price"} />
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
              {row.original?.price}
            </motion.span>
          </div>
        );
      },
    },
    {
      accessorKey: "Services Describtion",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Services Describtion"} />
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
              {row.original.description}
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
