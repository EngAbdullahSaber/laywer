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
import { useCallback, useState } from "react";
import { useParams } from "next/navigation";
import { CreateServices } from "@/services/services/services";
import FileUploaderSingle from "../../(admin-managment)/lawyer/add/ImageUploader";

interface ErrorResponse {
  errors: {
    [key: string]: string[];
  };
}

interface ServiceData {
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  price: string;
}

const CreateServicesComponent = ({
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
  const [loading, setLoading] = useState(true);

  const [serviceData, setServiceData] = useState<ServiceData>({
    titleEn: "",
    titleAr: "",
    descriptionAr: "",
    descriptionEn: "",
    price: "",
  });

  const { lang } = useParams();

  const [fileIds, setFileIds] = useState<{
    services_image: number | null;
  }>({
    services_image: null,
  });

  // Handle file ID change
  const handleFileIdChange = useCallback(
    (fileId: number | null, fileType: keyof typeof fileIds) => {
      setFileIds((prev) => ({
        ...prev,
        [fileType]: fileId,
      }));
    },
    []
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setServiceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(false);

    const data = {
      title: {
        en: serviceData.titleEn,
        ar: serviceData.titleAr,
      },
      description: {
        en: serviceData.descriptionEn,
        ar: serviceData.descriptionAr,
      },
      price: serviceData.price,
      service_file: fileIds.services_image, // Use the file ID directly
    };

    try {
      const res = await CreateServices(data, lang);
      if (res) {
        // Reset data after successful creation
        setServiceData({
          titleEn: "",
          titleAr: "",
          descriptionAr: "",
          descriptionEn: "",
          price: "",
        });
        setFileIds({
          services_image: null,
        });
        reToast.success(res.message);
        setFlag(!flag);
        setOpen(false);
        setLoading(true);
      } else {
        reToast.error(t("Failed to create services"));
        setLoading(true);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      const fields = [
        "title.ar",
        "title.en",
        "description.en",
        "service_file",
        "description.ar",
        "price",
      ];

      let errorMessage = "Something went wrong.";

      for (let field of fields) {
        const fieldErrorKey = `${field}`;
        const error = axiosError.response?.data?.errors?.[fieldErrorKey];
        if (error) {
          errorMessage = error[0];
          break;
        }
      }

      reToast.error(errorMessage);
      setLoading(true);
    }
  };

  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        {buttonShape ? (
          <Button className="!bg-[#dfc77d] hover:!bg-[#fef0be] text-black">
            {t("Create Services")}
          </Button>
        ) : (
          <Button size="icon" className="h-7 w-7 bg-transparent">
            <Icon icon="gg:add" width="24" height="24" color="#dfc77d" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent size="2xl" className="h-[80%] overflow-y-auto">
        <DialogHeader className="p-0">
          <DialogTitle className="text-2xl font-bold text-default-700">
            {t("Create a New Services")}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea>
          <div className="h-[80%]">
            <form onSubmit={handleSubmit}>
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
                    <div className="sm:grid grid-cols-2 sm:gap-5 space-y-4 sm:space-y-0">
                      <motion.div
                        initial={{ y: -20 }}
                        whileInView={{ y: 0 }}
                        transition={{ duration: 1.7 }}
                        className="flex flex-col gap-2"
                      >
                        <Label htmlFor="titleAr">{t("Services Name")}</Label>
                        <Input
                          id="titleAr"
                          type="text"
                          value={serviceData.titleAr}
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
                        <Label htmlFor="price">{t("Price")}</Label>
                        <Input
                          id="price"
                          type="number"
                          value={serviceData.price}
                          placeholder={t("Enter Price")}
                          name="price"
                          onChange={handleInputChange}
                        />
                      </motion.div>
                    </div>
                    <div className="sm:grid sm:gap-5 space-y-4 sm:space-y-0 mt-4">
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1.7 }}
                        className="flex flex-col gap-2"
                      >
                        <Label htmlFor="descriptionAr">
                          {t("Services Description")}
                        </Label>
                        <Textarea
                          id="descriptionAr"
                          placeholder={t("Type Here")}
                          value={serviceData.descriptionAr}
                          rows={3}
                          name="descriptionAr"
                          onChange={handleInputChange}
                        />
                      </motion.div>
                      <motion.div
                        initial={{ y: -20 }}
                        whileInView={{ y: 0 }}
                        transition={{ duration: 1.7 }}
                        className="flex flex-col gap-2"
                      >
                        <Label>{t("services image")}</Label>
                        <FileUploaderSingle
                          fileType="services_image"
                          fileId={fileIds.services_image}
                          setFileId={(id) =>
                            handleFileIdChange(id, "services_image")
                          }
                          maxSizeMB={10}
                          accept={{
                            "image/*": [".png", ".jpg", ".jpeg", ".pdf"],
                          }}
                        />
                      </motion.div>
                    </div>
                  </TabsContent>
                  <TabsContent value="English">
                    <div className="sm:grid sm:gap-5 space-y-4 sm:space-y-0">
                      <motion.div
                        initial={{ y: -20 }}
                        whileInView={{ y: 0 }}
                        transition={{ duration: 1.7 }}
                        className="flex flex-col gap-2"
                      >
                        <Label htmlFor="titleEn">{t("Services Name")}</Label>
                        <Input
                          id="titleEn"
                          type="text"
                          placeholder={t("Enter Services Name")}
                          value={serviceData.titleEn}
                          name="titleEn"
                          onChange={handleInputChange}
                        />
                      </motion.div>
                      <motion.div
                        initial={{ y: -20 }}
                        whileInView={{ y: 0 }}
                        transition={{ duration: 1.7 }}
                        className="flex flex-col gap-2"
                      >
                        <Label htmlFor="priceEn">{t("Price")}</Label>
                        <Input
                          id="priceEn"
                          type="number"
                          value={serviceData.price}
                          placeholder={t("Enter Price")}
                          name="price"
                          onChange={handleInputChange}
                        />
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1.7 }}
                        className="flex flex-col gap-2"
                      >
                        <Label htmlFor="descriptionEn">
                          {t("Services Description")}
                        </Label>
                        <Textarea
                          value={serviceData.descriptionEn}
                          id="descriptionEn"
                          placeholder={t("Type Here")}
                          rows={3}
                          name="descriptionEn"
                          onChange={handleInputChange}
                        />
                      </motion.div>
                    </div>
                  </TabsContent>
                </Tabs>
              </ScrollArea>
              <motion.div
                initial={{ y: 20 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1.7 }}
                className="flex justify-center gap-3 mt-4"
              >
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
                  {loading ? t("Create Services") : t("Loading")}
                </Button>
              </motion.div>
            </form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CreateServicesComponent;
