"use client";
import { ColumnDef } from "@tanstack/react-table";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataTable } from "../../tables/advanced/components/data-table";
import { DataTableColumnHeader } from "../../tables/advanced/components/data-table-column-header";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import useDebounce from "../../(category-mangement)/shared/useDebounce";

import {
  getAllRoles,
  getAllRolesPanigation,
  getFilterAllRoles,
  SearchAllRoles,
} from "@/services/permissionsAndRoles/permissionsAndRoles";
import DeleteButton from "./DeleteButton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useTranslate } from "@/config/useTranslation";

interface Task {
  id: string;
  role?: any;
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
  const [open, setOpen] = useState(false);
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

  const filtersConfig: any = [];

  const handleFilterChange = (updatedFilters: Record<string, string>) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...updatedFilters,
    }));
  };

  const handleFilterSubmit = () => {
    // Perform filtering logic here
    getServicesData();
    setOpen(false); // Close the sheet after applying filters
  };

  const getServicesData = async () => {
    setLoading(true);
    if (queryString.length > 0) {
      try {
        const res = await getFilterAllRoles(queryString, lang);

        setData(res?.body?.roles_and_permissions || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);

        setLoading(false);
      }
    } else {
      try {
        const res =
          page === 1
            ? await getAllRoles(lang)
            : await getAllRolesPanigation(page, lang);

        setData(
          res?.body?.roles_and_permissions.filter(
            (role: any) => role.role !== "client" && role.role !== "lawyer"
          ) || []
        );
        console.log(res.body);
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
      const res = await SearchAllRoles(search, lang);

      setData(res?.body?.roles_and_permissions || []);
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
      getServicesData();
    }
  }, [debouncedSearch, page, filters, flag]);
  const columns: ColumnDef<Task>[] = [
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex flex-row gap-2 items-center justify-center">
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
                    {" "}
                    <a href={`roles/${row.original.id}/edit`}>
                      <Icon icon="heroicons:pencil" className="h-4 w-4" />{" "}
                    </a>{" "}
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p> {t("Edit Permissions For Roles")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {/* <DeleteButton
            id={row.original.id}
            getServicesData={getServicesData}
          /> */}
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
      accessorKey: "Roles Name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Roles Name"} />
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
              {row.original?.role}
            </motion.span>
          </div>
        );
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
