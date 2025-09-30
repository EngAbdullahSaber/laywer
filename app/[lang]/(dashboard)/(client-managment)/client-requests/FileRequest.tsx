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
import { useState } from "react";
import { UploadImage } from "@/services/auth/auth";
import { toast as reToast } from "react-hot-toast";
import { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { ReplyOnLawyer } from "@/services/client-request/client-requests";
import FileUploaderMultiple from "../../(admin-managment)/clients/add/FileUploaderSingle";
// Update the schema to validate date properly
interface ErrorResponse {
  errors: {
    [key: string]: string[];
  };
}
interface LaywerData {
  title: string;
}
const FileRequest = ({
  id,
  flag1,
  setFlag1,
}: {
  id: any;
  flag1: any;
  setFlag1: any;
}) => {
  const { t } = useTranslate();
  const { lang } = useParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control dialog visibility
  const [loading, setLoading] = useState(true);
  const [fileIds, setFileIds] = useState<string[]>([]);

  const [lawyerData, setLawyerData] = useState<LaywerData>({
    title: "",
  });
  const [images, setImages] = useState<{
    reply_files: string[]; // Array of file IDs instead of a single file ID
  }>({
    reply_files: [],
  });
  // Handle Flatpickr change event and set value in react-hook-form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          reply_files: [...prevState.reply_files, res.body.image_id],
        }));
        setLoading(true);

        reToast.success(res.message); // Show success toast
      } else {
        reToast.error(t("Failed to upload image")); // Show failure toast
        setLoading(true);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      let errorMessage = "Something went wrong."; // Default fallback message
      reToast.error(errorMessage); // Show error toast
      setLoading(true);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    // Append form data
    Object.entries(lawyerData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    fileIds.forEach((fileId, index) => {
      formData.append(`reply_files[${index}]`, fileId);
    });
    try {
      const res = await ReplyOnLawyer(lang, id, formData); // Call API to create the lawyer
      if (res) {
        // Reset data after successful creation
        setLawyerData({
          title: "",
        });
        reToast.success(res.message); // Display success message
        setFlag1(!flag1);
        setIsDialogOpen(false); // Close the dialog after successful deletion
      } else {
        reToast.error(t("Failed to create Case Category")); // Show a fallback failure message
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      // Construct the dynamic key based on field names and the current language
      const fields = ["title", "reply_files"];

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
              <p> {t("Response to the lawyer")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent size="md" className="gap-3 h-auto ">
        <DialogHeader className="p-0">
          <DialogTitle className="text-lg font-semibold text-default-700 ">
            {t("Response to the lawyer")}
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
                <Label htmlFor="Title">{t("Title")}</Label>
                <Input
                  type="text"
                  placeholder={t("Enter Title")}
                  name="title"
                  onChange={handleInputChange}
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="flex flex-col gap-2 "
              >
                <FileUploaderMultiple
                  fileType="reply_files"
                  fileIds={fileIds}
                  setFileIds={setFileIds}
                  maxFiles={15}
                  maxSizeMB={200}
                  compressImages={true}
                  compressionOptions={{
                    maxSizeMB: 1,
                    maxWidthOrHeight: 1920,
                    quality: 0.8,
                  }}
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
                  className="w-28 border-[#dfc77d] dark:text-[#fff] dark:hover:bg-[#dfc77d] dark:hover:text-[#000]  hover:text-[#000]  hover:!bg-[#dfc77d] hover:!border-[#dfc77d] text-black"
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
                {!loading ? t("Loading") : t("Send Response")}
              </Button>
            </motion.div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileRequest;
