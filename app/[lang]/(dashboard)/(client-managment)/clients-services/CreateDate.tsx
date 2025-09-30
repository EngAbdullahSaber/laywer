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
import { useState, useCallback } from "react";
import { UploadImage } from "@/services/auth/auth";
import { useParams } from "next/navigation";
import { toast as reToast } from "react-hot-toast";
import { AxiosError } from "axios";
import { AskAboutServices } from "@/services/services/services";
import FileUploaderSingle from "../../(admin-managment)/lawyer/add/ImageUploader";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ErrorResponse {
  errors: {
    [key: string]: string[];
  };
}

interface LawyerData {
  details: string;
  service_id: string;
}

interface CreateDateProps {
  getCourtData: () => Promise<void>;
  id: string;
}

const CreateDate = ({ getCourtData, id }: CreateDateProps) => {
  const { t } = useTranslate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { lang } = useParams();

  const [lawyerData, setLawyerData] = useState<LawyerData>({
    details: "",
    service_id: id,
  });

  const [fileIds, setFileIds] = useState<number[]>([]);

  // Fixed: Properly typed image change handler
  const handleImageChange = async (file: File) => {
    setLoading(false);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await UploadImage(formData, lang);
      if (res) {
        setLoading(true);
        reToast.success(res.message);
      } else {
        reToast.error(t("Failed to create upload image"));
        setLoading(true);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      let errorMessage = "Something went wrong.";

      if (axiosError.response?.data?.errors) {
        const errors = axiosError.response.data.errors;
        // Get the first error message from the response
        const firstErrorKey = Object.keys(errors)[0];
        errorMessage = errors[firstErrorKey]?.[0] || errorMessage;
      }

      reToast.error(errorMessage);
      setLoading(true);
    }
  };

  // Fixed: Properly typed file ID change handler
  const handleFileIdChange = useCallback((fileId: number | null) => {
    if (fileId !== null) {
      setFileIds([fileId]);
    } else {
      setFileIds([]);
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setLawyerData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(false);

    try {
      const formData = new FormData();

      // Append lawyer data
      Object.entries(lawyerData).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });

      // Append file ID if exists
      if (fileIds.length > 0 && fileIds[0]) {
        formData.append("invoice_file", fileIds[0].toString());
      }

      const res = await AskAboutServices(lang, formData);

      if (res) {
        // Reset form after successful submission
        setLawyerData({
          details: "",
          service_id: id,
        });
        setFileIds([]);
        setLoading(true);
        await getCourtData();
        reToast.success(res.message);
        setIsDialogOpen(false);
      } else {
        reToast.error(t("Failed to create Case Category"));
        setLoading(true);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      let errorMessage = "Something went wrong.";

      if (axiosError.response?.data?.errors) {
        const errors = axiosError.response.data.errors;
        const fields = ["details", "service_id", "invoice_file"];

        for (let field of fields) {
          const error = errors[field];
          if (error) {
            errorMessage = error[0];
            break;
          }
        }
      }

      reToast.error(errorMessage);
      setLoading(true);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="!bg-[#dfc77d] hover:!bg-[#fef0be] text-black">
          {t("Ask Services")}
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-3 h-[80%] max-w-md">
        <DialogHeader className="p-0">
          <DialogTitle className="text-2xl font-bold text-default-700">
            {t("Ask Services")}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea>
          <div className="h-auto">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4">
                <motion.div
                  initial={{ y: -30 }}
                  whileInView={{ y: 0 }}
                  transition={{ duration: 1.2 }}
                  className="flex flex-col gap-2"
                >
                  <Label htmlFor="details" className="my-4">
                    {t("Your Description")}
                  </Label>
                  <Textarea
                    placeholder={t("Type Here")}
                    rows={3}
                    id="details"
                    name="details"
                    value={lawyerData.details}
                    onChange={handleInputChange}
                    required
                  />
                </motion.div>
                <motion.div
                  initial={{ y: -30 }}
                  whileInView={{ y: 0 }}
                  transition={{ duration: 1.2 }}
                  className="flex flex-col gap-2"
                >
                  <Label>{t("Payment Receipt")}</Label>
                  <FileUploaderSingle
                    fileType="invoice_file"
                    fileId={fileIds[0] || null}
                    setFileId={handleFileIdChange}
                    maxSizeMB={10}
                    accept={{ "image/*": [".png", ".jpg", ".jpeg", ".pdf"] }}
                  />
                </motion.div>
              </div>

              <div className="flex justify-center gap-3 mt-4">
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
                  disabled={!loading}
                  className="w-28 !bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
                >
                  {!loading ? t("Loading") : t("Ask Services")}
                </Button>
              </div>
            </form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDate;
