"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useTranslate } from "@/config/useTranslation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import BasicSelect from "@/components/common/Select/BasicSelect";
import CreateCourtCategory from "../../../(category-mangement)/court-category/CreateCourtCategory";

// Validation schema
const schema = z.object({
  Name: z
    .string()
    .min(3, { message: "errorCourt.CourtNameMin" })
    .max(20, { message: "errorCourt.CourtNameMax" }),
  Email: z
    .string()
    .min(8, { message: "errorCourt.CourtEmailMin" })
    .max(25, { message: "errorCourt.CourtEmailMax" }),
  Address: z
    .string()
    .min(8, { message: "errorCourt.CourtAddressMin" })
    .max(25, { message: "errorCourt.CourtAddressMax" }),
  Room_Number: z
    .string()
    .min(1, { message: "errorCourt.CourtRoomNumberMin" })
    .max(6, { message: "errorCourt.CourtRoomNumberMax" }),
  City: z
    .string()
    .min(3, { message: "errorCourt.CityMin" })
    .max(15, { message: "errorCourt.CityMax" }),
  Region: z
    .string()
    .min(3, { message: "errorCourt.RegionMin" })
    .max(15, { message: "errorCourt.RegionMax" }),
  CourtCategory: z.string().min(8, { message: "errorCourt.clientAddressMin" }),
});

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

  const { t } = useTranslate();

  const Court_Category = [
    { value: "عائلى", label: "عائلى" },
    { value: "جنائي", label: "جنائي" },
    { value: "مدنى", label: "مدنى" },
  ];

  const City = [
    { value: "الرياض", label: "الرياض" },
    { value: "جدة", label: "جدة" },
    { value: "الطائف", label: "الطائف" },
  ];

  const Region = [
    { value: "الرياض", label: "الرياض" },
    { value: "جدة", label: "جدة" },
    { value: "الطائف", label: "الطائف" },
  ];

  function onSubmit(data: z.infer<typeof schema>) {
    toast.message(JSON.stringify(data, null, 2));
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>{t("Create Court")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col justify-between"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Court Name */}
              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col gap-2"
              >
                <Label
                  htmlFor="Name"
                  className={cn({ "text-destructive": errors.Name })}
                >
                  {t("Court Name")}
                </Label>
                <Input
                  type="text"
                  {...register("Name")}
                  placeholder={t("Enter Court Name")}
                  className={cn({
                    "border-destructive focus:border-destructive": errors.Name,
                  })}
                />
                {errors.Name && (
                  <p className="text-xs text-destructive">
                    {t(errors.Name.message)}
                  </p>
                )}
              </motion.div>

              {/* Court Category */}
              <div className="flex flex-col gap-2">
                <motion.div
                  initial={{ y: -50 }}
                  whileInView={{ y: 0 }}
                  transition={{ duration: 0.7 }}
                  className="flex flex-row justify-between items-center"
                >
                  <div className="w-[87%]">
                    <Label
                      htmlFor="CourtCategory"
                      className={cn({
                        "text-destructive": errors.CourtCategory,
                      })}
                    >
                      {t("Court Category Level")}
                    </Label>
                    <BasicSelect
                      name="CourtCategory"
                      menu={Court_Category}
                      control={control}
                      errors={errors}
                    />
                  </div>
                  <div className="w-[8%] mt-5">
                    <CreateCourtCategory buttonShape={false} />
                  </div>
                </motion.div>
              </div>

              {/* Email */}
              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col gap-2"
              >
                <Label
                  htmlFor="Email"
                  className={cn({ "text-destructive": errors.Email })}
                >
                  {t("Email")}
                </Label>
                <Input
                  type="text"
                  {...register("Email")}
                  placeholder={t("Enter Email")}
                  className={cn({
                    "border-destructive focus:border-destructive": errors.Email,
                  })}
                />
                {errors.Email && (
                  <p className="text-xs text-destructive">
                    {t(errors.Email.message)}
                  </p>
                )}
              </motion.div>

              {/* Address */}
              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 0.9 }}
                className="flex flex-col gap-2"
              >
                <Label
                  htmlFor="Address"
                  className={cn({ "text-destructive": errors.Address })}
                >
                  {t("Address")}
                </Label>
                <Input
                  type="text"
                  {...register("Address")}
                  placeholder={t("Enter Address")}
                  className={cn({
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

              {/* Room Number */}
              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1 }}
                className="flex flex-col gap-2"
              >
                <Label
                  htmlFor="Room_Number"
                  className={cn({ "text-destructive": errors.Room_Number })}
                >
                  {t("Room Number")}
                </Label>
                <Input
                  type="number"
                  {...register("Room_Number")}
                  placeholder={t("Enter Room Number")}
                  className={cn({
                    "border-destructive focus:border-destructive":
                      errors.Room_Number,
                  })}
                />
                {errors.Room_Number && (
                  <p className="text-xs text-destructive">
                    {t(errors.Room_Number.message)}
                  </p>
                )}
              </motion.div>

              {/* Region */}
              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1.1 }}
                className="flex flex-col gap-2"
              >
                <Label
                  htmlFor="Region"
                  className={cn({ "text-destructive": errors.Region })}
                >
                  {t("Region")}
                </Label>
                <BasicSelect
                  name="Region"
                  menu={Region}
                  control={control}
                  errors={errors}
                />
              </motion.div>

              {/* City */}
              <motion.div
                initial={{ y: -50 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1.2 }}
                className="flex flex-col gap-2"
              >
                <Label
                  htmlFor="City"
                  className={cn({ "text-destructive": errors.City })}
                >
                  {t("City")}
                </Label>
                <BasicSelect
                  name="City"
                  menu={City}
                  control={control}
                  errors={errors}
                />
              </motion.div>
            </div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1.3 }}
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
                className="!bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
              >
                {t("Create Court")}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
