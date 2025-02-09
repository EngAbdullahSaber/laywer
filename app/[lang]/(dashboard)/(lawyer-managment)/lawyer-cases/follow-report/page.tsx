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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Flatpickr from "react-flatpickr";
import { useState } from "react";
import { Icon } from "@iconify/react";
import BasicSelect from "@/components/common/Select/BasicSelect";
import { useTranslate } from "@/config/useTranslation";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CleaveInput } from "@/components/ui/cleave";
import { Radio } from "@/components/common/atoms/Radio";
import ControlledRadio from "./ControlledRadio";
import { Upload } from "lucide-react";
import FileUploaderMultiple from "../FileUploaderSingle";
// Update the schema to validate date properly
const schema = z.object({
  Name: z
    .string()
    .refine(
      (value) =>
        [
          "السبت",
          "الاحد",
          "الاثنين",
          "الثلاثاء",
          "الاربعاء",
          "الخميس",
          "الجمعة",
        ].includes(value),
      {
        message: "errorLawyerFollowReport.InvalidDay",
      }
    ),

  CaseLocation: z
    .string()
    .min(5, { message: "errorLawyerFollowReport.CaseLocationMin" })
    .max(50, { message: "errorLawyerFollowReport.CaseLocationMax" }),
  Plaintiff: z
    .string()
    .min(5, { message: "errorLawyerFollowReport.PlaintiffNameMin" })
    .max(50, { message: "errorLawyerFollowReport.PlaintiffNameMax" }),
  Defendant: z
    .string()
    .min(5, { message: "errorLawyerFollowReport.DefendantNameMin" })
    .max(50, { message: "errorLawyerFollowReport.DefendantNameMax" }),

  // Date Validation (should match YYYY-MM-DD format)
  Date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "errorLawyerFollowReport.InvalidDateFormat",
  }),

  // Days Validation
  Days: z
    .string()
    .refine(
      (value) =>
        [
          "السبت",
          "الاحد",
          "الاثنين",
          "الثلاثاء",
          "الاربعاء",
          "الخميس",
          "الجمعة",
        ].includes(value),
      {
        message: "errorLawyerFollowReport.InvalidDay",
      }
    ),

  // Time Validation (should match HH:MM:SS format)
  Time: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, {
    message: "errorLawyerFollowReport.InvalidTimeFormat",
  }),

  // Additional date fields (Date1, Time1, Days1)
  Date1: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: "errorLawyerFollowReport.InvalidDateFormat",
  }),

  Days1: z
    .string()
    .refine(
      (value) =>
        [
          "السبت",
          "الاحد",
          "الاثنين",
          "الثلاثاء",
          "الاربعاء",
          "الخميس",
          "الجمعة",
        ].includes(value),
      {
        message: "errorLawyerFollowReport.InvalidDay",
      }
    ),

  Time1: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, {
    message: "errorLawyerFollowReport.InvalidTimeFormat",
  }),

  follow: z
    .string()
    .min(8, { message: "errorLawyerFollowReport.FollowNameMin" })
    .max(150, { message: "errorLawyerFollowReport.FollowNameMax" }),

  done: z
    .string()
    .min(8, { message: "errorLawyerFollowReport.DoneNameMin" })
    .max(150, { message: "errorLawyerFollowReport.DoneNameMax" }),
  CaseNumber: z
    .string()
    .min(5, { message: "errorLawyerAttendReport.CaseNumberMin" })
    .max(30, { message: "errorLawyerAttendReport.CaseNumberMax" }),
});

const CaseFollowReport = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue, // Add setValue to update the date field in react-hook-form
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const [selected, setSelected] = useState("There is no appointment");

  function onSubmit(data: z.infer<typeof schema>) {
    toast.message(JSON.stringify(data, null, 2));
  }

  // Handle Flatpickr change event and set value in react-hook-form

  const Days: { value: string; label: string }[] = [
    { value: "السبت", label: "السبت" },
    { value: " الاحد", label: " الاحد" },
    { value: "الاثنين", label: "الاثنين" },
    { value: "الثلاثاء", label: "الثلاثاء" },
    { value: "الاربعاء", label: "الاربعاء" },
    { value: "الخميس", label: "الخميس" },
    { value: "الجمعة", label: "الجمعة" },
  ];
  const { t, loading, error } = useTranslate();

  return (
    <Card>
      <CardHeader>
        <CardTitle> {t("Case follow-up report")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-between "
        >
          <motion.p
            initial={{ y: -30 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="my-4 font-bold"
          >
            {t("Case Details")}
          </motion.p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <motion.div
              initial={{ y: -50 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-2"
            >
              <Label
                htmlFor="Case"
                className={cn("", {
                  "text-destructive": errors.Name,
                })}
              >
                {t("Case Name")}
              </Label>
              <BasicSelect
                name="Name"
                menu={Days}
                control={control}
                errors={errors}
              />
              {errors.Name && (
                <p className="text-xs text-destructive">
                  {t(errors.Name.message)}
                </p>
              )}{" "}
            </motion.div>
            <motion.div
              initial={{ y: -50 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 0.7 }}
              className="flex flex-col gap-2"
            >
              <Label
                htmlFor="CaseLocation"
                className={cn("", {
                  "text-destructive": errors.CaseLocation,
                })}
              >
                {t("Location of the case")}
              </Label>
              <Input
                type="text"
                {...register("CaseLocation")}
                placeholder={t("Enter Location of the case")}
                className={cn("", {
                  "border-destructive focus:border-destructive":
                    errors.CaseLocation,
                })}
              />
              {errors.CaseLocation && (
                <p
                  className={cn("text-xs", {
                    "text-destructive": errors.CaseLocation,
                  })}
                >
                  {t(errors.CaseLocation.message)}
                </p>
              )}
            </motion.div>
            <motion.div
              initial={{ y: -30 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-2"
            >
              <Label
                htmlFor="CaseNumber"
                className={cn("", {
                  "text-destructive": errors.CaseNumber,
                })}
              >
                {t("Case Number")}
              </Label>
              <Input
                type="number"
                disabled
                {...register("CaseNumber")}
                placeholder={t("Enter Case Number")}
                className={cn("", {
                  "border-destructive focus:border-destructive":
                    errors.CaseNumber,
                })}
              />
              {errors.CaseNumber && (
                <p
                  className={cn("text-xs", {
                    "text-destructive": errors.CaseNumber,
                  })}
                >
                  {t(errors.CaseNumber.message)}
                </p>
              )}
            </motion.div>
            <motion.div
              initial={{ y: -50 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-2"
            >
              <Label
                htmlFor="Plaintiff"
                className={cn("", {
                  "text-destructive": errors.Plaintiff,
                })}
              >
                {t("Plaintiff Name")}
              </Label>
              <Input
                type="text"
                {...register("Plaintiff")}
                placeholder={t("Enter Plaintiff Name")}
                className={cn("", {
                  "border-destructive focus:border-destructive":
                    errors.Plaintiff,
                })}
              />
              {errors.Plaintiff && (
                <p
                  className={cn("text-xs", {
                    "text-destructive": errors.Plaintiff,
                  })}
                >
                  {t(errors.Plaintiff.message)}
                </p>
              )}
            </motion.div>
            <motion.div
              initial={{ y: -50 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 0.9 }}
              className="flex flex-col gap-2"
            >
              <Label
                htmlFor="Defendant"
                className={cn("", {
                  "text-destructive": errors.Defendant,
                })}
              >
                {t("Defendant Name")}
              </Label>
              <Input
                type="text"
                {...register("Defendant")}
                placeholder={t("Enter Defendant Name")}
                className={cn("", {
                  "border-destructive focus:border-destructive":
                    errors.Defendant,
                })}
              />
              {errors.Defendant && (
                <p
                  className={cn("text-xs", {
                    "text-destructive": errors.Defendant,
                  })}
                >
                  {t(errors.Defendant.message)}
                </p>
              )}
            </motion.div>{" "}
          </div>

          <motion.hr
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="my-3"
          />
          <motion.p
            initial={{ y: -30 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 1.1 }}
            className="my-4 font-bold"
          >
            {t("Upload Files")}
          </motion.p>
          <motion.div
            initial={{ y: -50 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 1.2 }}
            className="flex flex-col gap-2 "
          >
            <FileUploaderMultiple />
          </motion.div>
          <motion.hr
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.3 }}
            className="my-3"
          />
          <motion.p
            initial={{ y: -30 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 1.4 }}
            className="my-4 font-bold"
          >
            {t("Date In Days And Hours")}
          </motion.p>
          <div className="flex flex-row justify-between items-center my-4 gap-5">
            <motion.div
              initial={{ y: -50 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 1.5 }}
              className="flex flex-col gap-2 w-[32%]"
            >
              <Label
                htmlFor="Date"
                className={cn("", {
                  "text-destructive": errors.Date,
                })}
              >
                {t("Date")}
              </Label>
              <CleaveInput
                id="date"
                options={{ date: true, datePattern: ["Y", "m", "d"] }}
                placeholder="YYYY-MM-DD"
                {...register("Date")}
                className={cn("", {
                  "border-destructive focus:border-destructive": errors.Date,
                })}
              />
              {errors.Date && (
                <p
                  className={cn("text-xs", {
                    "text-destructive": errors.Date,
                  })}
                >
                  {t(errors.Date.message)}
                </p>
              )}
            </motion.div>
            <motion.div
              initial={{ y: -50 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 1.6 }}
              className="flex flex-col gap-2 w-[32%]"
            >
              <Label
                htmlFor="Time"
                className={cn("", {
                  "text-destructive": errors.Time,
                })}
              >
                {t("Time")}
              </Label>
              <CleaveInput
                id="time"
                options={{ time: true, timePattern: ["h", "m", "s"] }}
                placeholder="HH:MM:SS"
                {...register("Time")}
                className={cn("", {
                  "border-destructive focus:border-destructive": errors.Time,
                })}
              />
              {errors.Time && (
                <p
                  className={cn("text-xs", {
                    "text-destructive": errors.Time,
                  })}
                >
                  {t(errors.Time.message)}
                </p>
              )}
            </motion.div>
            <motion.div
              initial={{ y: -50 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 1.7 }}
              className="flex flex-col gap-2 w-[32%]"
            >
              <Label
                htmlFor="Days"
                className={cn("", {
                  "text-destructive": errors.Days1,
                })}
              >
                {t("Day")}
              </Label>
              <BasicSelect
                name="Days"
                menu={Days}
                control={control}
                errors={errors}
              />
              {errors.Days1 && (
                <p className="text-xs text-destructive">
                  {t(errors.Days1.message)}
                </p>
              )}{" "}
            </motion.div>
          </div>

          <motion.div
            initial={{ y: -50 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 1.8 }}
            className="flex flex-col gap-2 my-2 w-[48%]"
          >
            <Label>{t("Appointment Status")} </Label>
            <ControlledRadio
              text1={t("There is an appointment")}
              setSelected={setSelected}
              selected={selected}
              text2={t("There is no appointment")}
            />
          </motion.div>
          {selected == "There is an appointment" || selected == "يوجد موعد" ? (
            <>
              {" "}
              <motion.p
                initial={{ y: -30 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1.9 }}
                className="my-4 font-bold"
              >
                {t("Next Appointmet")}
              </motion.p>
              <div className="flex flex-row justify-between my-4 items-center gap-5">
                <motion.div
                  initial={{ y: -50 }}
                  whileInView={{ y: 0 }}
                  transition={{ duration: 2 }}
                  className="flex flex-col gap-2 w-[32%]"
                >
                  <Label
                    htmlFor="Date"
                    className={cn("", {
                      "text-destructive": errors.Date1,
                    })}
                  >
                    {t("Date")}
                  </Label>
                  <CleaveInput
                    id="date"
                    options={{ date: true, datePattern: ["Y", "m", "d"] }}
                    placeholder="YYYY-MM-DD"
                    {...register("Date1")}
                    className={cn("", {
                      "border-destructive focus:border-destructive":
                        errors.Date1,
                    })}
                  />
                  {errors.Date1 && (
                    <p
                      className={cn("text-xs", {
                        "text-destructive": errors.Date1,
                      })}
                    >
                      {t(errors.Date1.message)}
                    </p>
                  )}
                </motion.div>
                <motion.div
                  initial={{ y: -50 }}
                  whileInView={{ y: 0 }}
                  transition={{ duration: 2.1 }}
                  className="flex flex-col gap-2 w-[32%]"
                >
                  <Label
                    htmlFor="Time1"
                    className={cn("", {
                      "text-destructive": errors.Time1,
                    })}
                  >
                    {t("Time")}
                  </Label>
                  <CleaveInput
                    id="time1"
                    options={{ time: true, timePattern: ["h", "m", "s"] }}
                    placeholder="HH:MM:SS"
                    {...register("Time1")}
                    className={cn("", {
                      "border-destructive focus:border-destructive":
                        errors.Time1,
                    })}
                  />
                  {errors.Time1 && (
                    <p
                      className={cn("text-xs", {
                        "text-destructive": errors.Time1,
                      })}
                    >
                      {t(errors.Time1.message)}
                    </p>
                  )}
                </motion.div>
                <motion.div
                  initial={{ y: -50 }}
                  whileInView={{ y: 0 }}
                  transition={{ duration: 2.2 }}
                  className="flex flex-col gap-2 w-[32%]"
                >
                  <Label
                    htmlFor="Days"
                    className={cn("", {
                      "text-destructive": errors.Days1,
                    })}
                  >
                    {t("Day")}
                  </Label>
                  <BasicSelect
                    name="Days"
                    menu={Days}
                    control={control}
                    errors={errors}
                  />
                  {errors.Days1 && (
                    <p className="text-xs text-destructive">
                      {t(errors.Days1.message)}
                    </p>
                  )}{" "}
                </motion.div>
              </div>
            </>
          ) : null}
          <motion.hr
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.3 }}
            className="my-3"
          />
          <motion.p
            initial={{ y: -30 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 2.4 }}
            className="my-4 font-bold"
          >
            {t("Necessary Procedures")}
          </motion.p>
          <motion.div
            initial={{ y: -50 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 2.5 }}
            className="flex flex-col gap-2 my-4"
          >
            <Label
              htmlFor="follow"
              className={cn("", {
                "text-destructive": errors.follow,
              })}
            >
              {t("Follow-up procedures")}
            </Label>
            <Textarea
              {...register("follow")}
              placeholder={t("Type Here")}
              rows={7}
              className={cn("", {
                "border-destructive focus:border-destructive": errors.follow,
              })}
            />
            {errors.follow && (
              <p className="text-xs text-destructive">
                {t(errors.follow.message)}
              </p>
            )}
          </motion.div>
          <motion.div
            initial={{ y: -50 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 2.6 }}
            className="flex flex-col gap-2 my-4"
          >
            <Label
              htmlFor="done"
              className={cn("", {
                "text-destructive": errors.done,
              })}
            >
              {t("What should be done?")}
            </Label>
            <Textarea
              {...register("done")}
              placeholder={t("Type Here")}
              rows={7}
              className={cn("", {
                "border-destructive focus:border-destructive": errors.done,
              })}
            />
            {errors.done && (
              <p className="text-xs text-destructive">
                {t(errors.done.message)}
              </p>
            )}
          </motion.div>
          {/* Submit Button inside form */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 2.7 }}
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
              className="w-28 !bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
            >
              {t("Create Report")}
            </Button>
          </motion.div>
        </form>{" "}
      </CardContent>
    </Card>
  );
};

export default CaseFollowReport;
