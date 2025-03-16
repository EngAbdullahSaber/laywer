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
import { Icon } from "@iconify/react";
import { useTranslate } from "@/config/useTranslation";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import FileUploaderSingle from "./FileUploaderSingle";
import { toast as reToast } from "react-hot-toast";
import { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { UploadImage } from "@/services/auth/auth";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { AskClient } from "@/services/cases/cases";
// Update the schema to validate date properly
interface ErrorResponse {
  errors: {
    [key: string]: string[];
  };
}
interface LaywerData {
  title: string;
  requested_data: string;
  details: string;
  law_suit_id: string;
}
const FileRequest = ({ id }: { id: any }) => {
  const { t } = useTranslate();
  const { lang } = useParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control dialog visibility
  const [loading, setLoading] = useState(true);
  const [lawyerData, setLawyerData] = useState<LaywerData>({
    title: "",
    requested_data: "",
    details: "",
    law_suit_id: id,
  });
  const [images, setImages] = useState<{
    order_files: string[]; // Array of file IDs instead of a single file ID
  }>({
    order_files: [],
  });
  // Handle Flatpickr change event and set value in react-hook-form
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setLawyerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = async (
    file: File,
    imageType: keyof typeof images
  ) => {
    setLoading(false);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await UploadImage(formData, lang); // Call API to upload the image
      if (res) {
        // Append the image ID to the array of file IDs
        setImages((prevState) => ({
          ...prevState,
          reply_files: [...prevState.order_files, res.body.image_id],
        }));
        setLoading(true);

        reToast.success(res.message); // Show success toast
      } else {
        reToast.error(t("Failed to upload image")); // Show failure toast
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      let errorMessage = "Something went wrong."; // Default fallback message
      reToast.error(errorMessage); // Show error toast
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    // Append form data
    Object.entries(lawyerData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    images.order_files.forEach((fileId, index) => {
      formData.append(`order_files[${index}]`, fileId);
    });
    formData.append(`requested_data`, lawyerData.details);

    try {
      const res = await AskClient(formData, lang); // Call API to create the lawyer
      if (res) {
        // Reset data after successful creation
        setLawyerData({
          title: "",
          requested_data: "",
          details: "",
          law_suit_id: id,
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
        "order_files",
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
                className=" h-7 w-7"
                color="secondary"
              >
                <Icon icon="fluent-mdl2:file-request" className="h-4 w-4" />{" "}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p> {t("Ask Client About File")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent size="md" className="gap-3 h-auto ">
        <DialogHeader className="p-0">
          <DialogTitle className="text-lg font-semibold text-default-700 ">
            {t("Ask Client About File")}
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
                <Label htmlFor="Title">{t("Title")}</Label>
                <Input
                  type="text"
                  placeholder={t("Enter Title")}
                  name="title"
                  onChange={handleInputChange}
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
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1.7 }}
                className="flex flex-col gap-2 w-full"
              >
                <FileUploaderSingle
                  imageType="order_files"
                  id={images.order_files}
                  onFileChange={handleImageChange}
                />{" "}
              </motion.div>
            </div>

            {/* Submit Button inside form */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.7 }}
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
                {!loading ? t("Loading") : t("Ask Client")}
              </Button>
            </motion.div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileRequest;
