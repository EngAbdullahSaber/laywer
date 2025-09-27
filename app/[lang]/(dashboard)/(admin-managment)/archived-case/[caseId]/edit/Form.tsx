"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast as reToast } from "react-hot-toast";
import Flatpickr from "react-flatpickr";
import { useTranslate } from "@/config/useTranslation";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FileUploaderSingle from "./FileUploaderSingle";
import { useParams, useRouter } from "next/navigation";
import SelectCase from "./SelectCase";
import BasicSelect from "@/components/common/Select/BasicSelect";
import { UploadImage } from "@/services/auth/auth";
import { AxiosError } from "axios";
import {
  getSpecifiedArchievedCases,
  UpdateArchievedCases,
} from "@/services/archieved-cases/archieved-cases";

interface LawyerData {
  client_name: string;
  court_name: string;
  lawyer_name: string;
  title: string;
  main_case_number: string;
  details: string;
  claim_status: string;
  category: string;
}
interface ErrorResponse {
  errors: {
    [key: string]: string[];
  };
}
const Form = () => {
  const { t } = useTranslate();
  const { lang, caseId } = useParams();
  const [lawyerData, setLawyerData] = useState<LawyerData>({
    client_name: "",
    court_name: "",
    lawyer_name: "",
    title: "",
    main_case_number: "",
    details: "",
    claim_status: "",
    category: "",
  });
  const [images, setImages] = useState<{
    files: any; // Array of file IDs instead of a single file ID
  }>({
    files: [],
  });
  const router = useRouter(); // ✅ initialize router

  const Case_Status: { value: string; id: string; label: string }[] = [
    { value: "claimant", id: "claimant", label: "مدعي" },
    { value: "appellant", id: "appellant", label: " مدعي عليه" },
    { value: "defendant", id: "defendant", label: "مستأنف" },
    { value: "respondent", id: "respondent", label: "مستأنف ضده" },
    { value: "executor", id: "executor", label: "منفذ" },
    { value: "judgment_debtor", id: "judgment_debtor", label: "منفذ ضده" },
  ];

  const [flag, setFlag] = useState(true);
  const [loading1, setLoading1] = useState(true);
  const [oppositeParties, setOppositeParties] = useState<string[]>([""]);

  const [dates, setDates] = useState({
    receive_date: "",
    submissionDate: "",
    judgmentDate: "",
    hearingDate: "",
  });

  const charcter = Array.from({ length: 26 }, (_, i) => ({
    value: String.fromCharCode(65 + i),
    label: String.fromCharCode(65 + i),
  }));

  // Handle input changes for lawyerData
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setLawyerData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSelectChanges = (value: any) => {
    setLawyerData((prevData) => ({
      ...prevData,
      claim_status: value?.id,
    }));
  };
  const handleImageChange = async (
    file: File,
    imageType: keyof typeof images
  ) => {
    setLoading1(false);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await UploadImage(formData, lang); // Call API to upload the image
      if (res) {
        // Append the image ID to the array of file IDs
        setImages((prevState) => ({
          ...prevState,
          files: [...prevState.files, res.body.image_id],
        }));
        setLoading1(true);

        reToast.success(res.message); // Show success toast
      } else {
        reToast.error(t("Failed to upload image")); // Show failure toast
        setLoading1(true);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      let errorMessage = "Something went wrong."; // Default fallback message
      reToast.error(errorMessage); // Show error toast
      setLoading1(true);
    }
  };
  // Handle date changes
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

  // Handle opposite party input changes
  const handleOppositePartyChange = (index: number, value: string) => {
    const newParties = [...oppositeParties];
    newParties[index] = value;
    setOppositeParties(newParties);
  };

  // Add a new opposite party input field
  const addOppositePartyField = () => {
    setOppositeParties([...oppositeParties, ""]);
  };

  // Remove an opposite party input field
  const removeOppositePartyField = (index: number) => {
    if (oppositeParties.length > 1) {
      const newParties = oppositeParties.filter((_, i) => i !== index);
      setOppositeParties(newParties);
    }
  };

  const getLawyerData = async () => {
    try {
      const res = await getSpecifiedArchievedCases(lang, caseId);
      if (res?.body) {
        const lawyer = res.body;
        setLawyerData({
          category: lawyer?.category,
          claim_status: lawyer?.claim_status,
          details: lawyer?.details,
          main_case_number: lawyer?.main_case_number,
          title: lawyer?.title,
          lawyer_name: lawyer?.lawyer_name,
          court_name: lawyer?.court_name,
          client_name: lawyer?.client_name,
        });
        setDates({
          receive_date: lawyer?.receive_date,
          submissionDate: lawyer?.submit_date,
          judgmentDate: lawyer?.judgment_date,
          hearingDate: lawyer?.session_date,
        });
        setOppositeParties(lawyer?.defendants);

        setImages({
          files: lawyer.files,
        });
      }
    } catch (error) {
      console.error("Error fetching lawyer data", error);
    }
  };

  useEffect(() => {
    getLawyerData();
  }, [flag]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading1(false);
    const toYMD = (date) => new Date(date).toISOString().split("T")[0];

    // Prepare the request data in the correct format
    const requestData = {
      title: lawyerData?.title,
      client_name: lawyerData?.client_name,
      lawyer_name: lawyerData?.lawyer_name,
      court_name: lawyerData?.court_name,

      claim_status: lawyerData?.claim_status,
      main_case_number: lawyerData?.main_case_number,
      receive_date: toYMD(dates?.receive_date),
      submit_date: toYMD(dates?.submissionDate),
      judgment_date: toYMD(dates?.judgmentDate),
      session_date: toYMD(dates?.hearingDate),
      details: lawyerData?.details,
      categorcategoryy_id: lawyerData?.category,
      defendants: oppositeParties,
      files: images?.files.map((file) => file?.image_id), // Assuming files is an array of objects with image_id
      follow_up_reports: [], // Add your follow up reports if needed
      attendance_reports: [], // Add your attendance reports if needed
    };

    try {
      const res = await UpdateArchievedCases(requestData, caseId, lang);
      if (res) {
        setLoading1(true);
        reToast.success(res.message);
        router.back();
      } else {
        reToast.error(t("Failed to update Case"));
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      let errorMessage = "Something went wrong.";

      // Handle specific field errors
      const fields = [
        "title",
        "client_name",
        "lawyer_name",
        "court_name",
        "case_numbers",
        "claim_status",
        "main_case_number",
        "receive_date",
        "submit_date",
        "judgment_date",
        "session_date",
        "details",
        "category",
        "defendants",
        "files",
        "follow_up_reports",
        "attendance_reports",
      ];

      for (let field of fields) {
        const fieldErrorKey = `${field}`;
        const error = axiosError.response?.data?.errors?.[fieldErrorKey];
        if (error) {
          errorMessage = error[0];
          break;
        }
      }

      reToast.error(errorMessage);
      setLoading1(true);
    }
  };
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{t("Update Case")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            {/* Case Info Section */}
            <motion.p
              initial={{ y: -30 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 1.2 }}
              className="my-4 font-bold"
            >
              {t("Case Info")}
            </motion.p>
            <div className="flex flex-row flex-wrap sm:flex-nowrap justify-between items-center gap-4">
              {/* Client Selection */}
              <motion.div
                initial={{ y: -30 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9 }}
                className="flex flex-col gap-2 my-2 w-full sm:w-[48%]"
              >
                <Label htmlFor="client_name">{t("Client Name")}</Label>
                <Input
                  type="text"
                  placeholder={t("Enter Client Name")}
                  name="client_name"
                  value={lawyerData.client_name}
                  onChange={handleInputChange}
                />
              </motion.div>

              {/* Court Selection */}
              <motion.div
                initial={{ y: -30 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9 }}
                className="flex flex-col gap-2 my-2 w-full sm:w-[48%]"
              >
                <Label htmlFor="court_name">{t("Court Name")}</Label>
                <Input
                  type="text"
                  placeholder={t("Enter Court Name")}
                  name="court_name"
                  value={lawyerData.court_name}
                  onChange={handleInputChange}
                />
              </motion.div>

              {/* category Selection */}
              <motion.div
                initial={{ y: -30 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9 }}
                className="flex flex-col gap-2 my-2 w-full sm:w-[48%]"
              >
                <Label htmlFor="category">{t("Category Name")}</Label>
                <Input
                  type="text"
                  placeholder={t("Enter Category Name")}
                  name="category"
                  value={lawyerData.category}
                  onChange={handleInputChange}
                />
              </motion.div>

              {/* Case Name */}
              <motion.div
                initial={{ y: -30 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9 }}
                className="flex flex-col gap-2 my-2 w-full sm:w-[48%]"
              >
                <Label htmlFor="title">{t("Case Name")}</Label>
                <Input
                  type="text"
                  placeholder={t("Enter Case Name")}
                  name="title"
                  value={lawyerData.title}
                  onChange={handleInputChange}
                />
              </motion.div>

              {/* Lawyer Name */}
              <motion.div
                initial={{ y: -30 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9 }}
                className="flex flex-col gap-2 my-2 w-full sm:w-[48%]"
              >
                <Label htmlFor="lawyer_name">{t("Lawyer Name")}</Label>
                <Input
                  type="text"
                  placeholder={t("Enter Lawyer Name")}
                  name="lawyer_name"
                  value={lawyerData.lawyer_name}
                  onChange={handleInputChange}
                />
              </motion.div>
            </div>

            {/* Case Numbers Section */}
            <motion.hr
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="my-3"
            />
            <motion.p
              initial={{ y: -30 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 1.2 }}
              className="my-4 font-bold"
            >
              {t("Case Numbers")}
            </motion.p>
            <div className="flex flex-row flex-wrap sm:flex-nowrap justify-between items-center gap-4">
              <motion.div
                initial={{ y: -30 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 0.9 }}
                className="flex flex-col gap-2 my-2 w-full md:w-[48%]"
              >
                <Label htmlFor="MainCaseNumber">{t("Case Number")}</Label>
                <Input
                  type="number"
                  placeholder={t("Enter Case Number")}
                  name="main_case_number"
                  value={lawyerData.main_case_number}
                  onChange={handleInputChange}
                />
              </motion.div>
            </div>

            {/* Upload Files Section */}
            <motion.hr
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.1 }}
              className="my-3"
            />
            <motion.p
              initial={{ y: -30 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 1.2 }}
              className="my-4 font-bold"
            >
              {t("Upload Files")}
            </motion.p>
            <motion.div
              initial={{ y: -30 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 1.4 }}
              className="flex flex-col gap-2 w-full"
            >
              <Label>
                <FileUploaderSingle
                  imageType="files"
                  id={images.files}
                  onFileChange={handleImageChange}
                />{" "}
              </Label>
            </motion.div>

            {/* Dates Section */}
            <motion.hr
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.1 }}
              className="my-3"
            />
            <motion.p
              initial={{ y: -30 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 1.2 }}
              className="my-4 font-bold"
            >
              {t("Dates")}
            </motion.p>
            <div className="flex flex-row justify-between flex-wrap sm:flex-nowrap items-center my-4 gap-4">
              {Object.entries(dates).map(([key, value]) => (
                <motion.div
                  key={key}
                  initial={{ y: -30 }}
                  whileInView={{ y: 0 }}
                  transition={{ duration: 1.6 }}
                  className="flex flex-col gap-2 my-2 w-full sm:w-[48%]"
                >
                  <Label htmlFor={key}>{t(key)}</Label>
                  <Flatpickr
                    className="w-full bg-background border border-default-200 focus:border-primary focus:outline-none h-10 rounded-md px-2 placeholder:text-default-600"
                    placeholder={t(`Select ${key}`)}
                    value={value}
                    onChange={([date]) => handleDateChange(key, date)}
                    onBlur={(e) => e.preventDefault()}
                  />
                </motion.div>
              ))}
            </div>

            {/* Status Section */}
            <motion.hr
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.1 }}
              className="my-3"
            />
            <motion.p
              initial={{ y: -30 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 1.2 }}
              className="my-4 font-bold"
            >
              {t("Data of Status")}
            </motion.p>
            <div className="flex flex-row flex-wrap sm:flex-nowrap justify-between items-center">
              <motion.div
                initial={{ y: -30 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1 }}
                className="flex flex-col gap-2 my-2 w-full sm:w-[48%]"
              >
                <Label htmlFor="category">{t("Status")}</Label>
                <BasicSelect
                  menu={Case_Status}
                  setSelectedValue={(value) => handleSelectChanges(value)}
                  selectedValue={lawyerData["claim_status"]}
                />
              </motion.div>
              <div className="flex flex-col gap-2 my-2 w-full sm:w-[48%]">
                <motion.div
                  initial={{ y: -30 }}
                  whileInView={{ y: 0 }}
                  transition={{ duration: 1.1 }}
                  className="flex flex-row justify-between items-center"
                >
                  {oppositeParties.map((party, index) => (
                    <div
                      key={index}
                      className="!w-[100%] flex flex-row justify-between"
                    >
                      <div
                        className={
                          oppositeParties.length === 1
                            ? "!w-[100%]"
                            : "!w-[91%]"
                        }
                      >
                        <Label htmlFor="PartyName">
                          {t("Opposing Party Name")}
                        </Label>
                        <Input
                          type="text"
                          placeholder={t("Enter Opposing Party Name")}
                          value={party}
                          onChange={(e) =>
                            handleOppositePartyChange(index, e.target.value)
                          }
                        />
                      </div>
                      {oppositeParties.length > 1 &&
                        index !== oppositeParties.length - 1 && (
                          <div
                            className="mt-6 w-[8%]"
                            onClick={() => removeOppositePartyField(index)}
                          >
                            <Icon
                              icon="material-symbols:delete"
                              width="24"
                              height="24"
                              color="#dfc77d"
                            />
                          </div>
                        )}
                      {index === oppositeParties.length - 1 && (
                        <div
                          className="mt-6 w-[8%]"
                          onClick={addOppositePartyField}
                        >
                          <Icon
                            icon="gg:add"
                            width="24"
                            height="24"
                            color="#dfc77d"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Description Section */}
            <motion.hr
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.1 }}
              className="my-3"
            />
            <motion.p
              initial={{ y: -30 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 1.2 }}
              className="my-4 font-bold"
            >
              {t("Descriptions")}
            </motion.p>
            <div className="grid grid-cols-1 lg:grid-cols-1 my-4 gap-4">
              <motion.div
                initial={{ y: -30 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 2 }}
                className="flex flex-col gap-2 my-2"
              >
                <Label htmlFor="CaseDescription">{t("Case Description")}</Label>
                <Textarea
                  placeholder={t("Type Here")}
                  rows={7}
                  value={lawyerData.details}
                  name="details"
                  onChange={handleInputChange}
                />
              </motion.div>
            </div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center gap-3 mt-4"
            >
              <Button
                type="button"
                disabled={!loading1}
                onClick={handleSubmit}
                className="w-28 !bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
              >
                {!loading1 ? t("Loading") : t("Update Case")}
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Form;
