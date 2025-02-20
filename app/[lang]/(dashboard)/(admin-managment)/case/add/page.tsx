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
import FileUploaderMultiple from "../../../(lawyer-managment)/lawyer-cases/FileUploaderSingle";
import { getCourtsPanigation } from "@/services/courts/courts";
import { getClientsPanigation } from "@/services/clients/clients";
import { getLawyerPanigation } from "@/services/lawyer/lawyer";
import { useParams } from "next/navigation";
import InfiniteScrollSelect from "../../courts/add/InfiniteScrollSelect";
import SelectCase from "./SelectCase";
import { getCategoryPanigation } from "@/services/category/category";
import { getCases } from "@/services/cases/cases";

interface LawyerData {
  client_id: string;
  court_id: string;
  lawyer_id: string;
  caseName: string;
  MainCaseNumber: string;
  description: string;
  claim_status: string;
  category_id: string;
}

const Page = () => {
  const { t } = useTranslate();
  const { lang } = useParams();
  const [lawyerData, setLawyerData] = useState<LawyerData>({
    client_id: "",
    court_id: "",
    lawyer_id: "",
    caseName: "",
    MainCaseNumber: "",
    description: "",
    claim_status: "",
    category_id: "",
  });
  const [selectedValue, setSelectedValue] = useState<any[]>([]); // Store an array for first character selections
  const [selectedValue1, setSelectedValue1] = useState<any[]>([]); // Store an array for second character selections
  const [numbers, setNumbers] = useState<any[]>([]); // Store the formatted case numbers
  const [caseYears, setCaseYears] = useState<any[]>([]); // Store years for multiple cases
  const [secondaryCaseNumber, setSecondaryCaseNumber] = useState<number>(1);
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  const [oppositeParties, setOppositeParties] = useState<string[]>([""]);
  const [dates, setDates] = useState<Record<string, Date>>({
    receiptDate: new Date(),
    submissionDate: new Date(),
    judgmentDate: new Date(),
    hearingDate: new Date(),
  });
  // Function to format numbers
  const updateNumbers = (index: number) => {
    const formattedValue =
      data + index < 10
        ? "000" + (data + index)
        : data + index < 100
        ? "00" + (data + index)
        : data + index < 1000
        ? "0" + (data + index)
        : data + index;

    const updatedNumbers = [...numbers]; // Copy current numbers state
    updatedNumbers[index] = formattedValue; // Update the specific index with the formatted value
    console.log(formattedValue);

    setNumbers(updatedNumbers); // Set the updated numbers array
    return formattedValue; // Return the formatted value for rendering
  };
  console.log(numbers);
  updateNumbers(1);
  const getCasesData = async () => {
    setLoading(true);

    try {
      const res = await getCases(lang);

      // Convert the ID to a string, pad it with leading zeros, and default to '0000'
      const caseId = String(res?.body[0].id).padStart(4, "0") || "0000";

      setData(Number(caseId)); // Set the padded case ID
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

  const formatOption = (item: any) => ({ value: item.id, label: item.name });
  useEffect(() => {
    getCasesData();
  }, []);
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{t("Create a New Case")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form>
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
                  <Link href="/clients" className="w-[8%] mt-5">
                    <Icon
                      icon="gg:add"
                      width="24"
                      height="24"
                      color="#dfc77d"
                    />
                  </Link>
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
                  <Link href="/courts" className="w-[8%] mt-5">
                    <Icon
                      icon="gg:add"
                      width="24"
                      height="24"
                      color="#dfc77d"
                    />
                  </Link>
                </motion.div>
              </div>
              {/* <div className="flex flex-col gap-2 my-2 w-full sm:w-[48%]">
                <motion.div
                  initial={{ y: -30 }}
                  whileInView={{ y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="flex flex-row justify-between items-center"
                >
                  <div className="!w-[87%]">
                    <Label htmlFor="Category">{t("Case Category")}</Label>
                    <InfiniteScrollSelect
                      fetchData={() =>
                        fetchData(getCategoryPanigation("cases"))
                      }
                      formatOption={formatOption}
                      placeholder={t("Select Case Category")}
                      selectedValue={lawyerData.category_id}
                      setSelectedValue={(value) =>
                        setLawyerData((prev) => ({
                          ...prev,
                          category_id: value?.value || "",
                        }))
                      }
                    />
                  </div>
                  <Link href="/courts" className="w-[8%] mt-5">
                    <Icon
                      icon="gg:add"
                      width="24"
                      height="24"
                      color="#dfc77d"
                    />
                  </Link>
                </motion.div>
              </div> */}
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
                  name="caseName"
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
                <Link href="/lawyer" className="w-[8%] mt-5">
                  <Icon icon="gg:add" width="24" height="24" color="#dfc77d" />
                </Link>
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
                      {/* {updateNumbers(index)} */}
                    </motion.p>
                  </div>
                  {secondaryCaseNumber > 1 &&
                    index !== secondaryCaseNumber - 1 && (
                      <div
                        className="mt-6 w-[3%]"
                        onClick={() =>
                          setSecondaryCaseNumber(secondaryCaseNumber - 1)
                        }
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
                      onClick={() =>
                        setSecondaryCaseNumber(secondaryCaseNumber + 1)
                      }
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
                  name="MainCaseNumber"
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
                <FileUploaderMultiple />
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
                <RadioRight
                  text1="claimant"
                  text2="defendant"
                  setValue={setLawyerData}
                  claim_status={lawyerData.claim_status}
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
                  name="description"
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
                type="submit"
                className="w-28 !bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
              >
                {t("Create Case")}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
