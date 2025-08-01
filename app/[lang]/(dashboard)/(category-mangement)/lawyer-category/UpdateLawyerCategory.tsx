"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useTranslate } from "@/config/useTranslation";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { toast as reToast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { UpdateCategory } from "@/services/category/category";
import { useParams } from "next/navigation";
import { AxiosError } from "axios";

interface ErrorResponse {
  errors: {
    [key: string]: string[];
  };
}

interface UserData {
  name: string;
  description: string;
}

interface UpdateLawyerCategoryProps {
  row: any; // This is passed in from the parent, and contains the data for the category to update
  getCategoryData: () => void; // Function to reload the category data after the update
}

const UpdateLawyerCategory: React.FC<UpdateLawyerCategoryProps> = ({
  row,
  getCategoryData,
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
    name: "",
    description: "",
  });

  // Handle form field changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    let value = e.target.value;

    setUserData((prevData) => ({ ...prevData, [field]: value }));
  };

  // Populate the form with existing category data when the modal is opened
  useEffect(() => {
    if (row?.original) {
      setUserData({
        name: row.original.name || { ar: "", en: "" },
        description: row.original.description || { ar: "", en: "" },
      });
    }
  }, [row]);

  const buildQueryParams = () => {
    const params = new URLSearchParams();

    // Add name with language dynamically
    if (userData.name && userData.name !== row.original.name) {
      params.append(`name[${lang}]`, userData.name); // e.g., name[en]=category03
    }

    // Add description with language dynamically
    if (
      userData.description &&
      userData.description !== row.original.description
    ) {
      params.append(`description[${lang}]`, userData.description); // e.g., description[en]=description03
    }

    // Convert to string and return the query string
    return params.toString();
  };

  const handleUpdateCategory = async () => {
    const formData = new FormData();
    setIsloading(false);

    // Loop through userData and append values to the FormData object
    const queryParams = buildQueryParams();

    try {
      const res = await UpdateCategory(
        formData,
        row.original.id,
        currentLang,
        queryParams
      ); // Use `currentLang` instead of `lang`
      if (res) {
        reToast.success(res.message);
        // Reset the form and close the dialog
        setUserData({
          name: "",
          description: "",
        });
        setOpen(false); // Close the modal after success
        getCategoryData(); // Reload the category data
        setIsloading(true);
      } else {
        reToast.error(t("Failed to update Lawyer Category"));
        setIsloading(true);
      }
    } catch (error) {
      const axiosError = error as AxiosError<{
        message?: string;
        errors?: {
          [key: string]: string[];
        };
      }>;

      // Default error message
      let errorMessage = t("Something went wrong");

      // Check for direct message first
      if (axiosError.response?.data?.message) {
        errorMessage = axiosError.response.data.message;
      }
      // Check for field-specific errors
      else if (axiosError.response?.data?.errors) {
        const errors = axiosError.response.data.errors;

        // Get all error messages regardless of field
        const allErrorMessages = Object.values(errors).flat();

        // Join multiple errors with comma separation
        errorMessage = allErrorMessages.join(", ");

        // Alternative: Get first error only
        // errorMessage = allErrorMessages[0] || errorMessage;

        // If you need language-specific field errors:
        // const langSpecificErrors = [
        //   errors[`name.${currentLang}`]?.[0],
        //   errors[`description.${currentLang}`]?.[0]
        // ].filter(Boolean);
        // errorMessage = langSpecificErrors.join(', ') || errorMessage;
      }

      reToast.error(errorMessage);
      setIsloading(true); // Should set to false, not true
    }
  };

  // Toggle dialog open/close
  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <>
      <Button
        size="icon"
        variant="outline"
        className="h-7 w-7"
        onClick={handleOpen}
        color="secondary"
      >
        <Icon icon="heroicons:pencil" className="h-4 w-4" />
      </Button>
      <Dialog open={open} onOpenChange={handleOpen}>
        <DialogContent size="2xl" className="h-auto">
          <DialogHeader className="p-0">
            <DialogTitle className="text-2xl font-bold text-default-700">
              {t("Update Lawyer Category")}
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
                    <Label htmlFor="Name">{t("Lawyer Category Name")}</Label>
                    <Input
                      id="Name"
                      value={userData.name} // No more TypeScript error
                      onChange={(e) => handleInputChange(e, "name")}
                      placeholder={t("Enter Lawyer Category Name")}
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
                      {t("Description Of Lawyer Category")}
                    </Label>
                    <Textarea
                      id="Description"
                      value={userData.description} // No more TypeScript error
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
                    className="w-28 border-[#dfc77d] dark:text-[#fff] dark:hover:bg-[#dfc77d] dark:hover:text-[#000]  hover:text-[#000]  hover:!bg-[#dfc77d] hover:!border-[#dfc77d] text-black"
                    variant="outline"
                  >
                    {t("Cancel")}
                  </Button>
                </DialogClose>
                <Button
                  type="button"
                  disabled={!loading}
                  onClick={handleUpdateCategory}
                  className="!bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
                >
                  {!loading ? t("Loading") : t("Update Lawyer Category")}
                </Button>
              </motion.div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpdateLawyerCategory;
