"use client";
import BasicSelect from "@/components/common/Select/BasicSelect";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslate } from "@/config/useTranslation";
import { motion } from "framer-motion";
import { useState } from "react";
import { useParams } from "next/navigation";
import { toast as reToast } from "react-hot-toast";
import { AxiosError } from "axios";
import Flatpickr from "react-flatpickr";
import InfiniteScrollSelect from "./InfiniteScrollSelect";
import { getClientsPanigation } from "@/services/clients/clients";
import { CreateTransaction } from "@/services/transaction/transaction";
import { UploadImage } from "@/services/auth/auth";
import FileUploaderMultiple from "./FileUploaderMultiple";

interface ErrorResponse {
  errors: {
    [key: string]: string[];
  };
}

interface TransactionData {
  client_name: string;
  status: string;
  type: string;
  transaction_date: string;
}

const Task_Status = [
  { id: "pending", value: "pending", label: "قيدالانتظار" },
  { id: "in_progress", value: "in_progress", label: "قيد التنفيذ" },
  { id: "completed", value: "completed", label: "مكتملة" },
];

const CreateTransactionComponent = ({
  setFlag,
  flag,
}: {
  setFlag: (flag: boolean) => void;
  flag: boolean;
}) => {
  const { t } = useTranslate();
  const [open, setOpen] = useState(false);
  const [loading, setIsLoading] = useState(true);
  const [imageIds, setImageIds] = useState<string[]>([]); // Store array of image IDs
  const [uploading, setUploading] = useState(false);
  const { lang } = useParams();

  const [transactionData, setTransactionData] = useState<TransactionData>({
    client_name: "",
    status: "",
    type: "",
    transaction_date: "",
  });

  const handleDateChange = (dates: Date[]) => {
    const date = new Date(dates[0]);
    const formattedDate = date.toISOString().split("T")[0];
    setTransactionData((prev) => ({
      ...prev,
      transaction_date: formattedDate,
    }));
  };

  const handleStatusChange = (value: any) => {
    setTransactionData((prev) => ({
      ...prev,
      status: value?.id,
    }));
  };

  const handleImageChange = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await UploadImage(formData, lang as string);
      if (res?.body?.image_id) {
        setImageIds((prev) => [...prev, res.body.image_id]);
        reToast.success(t("Image uploaded successfully"));
      } else {
        reToast.error(t("Failed to upload image"));
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.errors?.image?.[0] ||
        t("Failed to upload image");
      reToast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleClientChange = (value: string) => {
    setTransactionData((prev) => ({
      ...prev,
      client_name: value,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTransactionData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fetchData = async (page: number = 1) => {
    try {
      const data = await getClientsPanigation(page, lang as string);
      return data?.body?.data || [];
    } catch (error) {
      reToast.error(`Failed to fetch data: ${error}`);
      return [];
    }
  };

  const formatOption = (item: any) => ({
    value: item.name,
    label: item.name,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(false);

    try {
      const formData = new FormData();

      // Append transaction data
      Object.entries(transactionData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Append image IDs
      imageIds.forEach((id, index) => {
        formData.append(`attachments[${index}]`, id);
      });

      const res = await CreateTransaction(formData, lang as string);
      if (res) {
        // Reset form
        setTransactionData({
          client_name: "",
          status: "",
          type: "",
          transaction_date: "",
        });
        setImageIds([]);
        reToast.success(res.message);
        setFlag(!flag);
        setOpen(false);
      } else {
        reToast.error(t("Failed to create transaction"));
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      let errorMessage = t("Something went wrong");

      if (axiosError.response?.data?.errors) {
        const firstError = Object.values(axiosError.response.data.errors)[0];
        errorMessage = firstError[0];
      }

      reToast.error(errorMessage);
    } finally {
      setIsLoading(true);
    }
  };

  return (
    <>
      <Button
        className="!bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
        onClick={() => setOpen(true)}
      >
        {t("Create Transaction")}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent size="2xl" className="gap-3 h-auto">
          <DialogHeader className="p-0">
            <DialogTitle className="text-2xl font-bold text-default-700">
              {t("Create a New Transaction")}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-row justify-between items-center gap-4 flex-wrap">
              {/* Client Selection */}
              <motion.div
                initial={{ y: -30 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1.7 }}
                className="flex flex-col gap-2 w-full md:w-[48%]"
              >
                <Label>{t("Client Selection")}</Label>
                <InfiniteScrollSelect
                  fetchData={fetchData}
                  formatOption={formatOption}
                  placeholder={t("Select Client or Enter Name")}
                  selectedValue={transactionData.client_name}
                  setSelectedValue={handleClientChange}
                  allowFreeText={true}
                />
              </motion.div>

              {/* Status */}
              <motion.div
                initial={{ y: -30 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1.7 }}
                className="flex flex-col gap-2 w-full md:w-[48%]"
              >
                <Label>{t("status")}</Label>
                <BasicSelect
                  menu={Task_Status}
                  setSelectedValue={handleStatusChange}
                  selectedValue={transactionData.status}
                />
              </motion.div>

              {/* Type */}
              <motion.div
                initial={{ y: -30 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1.7 }}
                className="flex flex-col gap-2 w-full md:w-[48%]"
              >
                <Label htmlFor="type">{t("Type")}</Label>
                <Input
                  id="type"
                  name="type"
                  value={transactionData.type}
                  onChange={handleInputChange}
                  placeholder={t("Enter Type")}
                  type="text"
                />
              </motion.div>

              {/* Date */}
              <motion.div
                initial={{ y: -30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.7 }}
                className="flex flex-col gap-2 w-full md:w-[48%]"
              >
                <Label>{t("Date")}</Label>
                <Flatpickr
                  className="w-full bg-background border border-default-200 focus:border-primary focus:outline-none h-10 rounded-md px-2 placeholder:text-default-600"
                  placeholder={t("Select Date")}
                  value={transactionData.transaction_date || ""}
                  onChange={handleDateChange}
                  options={{
                    dateFormat: "Y-m-d",
                    clickOpens: true,
                    static: true,
                  }}
                />
              </motion.div>

              {/* File Upload */}
              <motion.div
                initial={{ y: -30 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1.7 }}
                className="flex flex-col gap-2 w-full"
              >
                <Label>{t("Attachments")}</Label>
                <FileUploaderMultiple onFileChange={handleImageChange} />
              </motion.div>
            </div>

            {/* Form Actions */}
            <motion.div
              initial={{ y: 30 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 1.7 }}
              className="flex justify-center gap-3 mt-6"
            >
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-28 border-[#dfc77d] dark:text-[#fff] dark:hover:bg-[#dfc77d] dark:hover:text-[#000] hover:text-[#000] hover:!bg-[#dfc77d] hover:!border-[#dfc77d] text-black"
                >
                  {t("Cancel")}
                </Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={!loading || uploading}
                className="!bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
              >
                {!loading || uploading
                  ? t("Processing")
                  : t("Create Transaction")}
              </Button>
            </motion.div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateTransactionComponent;
