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
import { CleaveInput } from "@/components/ui/cleave";
import { Textarea } from "@/components/ui/textarea";
import { toast as reToast } from "react-hot-toast";
import { AxiosError } from "axios";
import { CreateNewDate } from "@/services/cases/cases";
import BasicSelect from "../../(lawyer-managment)/lawyer-cases/[caseId]/follow-report/BasicSelect";
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
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control dialog visibility
  const [lawyerData, setLawyerData] = useState<LawyerData>({
    title: "",
    appointment_time: "",
    details: "",
    law_suit_id: id,
    appointment_date: "",
    importance_level: "",
  });
  const importance_level: { value: string; label: string }[] = [
    { value: "high", label: "ذو اهمية عالية" }, // High - more concise translation
    { value: "medium", label: "ذو اهمية متوسطة" }, // Medium - more concise translation
    { value: "normal", label: "ذو اهمية عادية" }, // Normal - clearer and more common term
  ];
  // Handle title input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setLawyerData({ ...lawyerData, [name]: value });
  };

  // Handle date change from Flatpickr
  const handleDateChange = (date1: Date[]) => {
    const date = new Date(date1[0].toISOString());

    // Extract day, month, and year
    const day = String(date.getDate()).padStart(2, "0"); // Ensures two digits
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();

    // Format as yyyy-mm-dd
    const formattedDate = `${year}-${month}-${day}`;
    setLawyerData({
      ...lawyerData,
      appointment_date: formattedDate.toString(),
    });
  };
  const handleSelectChange = (value: any) => {
    setLawyerData((prevData) => ({
      ...prevData,
      importance_level: value.value,
    }));
  };
  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    console.log(typeof lawyerData.appointment_date);
    // Append form data
    Object.entries(lawyerData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    formData.append(`requested_details`, lawyerData.details);

    try {
      const res = await CreateNewDate(formData, lang); // Call API to create the lawyer
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
        reToast.success(res.message); // Display success message
        setIsDialogOpen(false); // Close the dialog after successful deletion
      } else {
        reToast.error(t("Failed to create Case Category")); // Show a fallback failure message
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      // Construct the dynamic key based on field names and the current language
      const fields = [
        "title",
        "requested_data",
        "details",
        "law_suit_id",
        "appointment_date",
        "appointment_time",
        "importance_level",
      ];

      let errorMessage = "Something went wrong."; // Default fallback message

      // Loop through the fields to find the corresponding error message
      for (let field of fields) {
        const fieldErrorKey = `${field}`; // Construct key like "name.en" or "name.ar"
        const error = axiosError.response?.data?.errors?.[fieldErrorKey];
        if (error) {
          errorMessage = error[0]; // Retrieve the first error message for the field
          break; // Exit the loop once the error is found
        }
      }

      // Show the error in a toast notification
      reToast.error(errorMessage); // Display the error message in the toast
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
              <p> {t("Create New Date With Client")}</p>
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
                  }}
                  onClick={(e) => e.preventDefault()}
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
                  <Label htmlFor="titimetle">{t("Time")}</Label>

                  <Input
                    type="time"
                    id="time"
                    name="appointment_time"
                    placeholder="HH:MM" // Updated placeholder
                    value={lawyerData.appointment_date}
                    onChange={handleInputChange}
                  />
                </motion.div>{" "}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1.7 }}
                  className="flex flex-col gap-2 w-[48%]"
                >
                  <Label htmlFor="">{t("importance_level")}</Label>
                  <BasicSelect
                    menu={importance_level}
                    setSelectedValue={(value) => handleSelectChange(value)}
                    selectedValue={lawyerData["importance_level"]}
                  />
                </motion.div>{" "}
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
                  className="w-28 border-[#dfc77d] dark:text-[#fff] dark:hover:bg-[#dfc77d] dark:hover:text-[#000]  hover:text-[#000]  hover:!bg-[#dfc77d] hover:!border-[#dfc77d] text-black"
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
