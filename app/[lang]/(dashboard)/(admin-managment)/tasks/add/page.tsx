"use client";
import BasicSelect from "@/components/common/Select/BasicSelect";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { useTranslate } from "@/config/useTranslation";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { motion } from "framer-motion";

const schema = z.object({
  Name: z
    .string()
    .min(3, { message: "errorTask.TaskNameMin" })
    .max(20, { message: "errorTask.TaskNameMax" }),
  Case_Name: z
    .string()
    .min(8, {
      message: "errorTask.CaseNameMin",
    })
    .max(25, {
      message: "errorTask.CaseNameMax",
    }),
  AssignedTo: z.string().min(8, { message: "errorTask.clientAddressMin" }),
  ImportanceLevel: z.string().min(8, { message: "errorTask.clientAddressMin" }),
  TaskStatus: z.string().min(8, { message: "errorTask.clientAddressMin" }),
});

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

const page = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const [picker, setPicker] = useState<Date>(new Date());
  const { t, loading, error } = useTranslate();

  function onSubmit(data: z.infer<typeof schema>) {
    toast.message(JSON.stringify(data, null, 2));
  }
  const Importance_Level: { value: string; label: string }[] = [
    { value: "مهمة جدا", label: "مهمة جدا" },
    { value: "متوسطة الاهمية", label: "متوسطة الاهمية" },
    { value: "ذات اهمية ضعيفة", label: "ذات اهمية ضعيفة" },
  ];
  const Assigned_To: { value: string; label: string }[] = [
    { value: "احمد محمد", label: "احمد محمد" },
    { value: "فهد عبدالله", label: "فهد عبدالله" },
    { value: "محمد على احمد", label: "محمد على احمد" },
  ];
  const Task_Status: { value: string; label: string }[] = [
    { value: "قيدالانتظار", label: "قيدالانتظار" },
    { value: "قيد التنفيذ", label: "قيد التنفيذ" },
    { value: "قيد التنفيذ", label: "قيد التنفيذ" },
  ];
  const Case_Name: { value: string; label: string }[] = [
    { value: "القضية 1", label: "القضية 1" },
    { value: "القضية 2", label: "القضية 2" },
    { value: "القضية 3", label: "القضية 3" },
  ];
  const handleDateChange = (dates: Date[]) => {
    const selectedDate = dates[0] || null;
    setPicker(selectedDate);
    setValue("date", selectedDate ? selectedDate.toISOString() : "");
  };
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle> {t("Create a New Task")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col justify-between "
          >
            <div className="flex flex-row  flex-wrap sm:flex-nowrap justify-between items-center  gap-4">
              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col gap-2 w-full sm:w-[48%]"
              >
                <Label
                  htmlFor="Name"
                  className={cn("", {
                    "text-destructive": errors.Name,
                  })}
                >
                  {t("Task Name")}
                </Label>
                <Input
                  type="text"
                  {...register("Name")}
                  placeholder={t("Enter Task Name")}
                  className={cn("", {
                    "border-destructive focus:border-destructive": errors.Name,
                  })}
                />
                {errors.Name && (
                  <p
                    className={cn("text-xs", {
                      "text-destructive": errors.Name,
                    })}
                  >
                    {t(errors.Name.message)}
                  </p>
                )}
              </motion.div>

              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 0.7 }}
                className="flex flex-col gap-2 w-full sm:w-[48%]"
              >
                <Label
                  htmlFor="Importance_Level"
                  className={cn("", {
                    "text-destructive": errors.Importance_Level,
                  })}
                >
                  {t("Importance Level")}
                </Label>

                <BasicSelect
                  name="ImportanceLevel"
                  menu={Importance_Level}
                  control={control}
                  errors={errors}
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
                    <Label
                      htmlFor="Assigned_To"
                      className={cn("", {
                        "text-destructive": errors.Assigned_To,
                      })}
                    >
                      {t("Assigned To")}
                    </Label>
                    <BasicSelect
                      name="AssignedTo"
                      menu={Assigned_To}
                      control={control}
                      errors={errors}
                    />
                  </div>
                  <Link href={"/lawyer"} className="w-[10%] mt-5">
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
                    <Label
                      htmlFor="Case_Name"
                      className={cn("", {
                        "text-destructive": errors.Case_Name,
                      })}
                    >
                      {t("Casess")}
                    </Label>

                    <BasicSelect
                      name="Case_Name"
                      menu={Case_Name}
                      control={control}
                      errors={errors}
                    />
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
                <Label
                  htmlFor="Case_Name"
                  className={cn("", {
                    "text-destructive": errors.Case_Name,
                  })}
                >
                  {t("Due Date")}
                </Label>
                <Flatpickr
                  className="w-full bg-background border border-default-200 focus:border-primary focus:outline-none h-10 rounded-md px-2 placeholder:text-default-600"
                  placeholder="Enter Receipt Date"
                  value={picker}
                  onChange={(dates: Date[]) => {
                    setPicker(dates[0] || null);
                  }}
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
                <Label>{t("Details")}</Label>
                <Textarea placeholder={t("Type Here")} rows={7} />
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
                className="w-28 !bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
              >
                {t("Create Task")}
              </Button>
            </motion.div>
          </form>{" "}
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
