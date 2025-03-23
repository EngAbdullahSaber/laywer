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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useTranslate } from "@/config/useTranslation";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast as reToast } from "react-hot-toast";
import { AxiosError } from "axios";
import { UploadImage } from "@/services/auth/auth";
import { useState } from "react";
import { useParams } from "next/navigation";
import { CreateServices } from "@/services/services/services";
import FileUploaderMultiple from "./FileUploaderSingle";
interface ErrorResponse {
  errors: {
    [key: string]: string[];
  };
}
interface LaywerData {
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  price: string;
}
const CreateLawyerCategory = ({
  buttonShape,
  setFlag,
  flag,
}: {
  buttonShape: any;
  setFlag: any;
  flag: any;
}) => {
  const { t } = useTranslate();
  const [open, setOpen] = useState(false);
  const [loading, setIsloading] = useState(true); // State to control dialog visibility

  const [lawyerData, setLawyerData] = useState<LaywerData>({
    titleEn: "",
    titleAr: "",
    descriptionAr: "",
    descriptionEn: "",
    price: "",
  });
  const { lang } = useParams();
  const [images, setImages] = useState<{
    service_file: File | null;
  }>({
    service_file: null,
  });

  const handleImageChange = async (
    file: File,
    imageType: keyof typeof images
  ) => {
    setIsloading(false);

    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await UploadImage(formData, lang); // Call API to create the lawyer
      if (res) {
        setImages((prevState) => ({
          ...prevState,
          [imageType]: res.body.image_id,
        }));
        reToast.success(res.message); // Display success message
        setIsloading(true);
      } else {
        reToast.error(t("Failed to create upload image")); // Show a fallback failure message
        setIsloading(true);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      let errorMessage = "Something went wrong."; // Default fallback message
      reToast.error(errorMessage); // Display the error message in the toast
      setIsloading(true);
    }
  };

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
    const formData = new FormData();

    const data = {
      title: {
        en: lawyerData.titleEn,
        ar: lawyerData.titleAr,
      },
      description: {
        en: lawyerData.descriptionEn,
        ar: lawyerData.descriptionAr,
      },
      price: lawyerData.price,
      service_file: images.service_file,
    };
    try {
      const res = await CreateServices(data, lang); // Call API to create the lawyer
      if (res) {
        // Reset data after successful creation
        setLawyerData({
          titleEn: "",
          titleAr: "",
          descriptionAr: "",
          descriptionEn: "",
          price: "",
        });
        setImages({
          service_file: null,
        });
        reToast.success(res.message); // Display success message
        setFlag(!flag);
        setOpen(false); // Close the modal after success
      } else {
        reToast.error(t("Failed to create services")); // Show a fallback failure message
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      // Construct the dynamic key based on field names and the current language
      const fields = [
        "title.ar",
        "title.en",
        "description.en",
        "service_file",
        "description.ar",
        "price",
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

  const handleOpen = () => {
    setOpen(!open);
  };
  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        {buttonShape ? (
          <Button className=" !bg-[#dfc77d] hover:!bg-[#fef0be] text-black">
            {" "}
            {t("Create Services")}
          </Button>
        ) : (
          <Button size="icon" className=" h-7 w-7 bg-transparent">
            {" "}
            <Icon icon="gg:add" width="24" height="24" color="#dfc77d" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent size="2xl" className="h-auto overflow-y-auto">
        <DialogHeader className="p-0">
          <DialogTitle className="text-2xl font-bold text-default-700">
            {t("Create a New Services")}
          </DialogTitle>
        </DialogHeader>
        <div>
          <form onSubmit={handleSubmit}>
            {" "}
            <ScrollArea className="h-full">
              <Tabs
                defaultValue={lang == "en" ? "English" : "Arabic"}
                className=""
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="English">{t("English")}</TabsTrigger>
                  <TabsTrigger value="Arabic">{t("Arabic")}</TabsTrigger>
                </TabsList>
                <TabsContent value="Arabic">
                  <div className="sm:grid grid-cols-2   sm:gap-5 space-y-4 sm:space-y-0">
                    <motion.div
                      initial={{ y: -20 }}
                      whileInView={{ y: 0 }}
                      transition={{ duration: 1.7 }}
                      className="flex flex-col gap-2"
                    >
                      <Label htmlFor="Name">{t("Services Name")}</Label>
                      <Input
                        id="Name"
                        type="text"
                        placeholder={t("Enter Services Name")}
                        name="titleAr"
                        onChange={handleInputChange}
                      />
                    </motion.div>
                    <motion.div
                      initial={{ y: -20 }}
                      whileInView={{ y: 0 }}
                      transition={{ duration: 1.7 }}
                      className="flex flex-col gap-2"
                    >
                      <Label htmlFor="Price">{t("Price")}</Label>
                      <Input
                        id="Price"
                        type="number"
                        placeholder={t("Enter Price")}
                        name="price"
                        onChange={handleInputChange}
                      />
                    </motion.div>
                  </div>
                  <div className="sm:grid   sm:gap-5 space-y-4 sm:space-y-0">
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 1.7 }}
                      className="flex flex-col gap-2"
                    >
                      <Label htmlFor="Description">
                        {t("Services Description")}
                      </Label>
                      <Textarea
                        id="Description"
                        placeholder={t("Type Here")}
                        rows={3}
                        name="descriptionAr"
                        onChange={(e) => handleInputChange(e)}
                      />
                    </motion.div>
                    <motion.div
                      initial={{ y: -20 }}
                      whileInView={{ y: 0 }}
                      transition={{ duration: 1.7 }}
                      className="flex flex-col gap-2"
                    >
                      <Label>{t("services image")}</Label>
                      <FileUploaderMultiple
                        imageType="service_file"
                        id={images.service_file}
                        onFileChange={handleImageChange}
                      />
                    </motion.div>
                  </div>
                </TabsContent>
                <TabsContent value="English">
                  {" "}
                  <div className="sm:grid   sm:gap-5 space-y-4 sm:space-y-0">
                    <motion.div
                      initial={{ y: -20 }}
                      whileInView={{ y: 0 }}
                      transition={{ duration: 1.7 }}
                      className="flex flex-col gap-2"
                    >
                      <Label htmlFor="Name">{t("Services Name")}</Label>
                      <Input
                        id="Name"
                        type="text"
                        placeholder={t("Enter Services Name")}
                        name="titleEn"
                        onChange={handleInputChange}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 1.7 }}
                      className="flex flex-col gap-2"
                    >
                      <Label htmlFor="Description">
                        {t("Services Description")}
                      </Label>
                      <Textarea
                        id="Description"
                        placeholder={t("Type Here")}
                        rows={3}
                        name="descriptionEn"
                        onChange={(e) => handleInputChange(e)}
                      />
                    </motion.div>
                  </div>{" "}
                </TabsContent>
              </Tabs>
            </ScrollArea>
            <motion.div
              initial={{ y: 20 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 1.7 }}
              className=" flex justify-center gap-3 mt-4"
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
                className=" !bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
              >
                {!loading ? t("Loading") : t("Create Services")}
              </Button>
            </motion.div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLawyerCategory;
