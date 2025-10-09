"use client";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useParams } from "next/navigation";
import { DataTableColumnHeader } from "../../tables/advanced/components/data-table-column-header";
import { DataTable } from "../../tables/advanced/components/data-table";
import View from "./View";
import Block from "./Block";
import Delete from "./DeleteButton";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslate } from "@/config/useTranslation";
import {
  SearchLawyer,
  getFilterLawyer,
  getLawyer,
  getLawyerPanigation,
} from "@/services/lawyer/lawyer";
import { getCategory } from "@/services/category/category";
import { toast as reToast } from "react-hot-toast";
import useDebounce from "../../(category-mangement)/shared/useDebounce";

interface Task {
  id: string;
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  category?: any;
  status?: any;
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
  const [category, setCategory] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const permissionString = localStorage.getItem("permissions");
  const permission = permissionString ? JSON.parse(permissionString) : null;
  const [filters, setFilters] = useState<Record<string, string>>({
    full_name: "",
    category_filter: "",
    phone: "",
  });
  const buildQueryString = (filters: { [key: string]: string }) => {
    const queryParams = Object.entries(filters)
      .filter(([key, value]) => value) // Only include filters with values
      .map(([key, value]) => `=${value}`) // Format as "field:key=value"
      .join("&"); // Join them with "&"

    return queryParams ? `&category_filter${queryParams}` : "";
  };

  const queryString = buildQueryString(filters);
  const transformedCategories = category.map((item) => ({
    id: item.id,
    value: item.name,
    label: item.name,
  }));
  const fetchData = async () => {
    try {
      const countriesData = await getCategory("lawyer", lang);
      setCategory(countriesData?.body?.data || []);
    } catch (error) {}
  };
  const filtersConfig = [
    {
      label: "category_filter",
      placeholder: "Select Category",
      type: "select",
      values: transformedCategories,
      value: filters.category_filter,
    },
  ];
  const handleFilterChange = (updatedFilters: Record<string, string>) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...updatedFilters,
    }));
  };

  const handleFilterSubmit = () => {
    // Perform filtering logic here
    getLawyerData();
    setOpen(false); // Close the sheet after applying filters
  };

  const getLawyerData = async () => {
    setLoading(true);
    if (queryString.length > 0) {
      try {
        const res = await getFilterLawyer(queryString, lang);

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
            ? await getLawyer(lang)
            : await getLawyerPanigation(page, lang);

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
      const res = await SearchLawyer(search, lang);

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
      getLawyerData();
      fetchData();
    }
  }, [debouncedSearch, page, filters]);

  const columns: ColumnDef<Task>[] = [
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex flex-row gap-2 items-center justify-center">
          <View row={row} />
          {permission
            .find((item: any) => item.id === 20 || item.id === 146)
            .permissions.some(
              (item: any) => item.id === 26 || item.id === 152
            ) && (
            <Block
              id={row.original.id}
              status={row.original.status}
              getLawyerData={getLawyerData}
            />
          )}
          {permission
            .find((item: any) => item.id === 20 || item.id === 146)
            .permissions.some(
              (item: any) => item.id === 23 || item.id === 149
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
                      <a href={`lawyer/${row.original.id}/edit`}>
                        <Icon icon="heroicons:pencil" className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p> {t("Update Laywer")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {permission
            .find((item: any) => item.id === 20 || item.id === 146)
            .permissions.some(
              (item: any) => item.id === 24 || item.id === 150
            ) && <Delete id={row.original.id} getLawyerData={getLawyerData} />}
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
              {row.original?.name}
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
              {row.original?.address}
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
      accessorKey: "Status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Status"} />
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
                  (row.original?.status === "banned" && "destructive") ||
                  (row.original?.status === "active" && "success") ||
                  "default"
                }
              >
                {lang == "ar"
                  ? row.original?.status == "active"
                    ? "نشط"
                    : "تم حظره"
                  : row.original?.status == "active"
                  ? "Active"
                  : "Blocked"}{" "}
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
              dir="ltr"
            >
              {row.original?.phone}
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
              {row.original?.email}
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
