"use client";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../../tables/advanced/components/data-table-column-header";
import { DataTable } from "../../tables/advanced/components/data-table";
import View from "./View";
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
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import useDebounce from "../../(category-mangement)/shared/useDebounce";
import {
  getCourts,
  getCourtsPanigation,
  getFilterCourts,
  SearchCourts,
} from "@/services/courts/courts";
interface Task {
  id: string;
  name?: string;
  category?: any;
  email?: string;
  address?: string;
  website?: string;
}

const TableData = ({ flag }: { flag: any }) => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const debouncedSearch = useDebounce(search, 1000); // 300ms debounce time
  const searchPalsceholder = "Searchs";
  const { lang } = useParams();
  const { t } = useTranslate();
  const [open, setOpen] = useState(false);
  const permissionString = localStorage.getItem("permissions");
  const permission = permissionString ? JSON.parse(permissionString) : null;
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
    getCourtData();
    setOpen(false); // Close the sheet after applying filters
  };

  const getCourtData = async () => {
    setLoading(true);
    if (queryString.length > 0) {
      try {
        const res = await getFilterCourts(queryString, lang);

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
            ? await getCourts(lang)
            : await getCourtsPanigation(page, lang);

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
      const res = await SearchCourts(search, lang);

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
      getCourtData();
    }
  }, [debouncedSearch, page, filters, flag]);

  const columns: ColumnDef<Task>[] = [
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex flex-row gap-2 items-center justify-center">
          <View row={row} />
          {permission
            .find((item: any) => item.id === 33 || item.id === 159)
            .permissions.some(
              (item: any) => item.id === 36 || item.id === 162
            ) && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="inline-block">
                    <Button
                      size="icon"
                      variant="outline"
                      className=" h-7 w-7"
                      color="secondary"
                    >
                      <a href={`courts/${row.original.id}/edit`}>
                        <Icon icon="heroicons:pencil" className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p> {t("Update Court")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {permission
            .find((item: any) => item.id === 33 || item.id === 159)
            .permissions.some(
              (item: any) => item.id === 37 || item.id === 163
            ) && <Delete id={row.original.id} getCourtData={getCourtData} />}
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
              {row.original?.name}
            </motion.span>{" "}
          </div>
        );
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
            >
              {row.original?.category?.name}
            </motion.span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "City",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"City"} />
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
              {lang === "en"
                ? row.original?.city?.name.en
                : row.original?.city?.name.ar || "-"}
            </motion.span>{" "}
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "room_number",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"room_number"} />
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
              {row.original?.room_number}
            </motion.span>{" "}
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    // {
    //   accessorKey: "Court Website Link",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title={"Court Website Link"} />
    //   ),
    //   cell: ({ row }) => {
    //     return (
    //       <div className="flex  items-center justify-center gap-2 mx-auto">
    //         <motion.a
    //           initial={{ opacity: 0 }}
    //           whileInView={{ opacity: 1 }}
    //           transition={{ duration: 1.7 }}
    //           className="max-w-[500px] text-blue-700 dark:text-[#dfc77d] truncate font-medium"
    //           href={row?.original?.website}
    //         >
    //           رابط المحكمة
    //         </motion.a>{" "}
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
