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
import BasicSelect from "@/components/common/Select/BasicSelect";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useTranslate } from "@/config/useTranslation";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { Radio } from "@/components/common/atoms/Radio";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import FileUploaderMultiple from "../../../(lawyer-managment)/lawyer-cases/FileUploaderSingle";

// Zod validation schema
const schema = z.object({
  Name: z
    .string()
    .min(3, { message: "error.clientNameMin" })
    .max(20, { message: "error.clientNameMax" }),
  phone: z.string().refine((value) => value.length === 11, {
    message: "error.phoneNumberLength",
  }),
  City: z
    .string()
    .min(3, {
      message: "errorCourt.CityMin",
    })
    .max(15, {
      message: "errorCourt.CityMax",
    }),
  Region: z.string().min(3, {
    message: "errorCourt.RegionMin",
  }),
  Category: z.any(),
  Nationality: z
    .string()
    .min(3, {
      message: "errorCourt.RegionMin",
    })
    .max(15, {
      message: "errorCourt.RegionMax",
    }),
  email: z
    .string()
    .min(8, { message: "error.clientEmailMin" })
    .max(25, { message: "error.clientEmailMax" }),
  Address: z
    .string()
    .min(8, { message: "error.clientAddressMin" })
    .max(35, { message: "error.clientAddressMax" }),
  Email: z
    .string()
    .min(8, { message: "error.clientEmailMin" })
    .max(35, { message: "error.clientEmailMax" }),
  rrole: z.string().min(8, { message: "error.clientAddressMin" }),
  case: z
    .string()
    .min(8, { message: "error.clientCaseMin" })
    .max(25, { message: "error.clientCaseMax" }),
  password: z
    .string()
    .min(8, { message: "error.clientPasswordMin" })
    .max(25, { message: "error.clientPasswordMax" }),
});
const page = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const { t } = useTranslate();

  function onSubmit(data: z.infer<typeof schema>) {
    toast.message(JSON.stringify(data, null, 2));
  }
  const Category: { value: string; label: string }[] = [
    { value: "عائلى", label: "عائلى" },
    { value: "مدنى", label: "مدنى" },
    { value: "جنائى", label: "جنائى" },
  ];
  return (
    <div>
      {" "}
      <Card>
        <CardHeader>
          <CardTitle> {t("Edit Client")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <motion.p
              initial={{ y: -30 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 1.2 }}
              className="my-4 font-bold"
            >
              {t("Client Info")}
            </motion.p>
            <div className="flex flex-row flex-wrap sm:flex-nowrap justify-between items-center  gap-4">
              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col gap-2 w-full sm:w-[48%]"
              >
                <Label
                  htmlFor="Name"
                  className={cn("", { "text-destructive": errors.Name })}
                >
                  {t("Client Name")}
                </Label>
                <Input
                  type="text"
                  {...register("Name")}
                  placeholder={t("Enter Client Name")}
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
                transition={{ duration: 0.7 }}
                className="flex flex-col gap-2 w-full sm:w-[48%]"
              >
                <Label
                  htmlFor="phone"
                  className={cn("", { "text-destructive": errors.phone })}
                >
                  {t("Mobile Number")}
                </Label>
                <Input
                  type="number"
                  placeholder={t("Enter Client Mobile Number")}
                  {...register("phone")}
                  className={cn("", {
                    "border-destructive focus:border-destructive": errors.phone,
                  })}
                />
                {errors.phone && (
                  <p className="text-xs text-destructive">
                    {t(errors.phone.message)}
                  </p>
                )}
              </motion.div>
              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1.7 }}
                className="flex flex-col gap-2 my-2 w-full sm:w-[48%]"
              >
                <Label htmlFor="Category">{t("Client Category")} </Label>
                <BasicSelect
                  name="Category"
                  menu={Category}
                  control={control}
                  errors={errors}
                />
                {errors.Category && (
                  <p className="text-xs text-destructive">
                    {t(errors.Category.message)}
                  </p>
                )}
              </motion.div>
              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col gap-2 w-full sm:w-[48%]"
              >
                <Label
                  htmlFor="Address"
                  className={cn("", { "text-destructive": errors.Address })}
                >
                  {t("Client Address")}
                </Label>
                <Input
                  type="text"
                  {...register("Address")}
                  placeholder={t("Enter Client Address")}
                  className={cn("", {
                    "border-destructive focus:border-destructive":
                      errors.Address,
                  })}
                />
                {errors.Address && (
                  <p className="text-xs text-destructive">
                    {t(errors.Address.message)}
                  </p>
                )}
              </motion.div>
              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 0.9 }}
                className="flex flex-col gap-2 w-full sm:w-[48%]"
              >
                <Label htmlFor="Role">{t("Role")}</Label>
                <Radio text1={"Company"} text2={"Personal"} />
              </motion.div>
              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1 }}
                className="flex flex-col gap-2 w-full sm:w-[48%]"
              >
                <Label
                  htmlFor="Email"
                  className={cn("", { "text-destructive": errors.Email })}
                >
                  {t("Email Address")}
                </Label>
                <Input
                  type="text"
                  {...register("Email")}
                  placeholder={t("Enter Email Address")}
                  className={cn("", {
                    "border-destructive focus:border-destructive": errors.Email,
                  })}
                />
                {errors.Email && (
                  <p className="text-xs text-destructive">
                    {t(errors.Email.message)}
                  </p>
                )}
              </motion.div>
              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1.1 }}
                className="flex flex-col gap-2 w-full sm:w-[48%]"
              >
                <Label
                  htmlFor="password"
                  className={cn("", { "text-destructive": errors.password })}
                >
                  {t("Password")}
                </Label>
                <Input
                  type="password"
                  {...register("password")}
                  placeholder={t("Enter Password")}
                  className={cn("", {
                    "border-destructive focus:border-destructive":
                      errors.password,
                  })}
                />
                {errors.password && (
                  <p className="text-xs text-destructive">
                    {t(errors.password.message)}
                  </p>
                )}
              </motion.div>
              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1.2 }}
                className="flex flex-col gap-2 w-full sm:w-[48%]"
              >
                <Label htmlFor="Identity Number">
                  {t("Identity Number *")}
                </Label>
                <Input type="text" placeholder={t("Enter Identity Number")} />
              </motion.div>
              <motion.hr
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="my-3 w-full"
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
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1.4 }}
                className="flex flex-col gap-2 w-full"
              >
                <FileUploaderMultiple />
              </motion.div>
              <motion.hr
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                className="my-3 w-full"
              />
              <motion.p
                initial={{ y: -30 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1.2 }}
                className="my-4 font-bold"
              >
                {t("Details")}
              </motion.p>
              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1.7 }}
                className="flex flex-col gap-2 w-[100%]"
              >
                <Label htmlFor="Details">{t("Details *")}</Label>
                <Textarea placeholder={t("Enter Details")} />
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.7 }}
              className="flex justify-center gap-3 mt-4"
            >
              <Button
                type="button"
                variant="outline"
                className="w-28 border-[#dfc77d] hover:!bg-[#dfc77d] hover:!border-[#dfc77d] !text-black"
              >
                {t("Cancel")}
              </Button>
              <Button
                type="submit"
                className=" !bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
              >
                {t("Edit Client")}
              </Button>
            </motion.div>
          </form>{" "}
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
