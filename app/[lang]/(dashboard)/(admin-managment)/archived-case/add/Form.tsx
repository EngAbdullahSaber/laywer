"use client";
import React, { useState, useEffect, useCallback } from "react";
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
import { useParams, useRouter } from "next/navigation";
import SelectCase from "./SelectCase";
import { CreateCases, getCases } from "@/services/cases/cases";
import { getCategory } from "@/services/category/category";
import BasicSelect from "@/components/common/Select/BasicSelect";
import { RemoveImage, UploadImage } from "@/services/auth/auth";
import { AxiosError } from "axios";
import { CreateArchievedCases } from "@/services/archieved-cases/archieved-cases";
import FileUploaderMultiple from "../../clients/add/FileUploaderSingle";

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
  const { lang } = useParams();
  const router = useRouter();

  // State declarations
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

  const [images, setImages] = useState<{ files: any[] }>({ files: [] });
  const [selectedValue, setSelectedValue] = useState<any[]>([]);
  const [selectedValue1, setSelectedValue1] = useState<any[]>([]);
  const [numbers, setNumbers] = useState<any[]>([]);
  const [caseYears, setCaseYears] = useState<any[]>([]);
  const [secondaryCaseNumber, setSecondaryCaseNumber] = useState<number>(1);
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [flag, setFlag] = useState(true);
  const [category, setCategory] = useState<any[]>([]);
  const [caseNumbers, setCaseNumbers] = useState<any[]>([]);
  const [loading1, setLoading1] = useState(true);

  const [oppositeParties, setOppositeParties] = useState<string[]>([""]);
  const [dates, setDates] = useState({
    receive_date: "",
    submissionDate: "",
    judgmentDate: "",
    hearingDate: "",
  });
  const [fileIds, setFileIds] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  // Constants
  const Case_Status = [
    { value: "claimant", id: "claimant", label: "مدعي" },
    { value: "appellant", id: "appellant", label: " مدعي عليه" },
    { value: "defendant", id: "defendant", label: "مستأنف" },
    { value: "respondent", id: "respondent", label: "مستأنف ضده" },
    { value: "executor", id: "executor", label: "منفذ" },
    { value: "judgment_debtor", id: "judgment_debtor", label: "منفذ ضده" },
  ];

  const charcter = Array.from({ length: 26 }, (_, i) => ({
    value: String.fromCharCode(65 + i),
    label: String.fromCharCode(65 + i),
  }));

  // Memoized functions to prevent unnecessary re-renders

  const getCasesData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCases(lang);
      const id = res?.body?.data?.[0]?.id;
      const caseId = id ? String(id).padStart(4, "0") : "0001";
      setData(Number(caseId));
      setNumbers([caseId]);
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  }, [lang]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setLawyerData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleFilesChange = async (files: File[], fileType: string) => {
    setIsUploading(true);

    try {
      // Upload each file sequentially to avoid overloading the server
      const newFileIds: string[] = [];

      for (const file of files) {
        const formData = new FormData();
        formData.append("image", file);

        const res = await UploadImage(formData, lang);
        if (res && res.body && res.body.image_id) {
          newFileIds.push(res.body.image_id);
          reToast.success(`${file.name} uploaded successfully`);
        } else {
          reToast.error(`Failed to upload ${file.name}`);
        }
      }

      setFileIds((prev) => [...prev, ...newFileIds]);
    } catch (error) {
      console.error("Error uploading files:", error);
      reToast.error(t("Failed to upload files"));
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileRemove = async (fileId: string, fileType: string) => {
    try {
      await RemoveImage(fileId, lang);
      setFileIds((prev) => prev.filter((id) => id !== fileId));
    } catch (error) {
      console.error("Error removing file:", error);
      throw error; // Re-throw to be handled by the component
    }
  };

  const handleDateChange = useCallback((key: string, newDate: Date) => {
    const date = new Date(newDate.toISOString());
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const formattedDate = `${year}-${month}-${day}`;
    setDates((prev) => ({ ...prev, [key]: formattedDate }));
  }, []);

  const handleCaseYearChange = useCallback((index: number, value: string) => {
    setCaseYears((prev) => {
      const updatedYears = [...prev];
      updatedYears[index] = value;
      return updatedYears;
    });
  }, []);

  const handleOppositePartyChange = useCallback(
    (index: number, value: string) => {
      setOppositeParties((prev) => {
        const newParties = [...prev];
        newParties[index] = value;
        return newParties;
      });
    },
    []
  );

  const addOppositePartyField = useCallback(() => {
    setOppositeParties((prev) => [...prev, ""]);
  }, []);

  const removeOppositePartyField = useCallback(
    (index: number) => {
      if (oppositeParties.length > 1) {
        setOppositeParties((prev) => prev.filter((_, i) => i !== index));
      }
    },
    [oppositeParties.length]
  );

  const handleIncrement = useCallback(
    (index: number) => {
      setSecondaryCaseNumber((prev) => prev + 1);
      setNumbers((prev) => {
        const updatedNumbers = [...prev];
        const newNumber = data + index;
        updatedNumbers[index + 1] =
          newNumber < 10
            ? "000" + newNumber
            : newNumber < 100
            ? "00" + newNumber
            : newNumber < 1000
            ? "0" + newNumber
            : newNumber;
        return updatedNumbers;
      });
    },
    [data]
  );

  const handleDecrement = useCallback((index: number) => {
    setSecondaryCaseNumber((prev) => prev - 1);
    setNumbers((prev) => {
      const updatedNumbers = [...prev];
      updatedNumbers.pop();
      return updatedNumbers;
    });
  }, []);

  const handleSelectChanges = useCallback((value: any) => {
    setLawyerData((prevData) => ({
      ...prevData,
      claim_status: value?.id,
    }));
  }, []);

  // Effects
  useEffect(() => {
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
  }, [selectedValue, selectedValue1, caseYears, numbers]);

  useEffect(() => {
    getCasesData();
  }, [getCasesData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading1(false);

    const formData = new FormData();

    // Append form data
    Object.entries(lawyerData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    fileIds.forEach((fileId, index) => {
      formData.append(`files[${index}]`, fileId);
    });
    oppositeParties.forEach((fileId, index) => {
      formData.append(`defendants[${index}]`, fileId);
    });

    formData.append(`receive_date`, dates.receive_date);
    formData.append(`session_date`, dates.hearingDate);
    formData.append(`judgment_date`, dates.judgmentDate);
    formData.append(`submit_date`, dates.submissionDate);

    caseNumbers.forEach((caseNumber, index) => {
      formData.append(
        `case_numbers[${index}][first_letter]`,
        caseNumber.first_letter.value.toLowerCase()
      );
      formData.append(
        `case_numbers[${index}][second_letter]`,
        caseNumber.second_letter.value.toLowerCase()
      );
      formData.append(
        `case_numbers[${index}][case_year]`,
        caseNumber.case_year
      );
      formData.append(
        `case_numbers[${index}][case_number_id]`,
        caseNumber.second_letter.value.toLowerCase() +
          caseNumber.first_letter.value.toLowerCase() +
          caseNumber.case_year.slice(-2) +
          caseNumber.case_number_id
      );
    });

    try {
      const res = await CreateArchievedCases(formData, lang);
      if (res) {
        setLawyerData({
          client_name: "",
          court_name: "",
          lawyer_name: "",
          title: "",
          main_case_number: "",
          details: "",
          claim_status: "",
          category: "",
        });
        reToast.success(res.message);
        router.back();
      } else {
        reToast.error(t("Failed to create Case Category"));
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      const fields = [
        "client_name",
        "court_name",
        "category",
        "title",
        "lawyer_name",
        "case_numbers",
        "main_case_number",
        "files",
        "judgment_date",
        "submit_date",
        "session_date",
        "receive_date",
        "claim_status",
        "details",
        "defendants",
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
    } finally {
      setLoading1(true);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{t("Create a New Archieved Case")}</CardTitle>
        </CardHeader>
        <CardContent className="py-2">
          <div>
            {/* Case Info Section */}
            <motion.p
              initial={{ y: -30 }}
              viewport={{ once: true }}
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
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="my-4 font-bold"
            >
              {t("Case Numbers")}
            </motion.p>
            <div className="flex flex-row flex-wrap sm:flex-nowrap justify-between items-center gap-4">
              <motion.div
                initial={{ y: -30 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9 }}
                className="flex flex-col gap-2 my-2 w-full md:w-[48%]"
              >
                <Label htmlFor="MainCaseNumber">{t("Case Number")}</Label>
                <Input
                  type="number"
                  value={lawyerData.main_case_number}
                  placeholder={t("Enter Case Number")}
                  name="main_case_number"
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
                            updatedValues[index] = value;
                            setSelectedValue(updatedValues);
                          }}
                          selectedValue={selectedValue[index] || []}
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
                            updatedValues1[index] = value;
                            setSelectedValue1(updatedValues1);
                          }}
                          selectedValue={selectedValue1[index] || []}
                          index={index}
                        />
                      </div>
                      <div className="w-full sm:w-[31%]">
                        <Label>{t("Year of Case")}</Label>
                        <Input
                          type="number"
                          placeholder={t("Enter Year of Case")}
                          value={caseYears[index] || ""}
                          onChange={(e) =>
                            handleCaseYearChange(index, e.target.value)
                          }
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
                      {selectedValue[index]?.value}
                      {selectedValue1[index]?.value}
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
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="my-4 font-bold"
            >
              {t("Upload Files")}
            </motion.p>
            <motion.div
              initial={{ y: -30 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4 }}
              className="flex flex-col gap-2 w-full"
            >
              <FileUploaderMultiple
                fileType="case_files"
                fileIds={fileIds}
                setFileIds={setFileIds}
                maxFiles={15}
                maxSizeMB={200}
                compressImages={true}
                compressionOptions={{
                  maxSizeMB: 1,
                  maxWidthOrHeight: 1920,
                  quality: 0.8,
                }}
              />
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
              viewport={{ once: true }}
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
                  viewport={{ once: true }}
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
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="my-4 font-bold"
            >
              {t("Data of Status")}
            </motion.p>
            <div className="flex flex-row flex-wrap sm:flex-nowrap justify-between items-center">
              <motion.div
                initial={{ y: -30 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="flex flex-col gap-2 my-2 w-full sm:w-[48%]"
              >
                <Label htmlFor="category">{t("Status")}</Label>

                <BasicSelect
                  menu={Case_Status}
                  setSelectedValue={handleSelectChanges}
                  selectedValue={lawyerData["claim_status"]}
                />
              </motion.div>
              <div className="flex flex-col gap-2 my-2 w-full sm:w-[48%]">
                <motion.div
                  initial={{ y: -30 }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true }}
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
              viewport={{ once: true }}
              transition={{ duration: 1.2 }}
              className="my-4 font-bold"
            >
              {t("Descriptions")}
            </motion.p>
            <div className="grid grid-cols-1 lg:grid-cols-1 my-4 gap-4">
              <motion.div
                initial={{ y: -30 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 2 }}
                className="flex flex-col gap-2 my-2"
              >
                <Label htmlFor="CaseDescription">{t("Case Description")}</Label>
                <Textarea
                  placeholder={t("Type Here")}
                  rows={7}
                  name="details"
                  value={lawyerData.details}
                  onChange={handleInputChange}
                />
              </motion.div>
            </div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex justify-center gap-3 mt-4"
            >
              <Button
                type="button"
                disabled={!loading1}
                onClick={handleSubmit}
                className="w-36 !bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
              >
                {!loading1 ? t("Loading") : t("Create Archieved Case")}
              </Button>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Form;
