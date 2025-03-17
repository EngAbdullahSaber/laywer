"use client";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslate } from "@/config/useTranslation";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast as reToast } from "react-hot-toast";
import { useParams } from "next/navigation";
import { AxiosError } from "axios";
import { DeleteTasks } from "@/services/tasks/tasks";
interface DeleteTasks {
  id: string;
  getTasksData: () => Promise<void>;
}
interface ErrorResponse {
  errors?: string[];
}
const DeleteButton: React.FC<DeleteTasks> = ({ id, getTasksData }) => {
  const { t } = useTranslate();
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control dialog visibility
  const { lang } = useParams();

  const deleteTasksData = async () => {
    try {
      const res = await DeleteTasks(id, lang); // Delete user
      reToast.success(res.message);
      setIsDialogOpen(false); // Close the dialog after successful deletion
      getTasksData(); // Re-fetch the user data after deletion
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>; // Cast to AxiosError with your expected response type
      const errorMessage =
        axiosError.response?.data?.errors?.[0] || "Something went wrong.";
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
                className=" h-7 w-7"
                color="secondary"
              >
                <Icon icon="heroicons:trash" className="h-4 w-4" />
              </Button>{" "}
            </TooltipTrigger>
            <TooltipContent>
              <p> {t("Deleting Task")} </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>

      <DialogContent className="p-6 !h-auto" size="md">
        <div className="flex flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1.7 }}
            className="text-8xl text-destructive"
          >
            <Icon icon="wpf:delete-shield" color="destructive" />
          </motion.span>
          <motion.h3
            initial={{ y: -50 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 1.2 }}
            className="mt-6 mb-4 text-destructive text-xl font-semibold"
          ></motion.h3>
          <motion.p
            initial={{ y: -50 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 1.4 }}
            className="text-sm text-default-500 "
          >
            {t("Are You Sure For Delete This Task?")}
          </motion.p>
        </div>
        <DialogFooter className="flex flex-row gap-5 justify-center">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.7 }}
            className="flex flex-row gap-5 justify-center w-full"
          >
            {" "}
            <DialogClose asChild>
              <Button type="submit" variant="outline" color="destructive">
                {t("Disagree")}
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="w-28 !bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
              onClick={deleteTasksData}
              color="primary"
            >
              {t("Agree")}
            </Button>
          </motion.div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteButton;
