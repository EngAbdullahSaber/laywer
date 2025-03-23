"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import { toast as reToast } from "react-hot-toast";
import { AxiosError } from "axios";
import { useState } from "react";
import { Icon } from "@iconify/react";
import BasicSelect from "@/components/common/Select/BasicSelect";
import { useTranslate } from "@/config/useTranslation";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useParams } from "next/navigation";
import { ChangeStatus } from "@/services/tasks/tasks";
interface ErrorResponse {
  errors: {
    [key: string]: string[];
  };
}
interface LaywerData {
  status: string;
}
const TaskStatus = ({
  id,
  getClientData,
}: {
  id: any;
  getClientData: () => Promise<void>;
}) => {
  const { t } = useTranslate();
  const { lang } = useParams();
  const [loading, setIsloading] = useState(true); // State to control dialog visibility

  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control dialog visibility
  const [lawyerData, setLawyerData] = useState<LaywerData>({
    status: "",
  });
  const handleSelectChange = (value: string) => {
    setLawyerData((prevData) => ({
      ...prevData,
      status: value?.value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsloading(false);
    // Append form data
    const data = {
      status: lawyerData.status, //pending, in_progress, completed
      id: lawyerData.status, //pending, in_progress, completed
    };

    try {
      const res = await ChangeStatus(data, id, lang); // Call API to create the lawyer
      if (res) {
        // Reset data after successful creation
        setLawyerData({
          status: "",
        });
        reToast.success(res.message); // Display success message
        getClientData();
        setIsDialogOpen(false); // Close the dialog after successful deletion
        setIsloading(true);
      } else {
        reToast.error(t("Failed to create Case Category")); // Show a fallback failure message
        setIsloading(true);
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
      setIsloading(true);
    }
  };
  const Task_Status: { value: string; label: string }[] = [
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
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p> {t("Task Staus of Cases")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent size="md" className="gap-3 h-auto ">
          <DialogHeader className="p-0">
            <DialogTitle className="text-2xl font-bold text-default-700">
              {t("Task Staus of Cases")}
            </DialogTitle>
          </DialogHeader>
          <div className="h-auto">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
                <motion.div
                  initial={{ y: -20 }}
                  whileInView={{ y: 0 }}
                  transition={{ duration: 1 }}
                  className="flex flex-col gap-2"
                >
                  <Label htmlFor="Task_Status">{t("Change Task Status")}</Label>
                  <BasicSelect
                    menu={Task_Status}
                    setSelectedValue={(value) => handleSelectChange(value)}
                    selectedValue={lawyerData["status"]}
                  />
                </motion.div>
              </div>

              {/* Submit Button inside form */}
              <motion.div
                initial={{ y: 20 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1 }}
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
                  disabled={!loading}
                  className="w-28 !bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
                >
                  {!loading ? t("Loading") : t("Change Staus")}
                </Button>
              </motion.div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskStatus;
