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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Flatpickr from "react-flatpickr";
import { useState } from "react";
import { Icon } from "@iconify/react";
import BasicSelect from "@/components/common/Select/BasicSelect";
import { useTranslate } from "@/config/useTranslation";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useParams } from "next/navigation";
// Update the schema to validate date properly
import { toast as reToast } from "react-hot-toast";
import { AxiosError } from "axios";
import { ChangeStatus } from "@/services/cases/cases";

interface ErrorResponse {
  errors: {
    [key: string]: string[];
  };
}
interface LaywerData {
  status: string;
}
const CaseStatus = ({ id }: { id: any }) => {
  const { t } = useTranslate();
  const { lang } = useParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control dialog visibility
  const [lawyerData, setLawyerData] = useState<LaywerData>({
    status: "",
  });
  const handleSelectChange = (value: string) => {
    setLawyerData((prevData) => ({
      ...prevData,
      status: value.value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    // Append form data
    Object.entries(lawyerData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    const data = { status: lawyerData.status };
    try {
      const res = await ChangeStatus(data, id, lang); // Call API to create the lawyer
      if (res) {
        // Reset data after successful creation
        setLawyerData({
          status: "",
        });
        reToast.success(res.message); // Display success message
        setIsDialogOpen(false); // Close the dialog after successful deletion
      } else {
        reToast.error(t("Failed to create Case Category")); // Show a fallback failure message
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      // Construct the dynamic key based on field names and the current language
      const fields = ["status"];

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
  const Case_Status: { value: string; label: string }[] = [
    { value: "pending", label: "قيدالانتظار" },
    { value: "in_progress", label: "قيد التنفيذ" },
    { value: "completed", label: "مكتملة" },
  ];
  const handleOpen = () => {
    setIsDialogOpen(!isDialogOpen);
  };
  return (
    <>
      {" "}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button
              size="icon"
              variant="outline"
              className=" h-7 w-7"
              color="secondary"
              onClick={handleOpen}
            >
              <Icon icon="fluent:status-32-regular" className="h-4 w-4" />
            </Button>{" "}
          </TooltipTrigger>
          <TooltipContent>
            <p> {t("Change Staus of Cases")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent size="md" className="gap-3 h-auto ">
          <DialogHeader className="p-0">
            <DialogTitle className="text-2xl font-bold text-default-700">
              {t("Change Staus of Cases")}
            </DialogTitle>
          </DialogHeader>
          <div className="h-auto">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
                <motion.div
                  initial={{ y: -30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 1.5 }}
                  className="flex flex-col gap-2"
                >
                  <Label htmlFor="Title">{t("Change Case Status")}</Label>
                  <BasicSelect
                    menu={Case_Status}
                    setSelectedValue={(value) => handleSelectChange(value)}
                    selectedValue={lawyerData["status"]}
                  />
                </motion.div>
              </div>

              {/* Submit Button inside form */}
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="flex justify-center gap-3 mt-4"
              >
                <DialogClose asChild>
                  <Button
                    type="button"
                    className="w-28 border-[#dfc77d] hover:!bg-[#dfc77d] hover:!border-[#dfc77d] !text-black"
                    variant="outline"
                  >
                    {t("Cancel")}
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="w-28 !bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
                >
                  {t("Change Staus")}
                </Button>
              </motion.div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CaseStatus;
