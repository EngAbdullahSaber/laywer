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
import { useTranslate } from "@/config/useTranslation";
import BasicSelect from "@/components/common/Select/BasicSelect";

const schema = z.object({
  Name: z
    .string()
    .min(3, { message: "errorLawyer.LawyerNameMin" })
    .max(20, { message: "errorLawyer.LawyerNameMax" }),
  phone: z.string().refine((value) => value.length === 11, {
    message: "errorLawyer.Phone",
  }),
  email: z
    .string()
    .min(8, { message: "errorLawyer.LawyerEmailMin" })
    .max(20, { message: "errorLawyer.LawyerEmailMax" }),
  Address: z
    .string()
    .min(8, { message: "errorLawyer.LawyerAddressMin" })
    .max(25, { message: "errorLawyer.LawyerAddressMax" }),

  password: z
    .string()
    .min(8, {
      message: "errorLawyer.CasepasswordMin",
    })
    .max(25, {
      message: "errorLawyer.CasepasswordMax",
    }),
  LawyerCategory: z.string().min(8, { message: "errorCourt.clientAddressMin" }),
});

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CreateLawyer from "../../(user-mangement)/lawyer-category/CreateLawyer";

const page = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  function onSubmit(data: z.infer<typeof schema>) {
    toast.message(JSON.stringify(data, null, 2));
  }
  const Lawyer_Category: { value: string; label: string }[] = [
    { value: "عائلى", label: "عائلى" },
    { value: "جنائي", label: "جنائي" },
    { value: "مدنى", label: "مدنى" },
  ];
  const { t } = useTranslate();
  return (
    <div>
      {" "}
      <Card>
        <CardHeader>
          <CardTitle> {t("Create a New Lawyer")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col justify-between "
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="Name"
                  className={cn("", {
                    "text-destructive": errors.Name,
                  })}
                >
                  {t("Lawyer Name")}
                </Label>
                <Input
                  type="text"
                  {...register("Name")}
                  placeholder={t("Enter Lawyer Name")}
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
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="phone"
                  className={cn("", {
                    "text-destructive": errors.phone,
                  })}
                >
                  {t("Mobile Number")}
                </Label>
                <Input
                  type="number"
                  placeholder={t("Enter Mobile Number")}
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
              </div>
              <div className="flex flex-col gap-2">
                {" "}
                <div className="flex flex-row justify-between items-center">
                  <div className="!w-[87%]" style={{ width: "87%" }}>
                    <Label
                      htmlFor="Court_Category"
                      className={cn("", {
                        "text-destructive": errors.LawyerCategory,
                      })}
                    >
                      {t("Lawyer Category")}
                    </Label>
                    <BasicSelect
                      name="CourtCategory"
                      menu={Lawyer_Category}
                      control={control}
                      errors={errors}
                    />
                    {errors.LawyerCategory && (
                      <p className="text-xs text-destructive">
                        {t(errors.LawyerCategory.message)}
                      </p>
                    )}{" "}
                  </div>
                  <div className="w-[8%] mt-5">
                    <CreateLawyer buttonShape={false} />
                  </div>
                </div>
              </div>{" "}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="Address"
                  className={cn("", {
                    "text-destructive": errors.Address,
                  })}
                >
                  {t("Address")}
                </Label>
                <Input
                  type="text"
                  {...register("Address")}
                  placeholder={t("Enter Address")}
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
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="email"
                  className={cn("", {
                    "text-destructive": errors.email,
                  })}
                >
                  {t("Email")}
                </Label>
                <Input
                  type="email"
                  {...register("email")}
                  placeholder={t("Enter Email")}
                  className={cn("", {
                    "border-destructive focus:border-destructive": errors.email,
                  })}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">
                    {t(errors.email.message)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="password"
                  className={cn("", {
                    "text-destructive": errors.password,
                  })}
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
              </div>
            </div>
            {/* Submit Button inside form */}
            <div className="flex justify-center gap-3 mt-4">
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
                {t("Create Lawyer")}
              </Button>
            </div>
          </form>{" "}
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
