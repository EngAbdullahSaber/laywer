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

// Update the schema to validate date properly
const schema = z.object({
  Case: z
    .string()
    .min(3, { message: "errorLawyer.LawyerNameMin" })
    .max(20, { message: "errorLawyer.LawyerNameMax" }),

  CaseLocation: z
    .string()
    .min(8, { message: "errorLawyer.LawyerEmailMin" })
    .max(20, { message: "errorLawyer.LawyerEmailMax" }),
  Plaintiff: z
    .string()
    .min(8, { message: "errorLawyer.LawyerAddressMin" })
    .max(25, { message: "errorLawyer.LawyerAddressMax" }),
  Time: z
    .string()
    .min(8, { message: "errorLawyer.LawyerAddressMin" })
    .max(25, { message: "errorLawyer.LawyerAddressMax" }),
  follow: z
    .string()
    .min(8, { message: "errorLawyer.LawyerAddressMin" })
    .max(25, { message: "errorLawyer.LawyerAddressMax" }),
  done: z
    .string()
    .min(8, { message: "errorLawyer.LawyerAddressMin" })
    .max(25, { message: "errorLawyer.LawyerAddressMax" }),

  Defendant: z
    .string()
    .min(8, {
      message: "errorLawyer.CasepasswordMin",
    })
    .max(25, {
      message: "errorLawyer.CasepasswordMax",
    }),
  Date: z
    .string()
    .min(8, {
      message: "errorLawyer.CasepasswordMin",
    })
    .max(25, {
      message: "errorLawyer.CasepasswordMax",
    }),
  Days1: z.string().min(8, { message: "errorCourt.clientAddressMin" }),
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
                  "text-destructive": errors.Case,
                })}
              >
                {t("Case Name")}
              </Label>
              <Input
                type="text"
                {...register("Name")}
                placeholder={t("Enter Case Name")}
                className={cn("", {
                  "border-destructive focus:border-destructive": errors.Case,
                })}
              />
              {errors.Case && (
                <p
                  className={cn("text-xs", {
                    "text-destructive": errors.Case,
                  })}
                >
                  {t(errors.Case.message)}
                </p>
              )}
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
            </motion.div>
          </div>
          <div className="flex flex-row justify-between items-center my-4 gap-5">
            <motion.div
              initial={{ y: -50 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 1 }}
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
              transition={{ duration: 1.1 }}
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
              transition={{ duration: 1.2 }}
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
            transition={{ duration: 1.4 }}
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
            <div className="flex flex-row justify-between my-4 items-center gap-5">
              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1 }}
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
                transition={{ duration: 1.1 }}
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
                transition={{ duration: 1.2 }}
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
          ) : null}
          <motion.div
            initial={{ y: -50 }}
            whileInView={{ y: 0 }}
            transition={{ duration: 1.3 }}
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
            transition={{ duration: 1.3 }}
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
