"use client";

import { Badge } from "@/components/ui/badge";

import { ColumnDef } from "@tanstack/react-table";
import { motion } from "framer-motion";
import { DataTableColumnHeader } from "../../tables/advanced/components/data-table-column-header";
import { DataTable } from "../../tables/advanced/components/data-table";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import useDebounce from "../../(category-mangement)/shared/useDebounce";
import {
  SearchContactList,
  getContactList,
  getContactListPanigation,
  getFilterContactList,
} from "@/services/contact-list/contact-list";
import DeleteButton from "./DeleteButton";
import UpdateContact from "./UpdateContact";

interface Task {
  id: string;
  category?: any;
  name?: string;
  email?: string;
  Gender?: string;
  phone?: string;
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
    getContactListData();
  };

  const getContactListData = async () => {
    setLoading(true);
    if (queryString.length > 0) {
      try {
        const res = await getFilterContactList(queryString, lang);

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
            ? await getContactList(lang)
            : await getContactListPanigation(page, lang);

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
      const res = await SearchContactList(search, lang);

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
      getContactListData();
    }
  }, [debouncedSearch, page, filters, flag]);
  const columns: ColumnDef<Task>[] = [
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex flex-row gap-2 items-center justify-center">
          <UpdateContact row={row} getContactListData={getContactListData} />

          <DeleteButton
            id={row.original.id}
            getContactListData={getContactListData}
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
              {row.original.name}
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
              {row.original.category.name}
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
              {row.original.email}
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
              {row.original.phone}
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
