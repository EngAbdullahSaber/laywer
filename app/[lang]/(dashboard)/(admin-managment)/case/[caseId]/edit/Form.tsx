"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast as reToast } from "react-hot-toast";
import RadioRight from "./Radio";
import Flatpickr from "react-flatpickr";
import { useTranslate } from "@/config/useTranslation";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCourtsPanigation } from "@/services/courts/courts";
import { getClientsPanigation } from "@/services/clients/clients";
import { getLawyerPanigation } from "@/services/lawyer/lawyer";
import { useParams, useRouter } from "next/navigation";
import InfiniteScrollSelect from "../../../courts/add/InfiniteScrollSelect";
import SelectCase from "./SelectCase";
import {
  CreateCases,
  getCases,
  getSpecifiedCases,
  UpdateCases,
} from "@/services/cases/cases";
import { getCategory } from "@/services/category/category";
import BasicSelect from "@/components/common/Select/BasicSelect";
import CreateCaseCategory from "../../../../(category-mangement)/cases-category/CreateCaseCategory";
import { UploadImage } from "@/services/auth/auth";
import { AxiosError } from "axios";
import { Auth } from "@/components/auth/Auth";
import { getAllRoles } from "@/services/permissionsAndRoles/permissionsAndRoles";
import FileUploaderMultiple from "../../../clients/[clientsId]/edit/FileUploaderMultiple";

interface LawyerData {
  client_id: string;
  court_id: string;
  lawyer_id: string;
  title: string;
  main_case_number: string;
  details: string;
  claim_status: string;
  category_id: string;
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
    client_id: "",
    court_id: "",
    lawyer_id: "",
    title: "",
    main_case_number: "",
    details: "",
    claim_status: "",
    category_id: "",
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
  const [selectedValue, setSelectedValue] = useState<any[]>([]); // Store an array for first character selections
  const [selectedValue1, setSelectedValue1] = useState<any[]>([]); // Store an array for second character selections
  const [numbers, setNumbers] = useState<any[]>([]); // Store the formatted case numbers
  const [caseYears, setCaseYears] = useState<any[]>([]); // Store years for multiple cases
  const [secondaryCaseNumber, setSecondaryCaseNumber] = useState<number>(1);
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [flag, setFlag] = useState(true);
  const [category, setCategory] = useState<any[]>([]);
  const [caseNumbers, setCaseNumbers] = useState<any[]>([]); // Store the final case numbers structure
  const [loading1, setLoading1] = useState(true);
  const [oppositeParties, setOppositeParties] = useState<string[]>([""]);
  const [allowedRoles, setAllowedRoles] = useState<string[] | null>(null);
  const [fileIds, setFileIds] = useState<number[]>([]);
  const [existingFiles, setExistingFiles] = useState<any[]>([]);

  const [dates, setDates] = useState({
    receive_date: "",
    submissionDate: "",
    judgmentDate: "",
    hearingDate: "",
  });

  const getCasesData = async () => {
    setLoading(true);

    try {
      const res = await getCases(lang);

      // Convert the ID to a string, pad it with leading zeros, and default to '0000'
      String(res?.body[res?.body?.data?.length - 1].id).padStart(4, "0") ||
        "0000";

      setData(Number(caseId)); // Set the padded case ID
      setNumbers([caseId]); // Set the padded case ID
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);

      setLoading(false);
    }
  };
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

  const handleCaseYearChange = (index: number, value: string) => {
    const updatedYears = [...caseYears];
    updatedYears[index] = value; // Update the year at the specific index
    setCaseYears(updatedYears);
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

  // Fetch data for infinite scroll select components
  const fetchData = async (service: Function, page: number = 1) => {
    try {
      const data = await service(page, lang);
      return data?.body?.data || [];
    } catch (error) {
      reToast.error(`Failed to fetch data: ${error}`);

      return [];
    }
  };
  const handleIncrement = (index: number) => {
    setSecondaryCaseNumber(secondaryCaseNumber + 1);
    const updatedNumbers = [...numbers];
    updatedNumbers[index + 1] =
      data + index < 10
        ? "000" + (data + index + 1)
        : data + index < 100
        ? "00" + (data + index + 1)
        : data + index < 1000
        ? "0" + (data + index + 1)
        : data + index; // Increment the number at the specific index

    setNumbers(updatedNumbers);
  };

  const handleDecrement = (index: number) => {
    setSecondaryCaseNumber(secondaryCaseNumber - 1);
    const updatedNumbers = [...numbers];

    // Remove the last element from the array
    updatedNumbers.pop(); // This removes the last element

    // Update the state with the new array
    setNumbers(updatedNumbers);
  };
  const handleSelectChange = (value: any) => {
    setLawyerData((prevData) => ({
      ...prevData,
      category_id: value?.id,
    }));
  };

  const fetchDataCategory = async () => {
    try {
      const countriesData = await getCategory("cases", lang);
      setCategory(countriesData?.body?.data || []);
    } catch (error) {}
  };
  const transformedCategories = category.map((item) => ({
    id: item.id,
    value: item.name,
    label: item.name,
  }));

  const getLawyerData = async () => {
    try {
      const res = await getSpecifiedCases(lang, caseId);
      if (res?.body) {
        const lawyer = res.body;
        setLawyerData({
          category_id: lawyer.category?.id,
          claim_status: lawyer.claim_status,
          details: lawyer.details,
          main_case_number: lawyer.main_case_number,
          title: lawyer.title,
          lawyer_id: lawyer.lawyer?.id,
          court_id: lawyer.court?.id,
          client_id: lawyer.client?.id,
        });
        setDates({
          receive_date: lawyer.receive_date,
          submissionDate: lawyer.submit_date,
          judgmentDate: lawyer.judgment_date,
          hearingDate: lawyer.session_date,
        });
        setOppositeParties(lawyer.defendants);
        setCaseNumbers(lawyer.case_numbers);
        const caseNumbers = lawyer.case_numbers.map(
          (item: any) => item.case_number_id
        );
        setNumbers(caseNumbers);
        const secondLetters = lawyer.case_numbers.map(
          (item: any) => item.second_letter
        );
        setSelectedValue1(secondLetters);
        const firstLetters = lawyer.case_numbers.map(
          (item: any) => item.first_letter
        );
        setSelectedValue(firstLetters);
        const years = lawyer.case_numbers.map((item: any) => item.case_year);

        setExistingFiles(lawyer.files);
      }
    } catch (error) {
      console.error("Error fetching lawyer data", error);
    }
  };
  useEffect(() => {
    // Make sure the arrays have the same length before combining them
    if (
      selectedValue.length === selectedValue1.length &&
      selectedValue.length === caseYears.length &&
      selectedValue.length === numbers.length
    ) {
      const combinedCaseNumbers = selectedValue.map((firstLetter, index) => ({
        first_letter: firstLetter,
        second_letter: selectedValue1[index],
        case_year: caseYears[index],
        case_number_id: numbers[index],
      }));

      setCaseNumbers(combinedCaseNumbers);
    }
  }, [selectedValue, selectedValue1, numbers, caseYears]);
  useEffect(() => {
    getLawyerData();
  }, [flag]);
  const formatOption = (item: any) => ({ value: item.id, label: item.name });
  useEffect(() => {
    fetchDataCategory();
    getCasesData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading1(false);
    const toYMD = (date) => new Date(date).toISOString().split("T")[0];
    // Prepare the request data in the correct format
    const requestData = {
      title: lawyerData?.title,
      client_id: lawyerData?.client_id,
      lawyer_id: lawyerData?.lawyer_id,
      court_id: lawyerData?.court_id,
      case_numbers: caseNumbers.map((caseNumber) => ({
        first_letter: caseNumber?.first_letter,
        second_letter: caseNumber?.second_letter,
        case_year: Number(caseNumber?.case_year),
        case_number_id: caseNumber?.case_number_id,
      })),
      claim_status: lawyerData?.claim_status,
      main_case_number: lawyerData?.main_case_number,
      receive_date: toYMD(dates?.receive_date),
      submit_date: toYMD(dates?.submissionDate),
      judgment_date: toYMD(dates?.judgmentDate),
      session_date: toYMD(dates?.hearingDate),
      details: lawyerData?.details,
      category_id: lawyerData?.category_id,
      defendants: oppositeParties,
      files: fileIds, // Assuming files is an array of objects with image_id
      follow_up_reports: [], // Add your follow up reports if needed
      attendance_reports: [], // Add your attendance reports if needed
    };

    try {
      const res = await UpdateCases(requestData, caseId, lang);
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
        "client_id",
        "lawyer_id",
        "court_id",
        "case_numbers",
        "claim_status",
        "main_case_number",
        "receive_date",
        "submit_date",
        "judgment_date",
        "session_date",
        "details",
        "category_id",
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
              <div className="flex flex-col gap-2 my-2 w-full sm:w-[48%]">
                <motion.div
                  initial={{ y: -30 }}
                  whileInView={{ y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-row justify-between items-center"
                >
                  <div className="!w-[87%]">
                    <Label htmlFor="Client">{t("Client Selection")}</Label>
                    <InfiniteScrollSelect
                      fetchData={() => fetchData(getClientsPanigation)}
                      formatOption={formatOption}
                      placeholder={t("Select Client")}
                      selectedValue={lawyerData.client_id}
                      setSelectedValue={(value) =>
                        setLawyerData((prev) => ({
                          ...prev,
                          client_id: value?.value || "",
                        }))
                      }
                    />
                  </div>
                  <a href="/clients" className="w-[8%] mt-5 flex justify-end">
                    <Icon
                      icon="gg:add"
                      width="24"
                      height="24"
                      color="#dfc77d"
                    />
                  </a>
                </motion.div>
              </div>

              {/* Court Selection */}
              <div className="flex flex-col gap-2 my-2 w-full sm:w-[48%]">
                <motion.div
                  initial={{ y: -30 }}
                  whileInView={{ y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="flex flex-row justify-between items-center"
                >
                  <div className="!w-[87%]">
                    <Label htmlFor="Court">{t("Court Selection")}</Label>
                    <InfiniteScrollSelect
                      fetchData={() => fetchData(getCourtsPanigation)}
                      formatOption={formatOption}
                      placeholder={t("Select Court")}
                      selectedValue={lawyerData.court_id}
                      setSelectedValue={(value) =>
                        setLawyerData((prev) => ({
                          ...prev,
                          court_id: value?.value || "",
                        }))
                      }
                    />
                  </div>
                  <a href="/courts" className="w-[8%] mt-5 flex justify-end">
                    <Icon
                      icon="gg:add"
                      width="24"
                      height="24"
                      color="#dfc77d"
                    />
                  </a>
                </motion.div>
              </div>
              <div className="flex flex-col gap-2 my-2 w-full sm:w-[48%]">
                <motion.div
                  initial={{ y: -30 }}
                  whileInView={{ y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="flex flex-row justify-between items-center"
                >
                  <div className="!w-[87%]">
                    <Label htmlFor="Category">{t("Case Category")}</Label>
                    <BasicSelect
                      menu={transformedCategories}
                      setSelectedValue={(value) => handleSelectChange(value)}
                      selectedValue={lawyerData["category_id"]}
                    />
                  </div>
                  <CreateCaseCategory
                    flag={flag}
                    setFlag={setFlag}
                    buttonShape={false}
                  />
                </motion.div>
              </div>
              {/* Case Name */}
              <motion.div
                initial={{ y: -30 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 0.9 }}
                className="flex flex-col gap-2 my-2 w-full sm:w-[48%]"
              >
                <Label htmlFor="Name">{t("Case Name")}</Label>
                <Input
                  type="text"
                  placeholder={t("Enter Case Name")}
                  name="title"
                  value={lawyerData.title}
                  onChange={handleInputChange}
                />
              </motion.div>

              {/* Lawyer Selection */}
              <motion.div
                initial={{ y: -30 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1.5 }}
                className="flex flex-row justify-between items-center w-full sm:w-[48%]"
              >
                <div className="!w-[87%]">
                  <Label htmlFor="category">{t("Lawyer Selection")}</Label>
                  <InfiniteScrollSelect
                    fetchData={() => fetchData(getLawyerPanigation)}
                    formatOption={formatOption}
                    placeholder={t("Select Lawyer")}
                    selectedValue={lawyerData.lawyer_id}
                    setSelectedValue={(value) =>
                      setLawyerData((prev) => ({
                        ...prev,
                        lawyer_id: value?.value || "",
                      }))
                    }
                  />
                </div>
                <a href="/lawyer" className="w-[8%] mt-5 flex justify-end">
                  <Icon icon="gg:add" width="24" height="24" color="#dfc77d" />
                </a>
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
              {Array.from({ length: secondaryCaseNumber }).map((_, index) => (
                <div
                  key={index}
                  className="w-full md:w-[48%] flex flex-row justify-between"
                >
                  <div className="!w-[85%]">
                    <div className="flex flex-col sm:flex-row flex-nowrap justify-between items-center">
                      <div className="w-full sm:w-[31%]">
                        <Label htmlFor="SecondaryCaseNumber">
                          {t("First Character")}
                        </Label>
                        <SelectCase
                          menu={charcter}
                          setSelectedValue={(value) => {
                            const updatedValues = [...selectedValue];
                            updatedValues[index] = value; // Store the selected value for the specific case
                            setSelectedValue(updatedValues);
                          }}
                          selectedValue={selectedValue[index] || []} // Pass the selected value at the specific index
                          index={index}
                        />
                      </div>
                      <div className="w-full sm:w-[31%]">
                        <Label htmlFor="SecondaryCaseNumber">
                          {t("Second Character")}
                        </Label>
                        <SelectCase
                          menu={charcter}
                          setSelectedValue={(value) => {
                            const updatedValues1 = [...selectedValue1];
                            updatedValues1[index] = value; // Store the selected value for the specific case
                            setSelectedValue1(updatedValues1);
                          }}
                          selectedValue={selectedValue1[index] || []} // Pass the selected value at the specific index
                          index={index}
                        />
                      </div>
                      <div className="w-full sm:w-[31%]">
                        <Label>{t("Year of Case")}</Label>
                        <Input
                          type="number"
                          placeholder={t("Enter Year of Case")}
                          value={caseYears[index] || ""} // Use the value of the specific case year
                          onChange={(e) =>
                            handleCaseYearChange(index, e.target.value)
                          } // Update specific case year
                        />
                      </div>
                    </div>
                  </div>
                  <div className="!w-[15%] flex flex-col items-center justify-center mt-2">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1.5 }}
                      className="mt-2 font-semibold"
                    >
                      {selectedValue1[index]?.value}
                      {selectedValue[index]?.value}
                      {caseYears[index]?.slice(-2)}
                      {numbers[index]}
                    </motion.p>
                  </div>
                  {secondaryCaseNumber > 1 &&
                    index !== secondaryCaseNumber - 1 && (
                      <div
                        className="mt-6 w-[3%]"
                        onClick={() => handleDecrement(index)}
                      >
                        <Icon
                          icon="material-symbols:delete"
                          width="24"
                          height="24"
                          color="#dfc77d"
                        />
                      </div>
                    )}
                  {index === secondaryCaseNumber - 1 && (
                    <div
                      className="mt-4 flex justify-center items-center w-[6%]"
                      onClick={() => handleIncrement(index)}
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
                <FileUploaderMultiple
                  fileType="client_files"
                  fileIds={fileIds}
                  setFileIds={setFileIds}
                  existingFiles={existingFiles}
                  maxFiles={5}
                  maxSizeMB={200}
                />
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
