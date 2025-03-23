"use client";
import BasicSelect from "@/components/common/Select/BasicSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast as reToast } from "react-hot-toast";
import { AxiosError } from "axios";
import Flatpickr from "react-flatpickr";
import { useState } from "react";
import { useTranslate } from "@/config/useTranslation";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { motion } from "framer-motion";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import InfiniteScrollSelect from "../../courts/add/InfiniteScrollSelect";
import { useParams } from "next/navigation";
import { CreateTasks } from "@/services/tasks/tasks";
import { getCasesPanigation } from "@/services/cases/cases";
import { Auth } from "@/components/auth/Auth";
import { getStaffPanigation } from "@/services/staff/staff";

const Importance_Level: { id: string; value: string; label: string }[] = [
  { id: "high", value: "high", label: "مهمة جدا" },
  { id: "mid", value: "mid", label: "متوسطة الاهمية" },
  { id: "low", value: "low", label: "ذات اهمية ضعيفة" },
];

interface LawyerData {
  titleEn: string;
  titleAr: string;
  detailsEn: string;
  detailsAr: string;
  lawyer_id: string;
  importance_level: any;
  law_suit_id: string;
}
interface ErrorResponse {
  errors: {
    [key: string]: string[];
  };
}
const page = () => {
  const { t } = useTranslate();
  const { lang } = useParams();
  const [loading, setIsloading] = useState(true); // State to control dialog visibility
  const [lawyerData, setLawyerData] = useState<LawyerData>({
    titleEn: "",
    titleAr: "",
    detailsEn: "",
    detailsAr: "",
    lawyer_id: "",
    importance_level: "",
    law_suit_id: "",
  });
  const [dates, setDates] = useState({
    due_date: "",
  });
  const handleSelectChange = (value: any) => {
    setLawyerData((prevData) => ({
      ...prevData,
      importance_level: value?.id,
    }));
  };
  const formatOption = (item: any) => ({ value: item.id, label: item.name });
  const casesFormatOption = (item: any) => ({
    value: item.id,
    label: item.title,
  });
  const fetchData = async (service: Function, page: number = 1) => {
    try {
      const data = await service(page, lang);
      return data?.body?.data || [];
    } catch (error) {
      reToast.error(`Failed to fetch data: ${error}`);

      return [];
    }
  };
  const fetchCasesData = async (service: Function, page: number = 1) => {
    try {
      const data = await service(page, lang);
      return data?.body?.data || [];
    } catch (error) {
      reToast.error(`Failed to fetch data: ${error}`);

      return [];
    }
  };
  // Handle input changes for lawyerData
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setLawyerData((prev) => ({ ...prev, [name]: value }));
  };
  const handleDateChange = (key: string, newDate: Date) => {
    const date = new Date(newDate.toISOString());

    // Extract day, month, and year
    const day = String(date.getDate()).padStart(2, "0"); // Ensures two digits
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = date.getFullYear();

    // Format as yyyy-mm-dd
    const formattedDate = `${year}-${month}-${day}`;
    setDates((prev) => ({ ...prev, [key]: formattedDate }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsloading(false);

    const data = {
      title: { en: lawyerData.titleEn, ar: lawyerData.titleAr },
      details: { en: lawyerData.detailsEn, ar: lawyerData.detailsAr },
      lawyer_id: lawyerData.lawyer_id,
      importance_level: lawyerData.importance_level,
      due_date: dates.due_date,
      law_suit_id: lawyerData.law_suit_id,
    };

    try {
      const res = await CreateTasks(data, lang); // Call API to create the lawyer
      if (res) {
        // Reset data after successful creation
        setLawyerData({
          titleEn: "",
          titleAr: "",
          detailsEn: "",
          detailsAr: "",
          lawyer_id: "",
          importance_level: "",
          law_suit_id: "",
        });
        setDates({
          due_date: "",
        });
        setIsloading(true);

        reToast.success(res.message); // Display success message
      } else {
        reToast.error(t("Failed to create Case Category")); // Show a fallback failure message
        setIsloading(true);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;

      // Construct the dynamic key based on field names and the current language
      const fields = [
        "title.en",
        "title.ar",
        "details.ar",
        "details.en",
        "lawyer_id",
        "importance_level",
        "law_suit_id",
        "due_date",
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
      setIsloading(true);
    }
  };
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle> {t("Create a New Task")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-between "
          >
            <div className="flex flex-row  flex-wrap sm:flex-nowrap justify-between items-center  gap-4">
              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col gap-2 w-full sm:w-[48%]"
              >
                <Label htmlFor="Name">{t("Task Name In English")}</Label>
                <Input
                  type="text"
                  placeholder={t("Enter Task Name In English")}
                  name="titleEn"
                  value={lawyerData.titleEn}
                  onChange={handleInputChange}
                />
              </motion.div>
              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col gap-2 w-full sm:w-[48%]"
              >
                <Label htmlFor="Name">{t("Task Name In Arabic")}</Label>
                <Input
                  type="text"
                  placeholder={t("Enter Task Name In Arabic")}
                  value={lawyerData.titleAr}
                  name="titleAr"
                  onChange={handleInputChange}
                />
              </motion.div>
              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 0.7 }}
                className="flex flex-col gap-2 w-full sm:w-[48%]"
              >
                <Label htmlFor="Importance_Level">
                  {t("Importance Level")}
                </Label>

                <BasicSelect
                  menu={Importance_Level}
                  setSelectedValue={(value) => handleSelectChange(value)}
                  selectedValue={lawyerData["importance_level"]}
                />
              </motion.div>

              <div className="flex flex-col gap-2 w-full sm:w-[48%]">
                <motion.div
                  initial={{ y: -50 }}
                  whileInView={{ y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="flex flex-row justify-between items-center"
                >
                  <div className="!w-[85%]" style={{ width: "85%" }}>
                    <Label htmlFor="Assigned_To">{t("Assigned To")}</Label>
                    <InfiniteScrollSelect
                      fetchData={() => fetchData(getStaffPanigation)}
                      formatOption={formatOption}
                      placeholder={t("Select Staff")}
                      selectedValue={lawyerData.lawyer_id}
                      setSelectedValue={(value) =>
                        setLawyerData((prev) => ({
                          ...prev,
                          lawyer_id: value?.value || "",
                        }))
                      }
                    />{" "}
                  </div>
                  <Link href={"/staff"} className="w-[10%] mt-5">
                    <Icon
                      icon="gg:add"
                      width="24"
                      height="24"
                      color="#dfc77d"
                    />
                  </Link>
                </motion.div>
              </div>
              <div className="flex flex-col gap-2 w-full sm:w-[48%]">
                <motion.div
                  initial={{ y: -50 }}
                  whileInView={{ y: 0 }}
                  transition={{ duration: 0.9 }}
                  className="flex flex-row justify-between items-center"
                >
                  <div className="!w-[85%]" style={{ width: "85%" }}>
                    <Label htmlFor="Case_Name">{t("Casess")}</Label>
                    <InfiniteScrollSelect
                      fetchData={() => fetchCasesData(getCasesPanigation)}
                      formatOption={casesFormatOption}
                      placeholder={t("Select Case")}
                      selectedValue={lawyerData.law_suit_id}
                      setSelectedValue={(value) =>
                        setLawyerData((prev) => ({
                          ...prev,
                          law_suit_id: value?.value || "",
                        }))
                      }
                    />{" "}
                  </div>
                  <Link href={"/case"} className="w-[10%] mt-5">
                    <Icon
                      icon="gg:add"
                      width="24"
                      height="24"
                      color="#dfc77d"
                    />
                  </Link>
                </motion.div>
              </div>
              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1 }}
                className="flex flex-col gap-2 w-full sm:w-[48%]"
              >
                <Label htmlFor="Case_Name">{t("Due Date")}</Label>
                <Flatpickr
                  className="w-full bg-background border border-default-200 focus:border-primary focus:outline-none h-10 rounded-md px-2 placeholder:text-default-600"
                  placeholder={t("Enter Due Date")}
                  value={dates.due_date}
                  onChange={([date]) => handleDateChange("due_date", date)}
                  onBlur={(e) => e.preventDefault()}
                />{" "}
              </motion.div>
            </div>
            <motion.div
              initial={{ y: -50 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 1.1 }}
            >
              {" "}
              <div className="flex flex-col gap-2 w-full  my-4">
                <Label>{t("Details In English")}</Label>
                <Textarea
                  placeholder={t("Type Here")}
                  rows={7}
                  name="detailsEn"
                  value={lawyerData.detailsEn}
                  onChange={handleInputChange}
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ y: -50 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 1.1 }}
            >
              {" "}
              <div className="flex flex-col gap-2 w-full  my-4">
                <Label>{t("Details In Arabic")}</Label>
                <Textarea
                  placeholder={t("Type Here")}
                  rows={7}
                  name="detailsAr"
                  value={lawyerData.detailsAr}
                  onChange={handleInputChange}
                />
              </div>
            </motion.div>
            {/* Submit Button inside form */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
              className="flex justify-center gap-3 mt-4"
            >
              <Button
                type="button"
                className="w-28 border-[#dfc77d] hover:!bg-[#dfc77d] hover:!border-[#dfc77d] !text-black"
                variant="outline"
              >
                {t("Cancel")}
              </Button>
              <Button
                type="submit"
                disabled={!loading}
                className="w-28 !bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
              >
                {!loading ? t("Loading") : t("Create Task")}
              </Button>
            </motion.div>
          </form>{" "}
        </CardContent>
      </Card>
    </div>
  );
};

const allowedRoles = ["super_admin", "admin"];

const ProtectedComponent = Auth({ allowedRoles })(page);

export default ProtectedComponent;
