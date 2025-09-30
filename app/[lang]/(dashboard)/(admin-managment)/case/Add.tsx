"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Flatpickr from "react-flatpickr";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { useTranslate } from "@/config/useTranslation";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useParams } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { toast as reToast } from "react-hot-toast";
import { AxiosError } from "axios";
import { CreateNewDate } from "@/services/cases/cases";
import BasicSelect from "../contact-list/BasicSelect";

// Interface for lawyer data
interface LawyerData {
  title: string;
  appointment_time: string;
  details: string;
  appointment_date: string;
  law_suit_id: string;
  importance_level: any;
}

interface ErrorResponse {
  errors: {
    [key: string]: string[];
  };
}

const Add = ({ id }: { id: any }) => {
  const { t } = useTranslate();
  const { lang } = useParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [lawyerData, setLawyerData] = useState<LawyerData>({
    title: "",
    appointment_time: "",
    details: "",
    law_suit_id: id,
    appointment_date: "",
    importance_level: "",
  });

  const importance_level: { value: string; label: string }[] = [
    { value: "high", label: "ذو اهمية عالية" },
    { value: "medium", label: "ذو اهمية متوسطة" },
    { value: "normal", label: "ذو اهمية عادية" },
  ];

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setLawyerData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle date change from Flatpickr
  const handleDateChange = (dates: Date[]) => {
    if (dates.length > 0) {
      const date = dates[0];
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const formattedDate = `${year}-${month}-${day}`;

      setLawyerData((prev) => ({
        ...prev,
        appointment_date: formattedDate,
      }));
    }
  };

  const handleSelectChange = (value: any) => {
    setLawyerData((prev) => ({
      ...prev,
      importance_level: value.value,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    // Append form data
    Object.entries(lawyerData).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        formData.append(key, value.toString());
      }
    });

    try {
      const res = await CreateNewDate(formData, lang);
      if (res) {
        // Reset data after successful creation
        setLawyerData({
          title: "",
          appointment_time: "",
          details: "",
          law_suit_id: id,
          appointment_date: "",
          importance_level: "",
        });
        reToast.success(res.message);
        setIsDialogOpen(false);
      } else {
        reToast.error(t("Failed to create Case Category"));
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const fields = [
        "title",
        "requested_data",
        "details",
        "law_suit_id",
        "appointment_date",
        "appointment_time",
        "importance_level",
      ];

      let errorMessage = "Something went wrong.";

      for (let field of fields) {
        const fieldErrorKey = `${field}`;
        const error = axiosError.response?.data?.errors?.[fieldErrorKey];
        if (error) {
          errorMessage = error[0];
          break;
        }
      }

      reToast.error(errorMessage);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button
                size="icon"
                variant="outline"
                className="h-7 w-7"
                color="secondary"
              >
                <Icon icon="ic:outline-add" className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("Create New Date With Client")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent size="md" className="gap-3 h-auto">
        <DialogHeader className="p-0">
          <DialogTitle className="text-2xl font-bold text-default-700">
            {t("Create New Date With Client")}
          </DialogTitle>
        </DialogHeader>
        <div className="h-auto">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
              <motion.div
                initial={{ y: -30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.7 }}
                className="flex flex-col gap-2"
              >
                <Label htmlFor="title">{t("Title")}</Label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  value={lawyerData.title}
                  onChange={handleInputChange}
                  placeholder={t("Enter Title About Date")}
                />
              </motion.div>
              <motion.div
                initial={{ y: -30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.7 }}
                className="flex flex-col gap-2"
              >
                <Label htmlFor="Description">{t("Description")}</Label>
                <Textarea
                  placeholder={t("Type Here")}
                  rows={3}
                  name="details"
                  value={lawyerData.details}
                  onChange={handleInputChange}
                />
              </motion.div>
              <motion.div
                initial={{ y: -30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.7 }}
                className="flex flex-col gap-2"
              >
                <Label htmlFor="date">{t("Date")}</Label>
                <Flatpickr
                  className="w-full bg-background border border-default-200 focus:border-primary focus:outline-none h-10 rounded-md px-2 placeholder:text-default-600"
                  placeholder={t("Select Date About Meeting")}
                  value={
                    lawyerData.appointment_date
                      ? new Date(lawyerData.appointment_date)
                      : ""
                  }
                  onChange={handleDateChange}
                  options={{
                    clickOpens: true,
                    static: true,
                    appendTo: document.body,
                    dateFormat: "Y-m-d",
                  }}
                  id="default-picker"
                />
              </motion.div>
              <div className="flex flex-row justify-between">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1.7 }}
                  className="flex flex-col gap-2 w-[48%]"
                >
                  <Label htmlFor="time">{t("Time")}</Label>
                  <Input
                    type="time"
                    id="time"
                    name="appointment_time"
                    placeholder="HH:MM"
                    value={lawyerData.appointment_time} // Fixed: was using appointment_date
                    onChange={handleInputChange}
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1.7 }}
                  className="flex flex-col gap-2 w-[48%]"
                >
                  <Label htmlFor="importance_level">
                    {t("importance_level")}
                  </Label>
                  <BasicSelect
                    menu={importance_level}
                    setSelectedValue={handleSelectChange}
                    selectedValue={lawyerData.importance_level}
                  />
                </motion.div>
              </div>
            </div>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.7 }}
              className="flex justify-center gap-3 mt-4"
            >
              <DialogClose asChild>
                <Button
                  type="button"
                  className="w-28 border-[#dfc77d] dark:text-[#fff] dark:hover:bg-[#dfc77d] dark:hover:text-[#000] hover:text-[#000] hover:!bg-[#dfc77d] hover:!border-[#dfc77d] text-black"
                  variant="outline"
                >
                  {t("Cancel")}
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="w-28 !bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
              >
                {t("Create Date")}
              </Button>
            </motion.div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Add;
