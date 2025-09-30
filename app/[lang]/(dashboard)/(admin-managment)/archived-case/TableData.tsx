"use client";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import View from "./View";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTranslate } from "@/config/useTranslation";
import { DataTable } from "../../tables/advanced/components/data-table";
import { DataTableColumnHeader } from "../../tables/advanced/components/data-table-column-header";

import { useEffect, useState } from "react";
import useDebounce from "../../(category-mangement)/shared/useDebounce";
import { useParams } from "next/navigation";
import DeleteButton from "./Delete";
import { getCategory } from "@/services/category/category";
import {
  getArchievedCases,
  getArchievedCasesPanigation,
  getFilterArchievedCases,
  SearchArchievedCases,
} from "@/services/archieved-cases/archieved-cases";

interface Task {
  id: string;
  title?: string;
  main_case_number?: string;
  client_name?: string;
  category?: string;
  lawyer_name?: string;
  session_date?: string;
  claim_status?: string;
}

const TableData = () => {
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [pagination, setPagination] = useState<any>(null);
  const debouncedSearch = useDebounce(search, 1000); // 300ms debounce time
  const searchPalsceholder = "Searchs";
  const { lang } = useParams();
  const { t } = useTranslate();
  const [category, setCategory] = useState<any[]>([]);
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
    {
      id: "جديد",
      value: lang == "en" ? "new" : "جديد",
      label: lang == "en" ? "new" : "جديد",
    },
    {
      id: "معلق",
      value: lang == "en" ? "pending" : "معلق",
      label: lang == "en" ? "pending" : "معلق",
    },
    {
      id: "مغلق",
      value: lang == "en" ? "closed" : "مغلق",
      label: lang == "en" ? "closed" : "مغلق",
    },
    {
      id: "قيد النظر",
      value: lang == "en" ? "under_review" : "قيد النظر",
      label: lang == "en" ? "under_review" : "قيد النظر",
    },
  ];

  const fetchData = async () => {
    try {
      const countriesData = await getCategory("cases", lang);
      setCategory(countriesData?.body?.data || []);
    } catch (error) {}
  };

  const filtersConfig = [];

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
    if (queryString.length > 0) {
      try {
        const res = await getFilterArchievedCases(queryString, lang);
        setData(res?.body?.data || []);
        setPagination(res?.body?.meta || null);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false);
      }
    } else {
      try {
        const res =
          page === 1
            ? await getArchievedCases(lang)
            : await getArchievedCasesPanigation(page, lang);

        setData(res?.body?.data || []);
        setPagination(res?.body?.meta || null);
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
      const res = await SearchArchievedCases(search, lang);
      setData(res?.body?.data || []);
      setPagination(res?.body?.meta || null);
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
      fetchData();
    }
  }, [debouncedSearch, page, filters]);

  const columns: ColumnDef<Task>[] = [
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex flex-row gap-2 items-center justify-center">
          <View row={row} />
          {permission &&
            permission
              .find((item: any) => item.id === 12 || item.id === 138)
              ?.permissions?.some(
                (item: any) => item.id === 15 || item.id === 141
              ) && (
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
                      <a href={`archived-case/${row.original.id}/edit`}>
                        <Icon icon="heroicons:pencil" className="h-4 w-4" />{" "}
                      </a>{" "}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p> {t("Edit Case")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

          {permission &&
            permission
              .find((item: any) => item.id === 12 || item.id === 138)
              ?.permissions?.some(
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
        <DataTableColumnHeader column={column} title={"ID"} />
      ),
      cell: ({ row }) => <div className="">{row.original.id}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Case Title"} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center gap-2 mx-auto">
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
      accessorKey: "client_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Client Name"} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center gap-2 mx-auto">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.7 }}
              className="max-w-[500px] truncate font-medium"
            >
              {row.original?.client_name}
            </motion.span>
          </div>
        );
      },
    },
    {
      accessorKey: "lawyer_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Lawyer Name"} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center gap-2 mx-auto">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.7 }}
              className="max-w-[500px] truncate font-medium"
            >
              {row.original?.lawyer_name}
            </motion.span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "main_case_number",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Case Number"} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center gap-2 mx-auto">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.7 }}
              className="max-w-[500px] truncate font-medium"
            >
              {row.original?.main_case_number}
            </motion.span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Category"} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center gap-2 mx-auto">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.7 }}
            >
              {row.original?.category}
            </motion.span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "session_date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Session Date"} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center gap-2 mx-auto">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.7 }}
              className="max-w-[500px] truncate font-medium"
            >
              {row.original?.session_date
                ? new Date(row.original.session_date).toLocaleDateString(
                    "en-GB",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )
                : "-"}
            </motion.span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "claim_status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Claim Status"} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center gap-2 mx-auto">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.7 }}
            >
              <Badge
                className="!text-center"
                color={
                  (row.original?.claim_status === "معلق" && "destructive") ||
                  (row.original?.claim_status === "قيد النظر" && "warning") ||
                  (row.original?.claim_status === "مغلق" && "success") ||
                  (row.original?.claim_status === "جديد" && "default") ||
                  "default"
                }
              >
                {lang == "en"
                  ? row.original?.claim_status == "مغلق"
                    ? "Closed"
                    : row.original?.claim_status == "قيد النظر"
                    ? "Under Review"
                    : row.original?.claim_status == "معلق"
                    ? "Pending"
                    : "New"
                  : row.original?.claim_status}{" "}
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

  const isPaginationDisabled =
    !pagination || pagination.current_page === pagination.last_page;

  return (
    <div>
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
        pagination={pagination}
        loading={loading}
      />{" "}
    </div>
  );
};

export default TableData;
