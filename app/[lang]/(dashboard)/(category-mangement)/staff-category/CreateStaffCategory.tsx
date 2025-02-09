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
  const { lang } = useParams();
  const [open, setOpen] = useState(false);

  // Explicitly type `currentLang` as "ar" | "en"
  const currentLang: "ar" | "en" =
    typeof lang === "string" && ["ar", "en"].includes(lang)
      ? (lang as "ar" | "en")
      : "en";

  const [userData, setUserData] = useState<UserData>({
    name: { ar: "", en: "" },
    description: { ar: "", en: "" },
    type: "crew",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof UserData
  ) => {
    const value = e.target.value;

    setUserData((prevData) => {
      // Only spread if the field is an object (name or description)
      if (field === "name" || field === "description") {
        return {
          ...prevData,
          [field]: {
            ...prevData[field], // Spread existing object (ar, en) properties
            [currentLang]: value, // Update the value for the current language
          },
        };
      } else {
        // For non-object fields (like `type`), just update the field directly
        return {
          ...prevData,
          [field]: value,
        };
      }
    });
  };

  const handleCreateCategory = async () => {
    const formData = new FormData();

    Object.entries(userData).forEach(([key, value]) => {
      if (typeof value === "object") {
        const languageValue = value[currentLang]; // Use `currentLang` instead of `lang`
        if (languageValue) {
          formData.append(`${key}[${currentLang}]`, languageValue);
        }
      } else {
        formData.append(key, value);
      }
    });

    try {
      const res = await CreateCategory(formData, currentLang); // Use `currentLang` instead of `lang`
      if (res) {
        reToast.success(res.message);
        setUserData({
          name: { ar: "", en: "" },
          description: { ar: "", en: "" },
          type: "crew",
        });
        setFlag(!flag);
        setOpen(false); // Close the modal after success
      } else {
        reToast.error(t("Failed to create Staff Category"));
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
          {t("Create Staff Category")}
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
              {t("Create a New Staff Category")}
            </DialogTitle>
          </DialogHeader>
          <div>
            <form onSubmit={(e) => e.preventDefault()}>
              <ScrollArea className="h-full">
                <div className="sm:grid sm:gap-5 space-y-4 sm:space-y-0">
                  <motion.div
                    initial={{ y: -30 }}
                    whileInView={{ y: 0 }}
                    transition={{ duration: 1.7 }}
                    className="flex flex-col gap-2"
                  >
                    <Label htmlFor="Name">{t("Staff Category Name")}</Label>
                    <Input
                      id="Name"
                      value={userData.name[currentLang]} // No more TypeScript error
                      onChange={(e) => handleInputChange(e, "name")}
                      placeholder={t("Enter Staff Category Name")}
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
                      {t("Description Of Staff Category")}
                    </Label>
                    <Textarea
                      id="Description"
                      value={userData.description[currentLang]} // No more TypeScript error
                      onChange={(e) => handleInputChange(e, "description")}
                      placeholder={t("Type Here")}
                      rows={7}
                    />
                  </motion.div>
                </div>
              </ScrollArea>

              <motion.div
                initial={{ y: 30 }}
                whileInView={{ y: 0 }}
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
                  type="button"
                  onClick={handleCreateCategory}
                  className="!bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
                >
                  {t("Create Staff Category")}
                </Button>
              </motion.div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateLawyerCategory;
