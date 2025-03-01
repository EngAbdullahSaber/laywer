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
import { Label } from "@/components/ui/label";

import { useTranslate } from "@/config/useTranslation";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import ImageUploader from "./ImageUploader";
import { useState } from "react";
import { UploadImage } from "@/services/auth/auth";
import { useParams } from "next/navigation";
import { toast as reToast } from "react-hot-toast";
import { AxiosError } from "axios";
import { AskAboutServices } from "@/services/services/services";
interface ErrorResponse {
  errors: {
    [key: string]: string[];
  };
}
interface LaywerData {
  details: string;
  service_id: string;
}
const CreateDate = ({ id }: { id: any }) => {
  const { t } = useTranslate();
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to control dialog visibility

  const [lawyerData, setLawyerData] = useState<LaywerData>({
    details: "",
    service_id: id,
  });
  const { lang } = useParams();
  const [images, setImages] = useState<{
    invoice_file: File | null;
  }>({
    invoice_file: null,
  });

  const handleImageChange = async (
    file: File,
    imageType: keyof typeof images
  ) => {
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await UploadImage(formData, lang); // Call API to create the lawyer
      if (res) {
        // Reset data after successful creation
        console.log(res.body.image_id);
        setImages((prevState) => ({
          ...prevState,
          [imageType]: res.body.image_id,
        }));
        reToast.success(res.message); // Display success message
      } else {
        reToast.error(t("Failed to create upload image")); // Show a fallback failure message
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      // Construct the dynamic key based on field names and the current language

      let errorMessage = "Something went wrong."; // Default fallback message

      // Loop through the fields to find the corresponding error message

      // Show the error in a toast notification
      reToast.error(errorMessage); // Display the error message in the toast
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLawyerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    // Append form data
    Object.entries(lawyerData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    console.log(images.invoice_file);
    formData.append(`invoice_file`, images.invoice_file);
    try {
      const res = await AskAboutServices(lang, formData); // Call API to create the lawyer
      if (res) {
        // Reset data after successful creation
        setLawyerData({
          details: "",
          service_id: "",
        });
        setImages({
          invoice_file: null,
        });
        reToast.success(res.message); // Display success message
        setIsDialogOpen(false); // Close the dialog after successful deletion
      } else {
        reToast.error(t("Failed to create Case Category")); // Show a fallback failure message
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      // Construct the dynamic key based on field names and the current language
      const fields = ["details", "service_id", "invoice_file"];

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
        <Button className=" !bg-[#dfc77d] hover:!bg-[#fef0be] text-black">
          {t("Ask Services")}
        </Button>
      </DialogTrigger>
      <DialogContent size="md" className="gap-3 h-auto ">
        <DialogHeader className="p-0">
          <DialogTitle className="text-2xl font-bold text-default-700">
            {t("Ask Services")}
          </DialogTitle>
        </DialogHeader>
        <div className="h-auto">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
              <motion.div
                initial={{ y: -30 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1.2 }}
                className="flex flex-col gap-2"
              >
                <Label htmlFor="question" className="my-4">
                  {t("Your Describtion")}
                </Label>
                <Textarea
                  placeholder={t("Type Here")}
                  rows={3}
                  id="message"
                  name="details"
                  onChange={handleInputChange}
                />
              </motion.div>
              <motion.div
                initial={{ y: -30 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1.2 }}
                className="flex flex-col gap-2"
              >
                <Label>{t("Payment Receipt")}</Label>
                <ImageUploader
                  imageType="invoice_file"
                  id={images.invoice_file}
                  onFileChange={handleImageChange}
                />
              </motion.div>
            </div>

            {/* Submit Button inside form */}
            <div className="flex justify-center gap-3 mt-4">
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
                {t("Ask Services")}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDate;
