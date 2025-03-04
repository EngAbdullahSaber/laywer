"use client";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Checkbox } from "@/components/ui/checkbox";
import { data } from ".";
import { ColumnDef } from "@tanstack/react-table";
import Actions from "@/components/common/Actions/Actions";
import View from "./View";
import Add from "./Add";
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
import Delete from "./Delete";
import { DataTable } from "../../tables/advanced/components/data-table";
import { DataTableColumnHeader } from "../../tables/advanced/components/data-table-column-header";
import {
  getCases,
  getCasesPanigation,
  getFilterCases,
  SearchCases,
} from "@/services/cases/cases";
import { toast as reToast } from "react-hot-toast";

import { useEffect, useState } from "react";
import useDebounce from "../../(category-mangement)/shared/useDebounce";
import { redirect, useParams } from "next/navigation";
import DeleteButton from "./Delete";
import { getCategory } from "@/services/category/category";
interface Task {
  id: string;
  Case_Name?: string;
  main_case_number?: string;
  client?: any;
  category?: string;
  lawyer?: any;
  session_date?: string;
  status?: string;
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
  const [category, setCategory] = useState<any[]>([]);

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
  const transformedCategories = category.map((item) => ({
    id: item.id,
    value: item.name,
    label: item.name,
  }));
  const status = [
    {
      id: "completed",
      value: lang == "en" ? "completed" : "مكتملة",
      label: lang == "en" ? "completed" : "مكتملة",
    },
    {
      id: "pending",
      value: lang == "en" ? "pending" : "قيدالانتظار",
      label: lang == "en" ? "pending" : "قيدالانتظار",
    },
    {
      id: "in_progress",
      value: lang == "en" ? "in_progress" : "قيد التنفيذ",
      label: lang == "en" ? "in_progress" : "قيد التنفيذ",
    },
  ];
  const cailm_status = [
    {
      id: "defendant",
      value: lang == "en" ? "defendant" : "مدعى عليه",
      label: lang == "en" ? "defendant" : "مدعى عليه",
    },
    {
      id: "claimant",
      value: lang == "en" ? "claimant" : "مدعي",
      label: lang == "en" ? "claimant" : "مدعي",
    },
  ];
  const fetchData = async () => {
    try {
      const countriesData = await getCategory("cases", lang);
      setCategory(countriesData?.body?.data || []);
    } catch (error) {
      reToast.error("Failed to fetch data");
    }
  };
  const filtersConfig = [
    {
      label: "category_filter",
      placeholder: "Select Category",
      type: "select",
      values: transformedCategories,
      value: filters.category_filter,
    },
    {
      label: "status_filter",
      placeholder: "Select Status",
      type: "select",
      values: status,
      value: filters.status_filter,
    },
    {
      label: "claim_status_filter",
      placeholder: "Select Status",
      type: "select",
      values: cailm_status,
      value: filters.claim_status_filter,
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
    console.log("Filters submitted:", filters);
    getCasesData();
  };

  const getCasesData = async () => {
    setLoading(true);
    if (queryString.length > 0) {
      try {
        const res = await getFilterCases(queryString, lang);

        setData(res?.body?.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        if (error?.status == 401) {
          window.location.href = "/auth/login";
        }

        setLoading(false);
      }
    } else {
      try {
        const res =
          page === 1
            ? await getCases(lang)
            : await getCasesPanigation(page, lang);

        setData(res?.body?.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        if (error?.status == 401) {
          window.location.href = "/auth/login";
        }
        setLoading(false);
      }
    }
  };

  const SearchData = async () => {
    setLoading(true);

    try {
      const res = await SearchCases(search, lang);

      setData(res?.body?.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
      if (error?.status == 401) {
        window.location.href = "/auth/login";
      }

      setLoading(false);
    }
  };

  useEffect(() => {
    if (debouncedSearch) {
      SearchData();
    } else {
      getCasesData();
      fetchData();
    }
  }, [debouncedSearch, page, filters, flag]);
  const columns: ColumnDef<Task>[] = [
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex flex-row gap-2 items-center justify-center">
          <View row={row} />
          <Add id={row.original.id} />{" "}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  size="icon"
                  variant="outline"
                  className=" h-7 w-7"
                  color="secondary"
                >
                  {" "}
                  <Link href={`case/${row.original.id}/edit`}>
                    <Icon icon="heroicons:pencil" className="h-4 w-4" />{" "}
                  </Link>{" "}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p> {t("Edit Case")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <FileRequest id={row.original.id} />
          <DeleteButton getCasesData={getCasesData} id={row.original.id} />{" "}
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
              {row.original.session_date}
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
                  (row.original.status === "pending" && "destructive") ||
                  (row.original.status === "in_progress" && "warning") ||
                  (row.original.status === "completed" && "success") ||
                  "default"
                }
              >
                {lang == "en"
                  ? row.original.status == "completed"
                    ? "Completed"
                    : row.original.status == "in_progress"
                    ? "In Progress"
                    : "Pending"
                  : row.original.status == "completed"
                  ? "مكتملة"
                  : row.original.status == "in_progress"
                  ? "قيد التنفيذ"
                  : "قيدالانتظار"}{" "}
              </Badge>{" "}
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
