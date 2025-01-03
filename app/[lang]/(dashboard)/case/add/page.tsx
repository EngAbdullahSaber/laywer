"use client";
import BasicSelect from "@/components/common/Select/BasicSelect";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Radio } from "@/components/common/atoms/Radio";
import Flatpickr from "react-flatpickr";
import { useState } from "react";
import { useTranslate } from "@/config/useTranslation";
import { Upload } from "lucide-react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { motion } from "framer-motion";

const schema = z.object({
  Name: z
    .string()
    .min(3, { message: "errorCase.CasenameMin" })
    .max(20, { message: "errorCase.CasenameMax" }),
  PartyName: z
    .string()
    .min(3, { message: "errorCase.PartynameMin" })
    .max(20, { message: "errorCase.PartynameMax" }),
  LawyerName: z
    .string()
    .min(3, { message: "errorCase.LawyernameMin" })
    .max(20, { message: "errorCase.LawyernameMax" }),
  CaseDescription: z
    .string()
    .min(3, { message: "errorCase.CaseDescriptionMin" })
    .max(20, {
      message: "errorCase.CaseDescriptionMax",
    }),
  SecondaryCaseNumber: z
    .string()
    .min(3, { message: "errorCase.CaseNumberMin" })
    .max(20, { message: "errorCase.CaseNumberMax" }),
  MainCaseNumber: z
    .string()
    .min(3, { message: "errorCase.CaseNumberMin" })
    .max(20, { message: "errorCase.CaseNumberMax" }),

  case: z
    .string()
    .min(8, {
      message: "Client Current Case Name must be at least 8 characters.",
    })
    .max(25, {
      message: "Client Current Case Name must not exceed 25 characters.",
    }),
  Client: z.string().min(8, { message: "error.clientAddressMin" }),
  category: z.string().min(8, { message: "error.clientAddressMin" }),
  Court: z.string().min(8, { message: "error.clientAddressMin" }),
  CourtCategory: z.string().min(8, { message: "error.clientAddressMin" }),
  LawyerSelection: z.string().min(8, { message: "error.clientAddressMin" }),

  password: z
    .string()
    .min(8, { message: "Client Password must be at least 8 characters." })
    .max(25, { message: "Client Password must not exceed 25 characters." }),

  date1: z
    .string()
    .min(1, { message: "Date is required." })
    .refine(
      (value) => {
        // Check if the value is a valid date format
        const date = new Date(value);
        return !isNaN(date.getTime());
      },
      {
        message: "Please select a valid date.",
      }
    ),

  date2: z
    .string()
    .min(1, { message: "Date is required." })
    .refine(
      (value) => {
        // Check if the value is a valid date format
        const date = new Date(value);
        return !isNaN(date.getTime());
      },
      {
        message: "Please select a valid date.",
      }
    ),

  date3: z
    .string()
    .min(1, { message: "Date is required." })
    .refine(
      (value) => {
        // Check if the value is a valid date format
        const date = new Date(value);
        return !isNaN(date.getTime());
      },
      {
        message: "Please select a valid date.",
      }
    ),
  date4: z
    .string()
    .min(1, { message: "Date is required." })
    .refine(
      (value) => {
        // Check if the value is a valid date format
        const date = new Date(value);
        return !isNaN(date.getTime());
      },
      {
        message: "Please select a valid date.",
      }
    ),
});
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateCase from "../../(user-mangement)/cases-category/CreateCaseCategory";
import CreateCourt from "../../(user-mangement)/court-category/CreateCourtCategory";

const page = () => {
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  function onSubmit(data: z.infer<typeof schema>) {
    toast.message(JSON.stringify(data, null, 2));
  }
  const category: { value: string; label: string }[] = [
    { value: "جنائي", label: "جنائي" },
    { value: "عائلى", label: "عائلى" },
    { value: "مدنى", label: "مدنى" },
  ];
  const Name: { value: string; label: string }[] = [
    { value: "على عبدالله", label: "على عبدالله" },
    { value: "محمد احمد", label: "محمد احمد" },
    { value: "احمد محمد", label: "احمد محمد" },
  ];
  const courts: { value: string; label: string }[] = [
    { value: "محكمة الرياض", label: "محكمة الرياض" },
    { value: "محكمة مكة", label: "محكمة مكة" },
    { value: "محكمة جدة", label: "محكمة جدة" },
  ];
  const lawyer: { value: string; label: string }[] = [
    { value: "المحامى احمد على", label: "المحامى احمد على" },
    { value: "المحامى احمد عبدالله", label: "المحامى احمد عبدالله" },
    { value: "المحامى فهد ", label: "المحامى فهد " },
  ];
  const handleDateChange = (dates: Date[]) => {
    const selectedDate = dates[0] || null;
    setPicker(selectedDate);
    setValue("date", selectedDate ? selectedDate.toISOString() : "");
  };
  const { t } = useTranslate();

  const [picker, setPicker] = useState<Date>(new Date());
  const [mainCaseNumber, setMainCaseNumber] = useState<number>(1);
  const [secondaryCaseNumber, setSecondaryCaseNumber] = useState<number>(1);
  const [opposit, setOpposite] = useState<number>(1);
  return (
    <div>
      {" "}
      <Card>
        <CardHeader>
          <CardTitle> {t("Create a New Case")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-row justify-between items-center  gap-4">
              <div className="flex flex-col gap-2 my-2 w-[48%]">
                <motion.div
                  initial={{ y: -50 }}
                  whileInView={{ y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-row justify-between items-center"
                >
                  <div className="!w-[87%]" style={{ width: "87%" }}>
                    <Label htmlFor="Client">{t("Client Selection")}</Label>
                    <BasicSelect
                      name="Client"
                      menu={Name}
                      control={control}
                      errors={errors}
                    />
                    {errors.Client && (
                      <p className="text-xs text-destructive">
                        {t(errors.Client.message)}
                      </p>
                    )}{" "}
                  </div>
                  <Link href={"/clients"} className="w-[8%] mt-5">
                    <Icon
                      icon="gg:add"
                      width="24"
                      height="24"
                      color="#dfc77d"
                    />
                  </Link>
                </motion.div>
              </div>
              {/* <div className="flex flex-col gap-2 my-2 w-[48%]">
                <motion.div
                  initial={{ y: -50 }}
                  whileInView={{ y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="flex flex-row justify-between items-center"
                >
                  <div className="!w-[87%]" style={{ width: "87%" }}>
                    <Label htmlFor="category">{t("Case Category")} </Label>
                    <BasicSelect
                      name="category"
                      menu={category}
                      control={control}
                      errors={errors}
                    />
                    {errors.category && (
                      <p className="text-xs text-destructive">
                        {t(errors.category.message)}
                      </p>
                    )}
                  </div>
                  <div className="w-[8%] mt-5">
                    <CreateCase buttonShape={false} />
                  </div>
                </motion.div>
              </div> */}

              <div className="flex flex-col gap-2 my-2 w-[48%]">
                <motion.div
                  initial={{ y: -50 }}
                  whileInView={{ y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="flex flex-row justify-between items-center"
                >
                  <div className="!w-[87%]" style={{ width: "87%" }}>
                    <Label htmlFor="Court">{t("Court Selection")} </Label>
                    <BasicSelect
                      name="Court"
                      menu={courts}
                      control={control}
                      errors={errors}
                    />
                    {errors.Court && (
                      <p className="text-xs text-destructive">
                        {t(errors.Court.message)}
                      </p>
                    )}{" "}
                  </div>
                  <Link href={"/courts"} className="w-[8%] mt-5">
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
                transition={{ duration: 0.9 }}
                className="flex flex-col gap-2 my-2 w-[48%]"
              >
                <Label
                  htmlFor="Name"
                  className={cn("", { "text-destructive": errors.Name })}
                >
                  {t("Case Name")}
                </Label>
                <Input
                  type="text"
                  {...register("Name")}
                  placeholder={t("Enter User Case Name")}
                  className={cn("", {
                    "border-destructive focus:border-destructive": errors.Name,
                  })}
                />
                {errors.Name && (
                  <p className="text-xs text-destructive">
                    {t(errors.Name.message)}
                  </p>
                )}
              </motion.div>
              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1.5 }}
                className="flex flex-row justify-between items-center w-[48%]"
              >
                <div className="!w-[87%]" style={{ width: "87%" }}>
                  <Label htmlFor="category">{t("Lawyer Selection")} </Label>
                  <BasicSelect
                    name="LawyerSelection"
                    menu={lawyer}
                    control={control}
                    errors={errors}
                  />
                  {errors.LawyerSelection && (
                    <p className="text-xs text-destructive">
                      {t(errors.LawyerSelection.message)}
                    </p>
                  )}{" "}
                </div>
                <Link href={"/lawyer"} className="w-[8%] mt-5">
                  <Icon icon="gg:add" width="24" height="24" color="#dfc77d" />
                </Link>
              </motion.div>
              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 0.9 }}
                className="flex flex-col gap-2 my-2 w-[48%]"
              >
                <Label
                  htmlFor="MainCaseNumber"
                  className={cn("", {
                    "text-destructive": errors.MainCaseNumber,
                  })}
                >
                  {t("Case Number")}
                </Label>
                <Input
                  type="number"
                  {...register("MainCaseNumber")}
                  placeholder={t("Enter Case Number")}
                  className={cn("", {
                    "border-destructive focus:border-destructive":
                      errors.MainCaseNumber,
                  })}
                />
                {errors.MainCaseNumber && (
                  <p className="text-xs text-destructive">
                    {t(errors.MainCaseNumber.message)}
                  </p>
                )}
              </motion.div>
              {/* <div className="flex flex-col gap-2 my-2 w-[48%]">
                <div className="flex flex-row justify-between items-center">
                  <div className="!w-[87%]" style={{ width: "87%" }}>
                    <Label htmlFor="CourtCategory">{t("Court Category")}</Label>
                    <BasicSelect
                      name="CourtCategory"
                      menu={category}
                      control={control}
                      errors={errors}
                    />
                    {errors.CourtCategory && (
                      <p className="text-xs text-destructive">
                        {t(errors.CourtCategory.message)}
                      </p>
                    )}{" "}
                  </div>
                  <div className="w-[8%] mt-5">
                    <CreateCourt buttonShape={false} />
                  </div>
                </div>
              </div> */}

              {/* <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1.2 }}
                className="flex flex-col gap-2 my-2 w-[48%]"
              >
                <Label
                  htmlFor="LawyerName"
                  className={cn("", { "text-destructive": errors.LawyerName })}
                >
                  {t("Lawyer Name")}
                </Label>
                <Input
                  type="text"
                  {...register("LawyerName")}
                  placeholder={t("Enter Lawyer Name")}
                  className={cn("", {
                    "border-destructive focus:border-destructive":
                      errors.LawyerName,
                  })}
                />
                {errors.LawyerName && (
                  <p className="text-xs text-destructive">
                    {t(errors.LawyerName.message)}
                  </p>
                )}
              </motion.div> */}
            </div>
            <motion.hr
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="my-3"
            />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="my-3"
            >
              {t("Secondary_Case_Number")}
            </motion.p>
            <div className="flex flex-row justify-between items-center  gap-4">
              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-row justify-between items-center gap-6 w-full"
              >
                {Array.from({ length: secondaryCaseNumber }).map((_, index) => (
                  <div
                    key={index} // Ensure you use a unique key for each item
                    className={`${
                      secondaryCaseNumber !== 1
                        ? "!w-[100%] flex flex-row justify-between"
                        : "!w-[100%] flex flex-row justify-between"
                    }`}
                  >
                    <div
                      className={`${
                        secondaryCaseNumber === 1 ? "!w-[48%]" : "!w-[48%]"
                      }`}
                    >
                      <Label
                        htmlFor="SecondaryCaseNumber"
                        className={cn("", {
                          "text-destructive": errors.SecondaryCaseNumber,
                        })}
                      >
                        {t("Secondary Case Number")}
                      </Label>
                      <Input
                        type="number"
                        {...register("SecondaryCaseNumber")}
                        placeholder={t("Enter Secondary Case Number")}
                        className={cn("", {
                          "border-destructive focus:border-destructive":
                            errors.SecondaryCaseNumber,
                        })}
                      />
                      {errors.SecondaryCaseNumber && (
                        <p className="text-xs text-destructive">
                          {t(errors.SecondaryCaseNumber.message)}
                        </p>
                      )}
                    </div>
                    <div
                      className={`${
                        secondaryCaseNumber === 1 ? "!w-[42%]" : "!w-[42%]"
                      }`}
                    >
                      <Label
                        htmlFor="SecondaryCaseNumber"
                        className={cn("", {
                          "text-destructive": errors.SecondaryCaseNumber,
                        })}
                      >
                        {t("Name for Number")}
                      </Label>
                      <Input
                        type="number"
                        {...register("SecondaryCaseNumber")}
                        placeholder={t("Enter Name for Number")}
                        className={cn("", {
                          "border-destructive focus:border-destructive":
                            errors.SecondaryCaseNumber,
                        })}
                      />
                      {errors.SecondaryCaseNumber && (
                        <p className="text-xs text-destructive">
                          {t(errors.SecondaryCaseNumber.message)}
                        </p>
                      )}
                    </div>
                    {/* Delete icon: Show for all items except the last one */}
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

                    {/* Plus icon: Show if there's only one item or on the last item when there are more */}
                    {index === secondaryCaseNumber - 1 && (
                      <div
                        className="mt-6 w-[3%]"
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
              </motion.div>
            </div>
            <div className="flex flex-row justify-between items-center my-4 gap-4">
              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1.4 }}
                className="flex flex-col gap-2 w-[48%]"
              >
                <Label>
                  <div>
                    <Button
                      asChild
                      color="info"
                      className="w-28 border-[#dfc77d] hover:!bg-[#dfc77d] hover:!border-[#dfc77d] !text-black"
                      variant="outline"
                    >
                      <div className="mt-5">
                        {t("Choose File")} <Upload className=" mx-2 h-4 w-4" />
                      </div>
                    </Button>
                  </div>
                  <Input type="file" className="hidden" />
                </Label>
              </motion.div>
              <div className="flex flex-col gap-2 my-2 w-[48%]"></div>
              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1.6 }}
                className="flex flex-col gap-2 my-2 w-[48%]"
              >
                <Label htmlFor="category">{t("Receipt Date")} </Label>
                <Flatpickr
                  className="w-full bg-background border border-default-200 focus:border-primary focus:outline-none h-10 rounded-md px-2 placeholder:text-default-600"
                  placeholder={t("Select Receipt Date")}
                  value={picker}
                  onChange={handleDateChange}
                  onBlur={(e) => e.preventDefault()} // Prevent dialog from closing
                  id="default-picker"
                />
                {errors.date1 && (
                  <p className="text-xs text-destructive">
                    {t(errors.date1.message)}
                  </p>
                )}
              </motion.div>
              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1.7 }}
                className="flex flex-col gap-2 my-2 w-[48%]"
              >
                <Label htmlFor="category">{t("Submission Date")} </Label>
                <Flatpickr
                  className="w-full bg-background border border-default-200 focus:border-primary focus:outline-none h-10 rounded-md px-2 placeholder:text-default-600"
                  placeholder={t("Select Submission Date")}
                  value={picker}
                  onChange={handleDateChange}
                  onBlur={(e) => e.preventDefault()} // Prevent dialog from closing
                  id="default-picker"
                />
                {errors.date2 && (
                  <p className="text-xs text-destructive">
                    {t(errors.date2.message)}
                  </p>
                )}
              </motion.div>
              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1.8 }}
                className="flex flex-col gap-2 my-2 w-[48%]"
              >
                <Label htmlFor="category">{t("Judgment Date")} </Label>
                <Flatpickr
                  className="w-full bg-background border border-default-200 focus:border-primary focus:outline-none h-10 rounded-md px-2 placeholder:text-default-600"
                  placeholder={t("Select Judgment Date")}
                  value={picker}
                  onChange={handleDateChange}
                  onBlur={(e) => e.preventDefault()} // Prevent dialog from closing
                  id="default-picker"
                />
                {errors.date3 && (
                  <p className="text-xs text-destructive">
                    {t(errors.date3.message)}
                  </p>
                )}
              </motion.div>
              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1.9 }}
                className="flex flex-col gap-2 my-2 w-[48%]"
              >
                <Label htmlFor="category">{t("Hearing Date")} </Label>
                <Flatpickr
                  className="w-full bg-background border border-default-200 focus:border-primary focus:outline-none h-10 rounded-md px-2 placeholder:text-default-600"
                  placeholder={t("Select Hearing Date")}
                  value={picker}
                  onChange={handleDateChange}
                  onBlur={(e) => e.preventDefault()} // Prevent dialog from closing
                  id="default-picker"
                />
                {errors.date4 && (
                  <p className="text-xs text-destructive">
                    {t(errors.date4.message)}
                  </p>
                )}
              </motion.div>
            </div>
            <div className="flex flex-row justify-between items-center">
              {" "}
              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1 }}
                className="flex flex-col gap-2 my-2 w-[48%]"
              >
                <Label htmlFor="category">{t("Status")} </Label>
                <Radio text1={"Plaintiff"} text2={"Defendant"} />
              </motion.div>
              <div className="flex flex-col gap-2 my-2 w-[48%]">
                <motion.div
                  initial={{ y: -50 }}
                  whileInView={{ y: 0 }}
                  transition={{ duration: 1.1 }}
                  className="flex flex-row justify-between items-center"
                >
                  {Array.from({ length: opposit }).map((_, index) => (
                    <div
                      key={index} // Ensure you use a unique key for each item
                      className={`${
                        opposit !== 1
                          ? "!w-[100%] flex flex-row justify-between"
                          : "!w-[100%] flex flex-row justify-between"
                      }`}
                    >
                      <div
                        className={`${
                          opposit === 1 ? "!w-[100%]" : "!w-[91%]"
                        }`}
                      >
                        <Label
                          htmlFor="PartyName"
                          className={cn("", {
                            "text-destructive": errors.PartyName,
                          })}
                        >
                          {t("Opposing Party Name")}
                        </Label>
                        <Input
                          type="text"
                          {...register("PartyName")}
                          placeholder={t("Enter Opposing Party Name")}
                          className={cn("", {
                            "border-destructive focus:border-destructive":
                              errors.PartyName,
                          })}
                        />
                        {errors.PartyName && (
                          <p className="text-xs text-destructive">
                            {t(errors.PartyName.message)}
                          </p>
                        )}
                      </div>

                      {/* Delete icon: Show for all items except the last one */}
                      {opposit > 1 && index !== opposit - 1 && (
                        <div
                          className="mt-6 w-[8%]"
                          onClick={() => setOpposite(opposit - 1)}
                        >
                          <Icon
                            icon="material-symbols:delete"
                            width="24"
                            height="24"
                            color="#dfc77d"
                          />
                        </div>
                      )}

                      {/* Plus icon: Show if there's only one item or on the last item when there are more */}
                      {index === opposit - 1 && (
                        <div
                          className="mt-6 w-[8%]"
                          onClick={() => setOpposite(opposit + 1)}
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
            <div className="grid grid-cols-1 lg:grid-cols-1  my-4 gap-4">
              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 2 }}
                className="flex flex-col gap-2 my-2"
              >
                <Label
                  htmlFor="CaseDescription"
                  className={cn("", {
                    "text-destructive": errors.CaseDescription,
                  })}
                >
                  {t("Case Description")}
                </Label>
                <Textarea
                  {...register("CaseDescription")}
                  placeholder={t("Type Here")}
                  rows={7}
                  className={cn("", {
                    "border-destructive focus:border-destructive":
                      errors.CaseDescription,
                  })}
                />
                {errors.CaseDescription && (
                  <p className="text-xs text-destructive">
                    {t(errors.CaseDescription.message)}
                  </p>
                )}
              </motion.div>
            </div>
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
          </form>{" "}
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
