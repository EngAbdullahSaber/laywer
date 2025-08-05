"use client";

import { ColumnDef } from "@tanstack/react-table";
import { motion } from "framer-motion";
import { DataTableColumnHeader } from "../../tables/advanced/components/data-table-column-header";
import { DataTable } from "../../tables/advanced/components/data-table";
import {
  getFilterTransaction,
  getTransaction,
  getTransactionPanigation,
  SearchTransaction,
} from "@/services/transaction/transaction";
import { useEffect, useState } from "react";
import { useTranslate } from "@/config/useTranslation";
import { useParams } from "next/navigation";
import useDebounce from "../../(category-mangement)/shared/useDebounce";
import DeleteButton from "./DeleteButton";
import UpdateTransactionComponent from "./UpdateTransactionComponent";
import { getCategory } from "@/services/category/category";
import { toast as reToast } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
interface Task {
  id: string;
  Categories?: string;
  type?: string;
  status?: string;
  client_name?: string;
  transaction_date?: string;
}

const TransactionTableData = ({ flag }: { flag: any }) => {
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
  const permission = JSON.parse(localStorage.getItem("permissions"));

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

  const filtersConfig: any = [];

  const handleFilterChange = (updatedFilters: Record<string, string>) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...updatedFilters,
    }));
  };

  const handleFilterSubmit = () => {
    // Perform filtering logic here
    getTransactionData();
    setOpen(false); // Close the sheet after applying filters
  };

  const getTransactionData = async () => {
    setLoading(true);
    if (queryString.length > 0) {
      try {
        const res = await getFilterTransaction(queryString, lang);

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
            ? await getTransaction(lang)
            : await getTransactionPanigation(page, lang);

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
      const res = await SearchTransaction(search, lang);

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
      getTransactionData();
    }
  }, [debouncedSearch, page, filters, flag]);
  const columns: ColumnDef<Task>[] = [
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex flex-row gap-2 items-center justify-center">
          {permission
            .find((item: any) => item.parent_key_name == "api.transactions")
            .permissions.some(
              (item: any) => item.name == "حذف" || item.name == "Delete"
            ) && (
            <DeleteButton
              id={row.original.id}
              getTransactionData={getTransactionData}
            />
          )}
          {permission
            .find((item: any) => item.parent_key_name == "api.transactions")
            .permissions.some(
              (item: any) => item.name == "تعديل" || item.name == "Edit"
            ) && (
            <UpdateTransactionComponent
              row={row}
              getTransactionData={getTransactionData}
            />
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
      accessorKey: "transaction_participants",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={"transaction_participants"}
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
              {row.original?.transaction_participants
                ?.join()
                .replace(/,/g, " , ")}
            </motion.span>{" "}
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"type"} />
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
              {row.original?.type}
            </motion.span>{" "}
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "Transaction Name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Transaction Name"} />
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
              {row.original?.transaction_name}
            </motion.span>{" "}
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "Amount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Amount"} />
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
              {row.original?.amount}
            </motion.span>{" "}
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
                  (row.original?.status === "pending" && "destructive") ||
                  (row.original?.status === "in_progress" && "warning") ||
                  (row.original?.status === "completed" && "success") ||
                  "default"
                }
              >
                {lang == "en"
                  ? row.original?.status == "completed"
                    ? "Completed"
                    : row.original?.status == "in_progress"
                    ? "In Progress"
                    : row.original?.status == "pending"
                    ? "Pending"
                    : ""
                  : row.original?.status == "completed"
                  ? "مكتملة"
                  : row.original?.status == "in_progress"
                  ? "قيد التنفيذ"
                  : row.original?.status == "pending"
                  ? "قيدالانتظار"
                  : ""}{" "}
              </Badge>{" "}
            </motion.span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "Attachments",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"Attachments"} />
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
              <a
                href={row.original?.files[0]?.url} // Access the file URL dynamically from the `file` object
                className="text-default-500 font-semibold w-[40%]"
                target="_blank"
                rel="noopener noreferrer" // Added for security when opening links
              >
                {t("Show File")} {/* Display the file name */}
              </a>
            </motion.span>{" "}
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "transaction_date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={"transaction_date"} />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex  items-center justify-center gap-2 mx-auto">
            <span className="max-w-[500px] truncate font-medium">
              {new Date(row.original?.transaction_date).toLocaleDateString(
                "en-GB",
                {
                  weekday: "long", // "Monday"
                  year: "numeric", // "2025"
                  month: "long", // "February"
                  day: "numeric", // "14"
                }
              )}
            </span>
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

export default TransactionTableData;
