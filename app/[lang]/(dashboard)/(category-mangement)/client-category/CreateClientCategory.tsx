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
import { toast as reToast } from "react-hot-toast";
import { useState } from "react";
import { CreateCategory } from "@/services/category/category";
import { useParams } from "next/navigation";
import { AxiosError } from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ErrorResponse {
  errors: {
    [key: string]: string[];
  };
}

interface UserData {
  name: { ar: string; en: string };
  description: { ar: string; en: string };
  type: string;
}
const CreateClientCategory = ({
  buttonShape,
  setFlag,
  flag,
}: {
  buttonShape: any;
  setFlag: any;
  flag: any;
}) => {
  const { t } = useTranslate();
  const { lang } = useParams();
  const [open, setOpen] = useState(false);
  const [loading, setIsloading] = useState(true); // State to control dialog visibility

  // Explicitly type `currentLang` as "ar" | "en"
  const currentLang: "ar" | "en" =
    typeof lang === "string" && ["ar", "en"].includes(lang)
      ? (lang as "ar" | "en")
      : "en";

  const [userData, setUserData] = useState<UserData>({
    name: { ar: "", en: "" },
    description: { ar: "", en: "" },
    type: "client",
  });

  const handleInputChange = (
    key: keyof UserData,
    field: string,
    value: string
  ) => {
    setUserData((prevUserData) => {
      // Ensure that name and description are treated as objects
      if (key === "name" || key === "description") {
        return {
          ...prevUserData,
          [key]: {
            ...prevUserData[key],
            [field]: value,
          },
        };
      }

      // For non-object fields like `type`, just update directly
      return {
        ...prevUserData,
        [key]: value,
      };
    });
  };

  const handleCreateCategory = async () => {
    const formData = new FormData();
    setIsloading(false);

    Object.entries(userData).forEach(([key, value]) => {
      if (typeof value === "object") {
        // Append each language value
        Object.entries(value).forEach(([langKey, langValue]) => {
          // Explicitly cast langValue to string
          formData.append(`${key}[${langKey}]`, String(langValue));
        });
      } else {
        // Append non-object values directly, explicitly cast to string
        formData.append(key, String(value));
      }
    });

    try {
      const res = await CreateCategory(formData, currentLang); // Use `currentLang` instead of `lang`
      if (res) {
        reToast.success(res.message);
        setUserData({
          name: { ar: "", en: "" },
          description: { ar: "", en: "" },
          type: "client",
        });
        setFlag(!flag);
        setIsloading(true);

        setOpen(false); // Close the modal after success
      } else {
        reToast.error(t("Failed to create Client Category"));
        setIsloading(true);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.errors?.[`${"name." + currentLang}`]?.[0] || // Use `currentLang` instead of `lang`
        axiosError.response?.data?.errors?.[
          `${"description." + currentLang}`
        ]?.[0] ||
        "Something went wrong.";
      reToast.error(errorMessage);
      setIsloading(true);
    }
  };
  const handleOpen = () => {
    setOpen(!open);
  };
  return (
    <>
      {" "}
      {buttonShape ? (
        <Button
          onClick={handleOpen}
          className=" !bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
        >
          {" "}
          {t("Create Client Category")}
        </Button>
      ) : (
        <Button
          onClick={handleOpen}
          size="icon"
          className=" h-7 w-7 bg-transparent"
        >
          {" "}
          <Icon icon="gg:add" width="24" height="24" color="#dfc77d" />
        </Button>
      )}
      <Dialog open={open} onOpenChange={handleOpen}>
        <DialogContent size="2xl" className="h-auto">
          <DialogHeader className="p-0">
            <DialogTitle className="text-2xl font-bold text-default-700">
              {t("Create a New Client Category")}
            </DialogTitle>
          </DialogHeader>
          <div>
            <div>
              <ScrollArea className="h-full">
                <Tabs
                  defaultValue={lang == "en" ? "English" : "Arabic"}
                  className=""
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="English">{t("English")}</TabsTrigger>
                    <TabsTrigger value="Arabic">{t("Arabic")}</TabsTrigger>
                  </TabsList>
                  <TabsContent value="English">
                    <div className="sm:grid sm:gap-5 space-y-4 sm:space-y-0">
                      <motion.div
                        initial={{ y: -10 }}
                        whileInView={{ y: 0 }}
                        transition={{ duration: 1.7 }}
                        className="flex flex-col gap-2"
                      >
                        <Label htmlFor="Name">
                          {t("Client Category Name")}
                        </Label>
                        <Input
                          id="Name"
                          value={userData.name["en"]} // No more TypeScript error
                          onChange={(e) =>
                            handleInputChange("name", "en", e.target.value)
                          }
                          placeholder={t("Enter Client Category Name")}
                          type="text"
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1.7 }}
                        className="flex flex-col gap-2"
                      >
                        <Label htmlFor="Description">
                          {t("Description Of Client Category")}
                        </Label>
                        <Textarea
                          id="Description"
                          value={userData.description["en"]} // No more TypeScript error
                          onChange={(e) =>
                            handleInputChange(
                              "description",
                              "en",
                              e.target.value
                            )
                          }
                          placeholder={t("Type Here")}
                          rows={7}
                        />
                      </motion.div>
                    </div>
                  </TabsContent>
                  <TabsContent value="Arabic">
                    <div className="sm:grid sm:gap-5 space-y-4 sm:space-y-0">
                      <motion.div
                        initial={{ y: -10 }}
                        whileInView={{ y: 0 }}
                        transition={{ duration: 1.7 }}
                        className="flex flex-col gap-2"
                      >
                        <Label htmlFor="Name">
                          {t("Client Category Name")}
                        </Label>
                        <Input
                          id="Name"
                          value={userData.name["ar"]} // No more TypeScript error
                          onChange={(e) =>
                            handleInputChange("name", "ar", e.target.value)
                          }
                          placeholder={t("Enter Client Category Name")}
                          type="text"
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1.7 }}
                        className="flex flex-col gap-2"
                      >
                        <Label htmlFor="Description">
                          {t("Description Of Client Category")}
                        </Label>
                        <Textarea
                          id="Description"
                          value={userData.description["ar"]} // No more TypeScript error
                          onChange={(e) =>
                            handleInputChange(
                              "description",
                              "ar",
                              e.target.value
                            )
                          }
                          placeholder={t("Type Here")}
                          rows={7}
                        />
                      </motion.div>
                    </div>
                  </TabsContent>
                </Tabs>
              </ScrollArea>

              <motion.div
                initial={{ y: 30 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1.7 }}
                className=" flex justify-center gap-3 mt-4"
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
                  onClick={handleCreateCategory}
                  className=" !bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
                >
                  {!loading ? t("Loading") : t("Create Client Category")}
                </Button>
              </motion.div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateClientCategory;
