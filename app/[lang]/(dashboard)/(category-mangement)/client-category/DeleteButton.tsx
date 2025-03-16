"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslate } from "@/config/useTranslation";
import { Icon } from "@iconify/react";
import { toast as reToast } from "react-hot-toast";
import { useParams } from "next/navigation";

import { AxiosError } from "axios";
import { DeleteCategory } from "@/services/category/category";
interface DeleteUser {
  id: string;
  getCategoryData: () => Promise<void>;
}
interface ErrorResponse {
  errors?: string[];
}
const DeleteButton: React.FC<DeleteUser> = ({ id, getCategoryData }) => {
  const { t } = useTranslate();
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control dialog visibility
  const { lang } = useParams();

  const deleteCategoryData = async () => {
    try {
      const res = await DeleteCategory(id, lang); // Delete user
      reToast.success(res.message);
      setIsDialogOpen(false); // Close the dialog after successful deletion
      getCategoryData(); // Re-fetch the user data after deletion
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
        <Button
          size="icon"
          variant="outline"
          className="h-7 w-7"
          color="secondary"
        >
          <Icon icon="heroicons:trash" className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="p-6 !h-auto" size="md">
        <div className="flex flex-col items-center text-center">
          <span className="text-8xl text-danger">
            <Icon icon="wpf:delete-shield" className="!text-[#dfc77d]" />
          </span>
          <h3 className="mt-6 mb-4 text-danger text-xl font-semibold">
            {t("Deleting Category")}
          </h3>
          <p className="text-sm text-default-500">
            {t("Are You Sure You Want To Delete This Category?")}
          </p>
        </div>
        <DialogFooter>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.7 }}
            className="flex flex-row gap-5 justify-center w-full"
          >
            {" "}
            <DialogClose asChild>
              <Button type="button" variant="outline">
                {t("Disagree")}
              </Button>
            </DialogClose>
            <Button type="button" color="warning" onClick={deleteCategoryData}>
              {t("Agree")}
            </Button>{" "}
          </motion.div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteButton;
