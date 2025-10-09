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
import { Icon } from "@iconify/react";
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

  const FileIcon = ({ extension }: { extension?: string }) => {
    const iconMap: Record<string, string> = {
      pdf: "vscode-icons:file-type-pdf2",
      doc: "vscode-icons:file-type-word2",
      docx: "vscode-icons:file-type-word2",
      xls: "vscode-icons:file-type-excel2",
      xlsx: "vscode-icons:file-type-excel2",
      ppt: "vscode-icons:file-type-powerpoint2",
      pptx: "vscode-icons:file-type-powerpoint2",
      jpg: "vscode-icons:file-type-image",
      jpeg: "vscode-icons:file-type-image",
      png: "vscode-icons:file-type-image",
      gif: "vscode-icons:file-type-image",
      txt: "vscode-icons:file-type-text",
      zip: "vscode-icons:file-type-zip",
      rar: "vscode-icons:file-type-zip",
      mp3: "vscode-icons:file-type-audio",
      mp4: "vscode-icons:file-type-video",
    };

    const defaultIcon = "vscode-icons:file-type-generic";
    const icon = extension
      ? iconMap[extension.toLowerCase()] || defaultIcon
      : defaultIcon;

    return <Icon icon={icon} className="w-5 h-5 text-gray-500" />;
  };

  // Optional helper for file sizes
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

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
        const files = row.original?.files || [];

        return (
          <div className="flex flex-col items-center gap-2 mx-auto min-w-[150px]">
            {files.length === 0 ? (
              <span className="text-gray-400 text-sm">No attachments</span>
            ) : (
              <div className="flex flex-col gap-1 w-full">
                {files.map((file, index) => (
                  <motion.div
                    key={file.image_id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded"
                  >
                    <div className="flex-shrink-0">
                      <FileIcon extension={file.image_name.split(".").pop()} />
                    </div>
                    <a
                      href={file.url}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium truncate max-w-[180px]"
                      target="_blank"
                      rel="noopener noreferrer"
                      title={file.image_name}
                    >
                      {file.image_name}
                    </a>
                    <span className="text-xs text-gray-500 ml-auto">
                      {formatFileSize(file.size)}{" "}
                      {/* Add if you have size data */}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        );
      },
      filterFn: (row, id, value) => {
        const files = row.original?.files || [];
        return files.some((file) =>
          file.image_name.toLowerCase().includes(value.toLowerCase())
        );
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
