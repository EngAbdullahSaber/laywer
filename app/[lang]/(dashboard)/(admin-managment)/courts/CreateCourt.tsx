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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";
import { useTranslate } from "@/config/useTranslation";
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
    .min(8, {
      message: "errorCourt.CourtAddressMin",
    })
    .max(25, {
      message: "errorCourt.CourtAddressMax",
    }),
  Room_Number: z
    .string()
    .min(1, {
      message: "errorCourt.CourtRoomNumberMin",
    })
    .max(6, {
      message: "errorCourt.CourtRoomNumberMax",
    }),
  City: z
    .string()
    .min(3, {
      message: "errorCourt.CityMin",
    })
    .max(15, {
      message: "errorCourt.CityMax",
    }),
  Region: z
    .string()
    .min(3, {
      message: "errorCourt.RegionMin",
    })
    .max(15, {
      message: "errorCourt.RegionMax",
    }),
  CourtCategory: z.string().min(8, { message: "errorCourt.clientAddressMin" }),
});

const CreateCourt = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  function onSubmit(data: z.infer<typeof schema>) {
    toast.message(JSON.stringify(data, null, 2));
  }
  const Court_Category: { value: string; label: string }[] = [
    { value: "عائلى", label: "عائلى" },
    { value: "جنائي", label: "جنائي" },
    { value: "مدنى", label: "مدنى" },
  ];
  const { t, loading, error } = useTranslate();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="!bg-[#dfc77d] hover:!bg-[#fef0be] text-black">
          {t("Create Court")}
        </Button>
      </DialogTrigger>
      <DialogContent size="2xl" className="gap-3 h-[75%] ">
        <DialogHeader className="p-0">
          <DialogTitle className="text-2xl font-bold text-default-700">
            {t("Create a New Court")}
          </DialogTitle>
        </DialogHeader>
        <div className="h-auto">
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
                  {t("Court Name")}
                </Label>
                <Input
                  type="text"
                  {...register("Name")}
                  placeholder={t("Enter Court Name")}
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
                  htmlFor="Court_Category"
                  className={cn("", {
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
                {errors.CourtCategory && (
                  <p className="text-xs text-destructive">
                    {t(errors.CourtCategory.message)}
                  </p>
                )}
              </div>{" "}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="Email"
                  className={cn("", {
                    "text-destructive": errors.Email,
                  })}
                >
                  {t("Email")}
                </Label>
                <Input
                  type="text"
                  {...register("Name")}
                  placeholder={t("Enter Email")}
                  className={cn("", {
                    "border-destructive focus:border-destructive": errors.Email,
                  })}
                />
                {errors.Email && (
                  <p
                    className={cn("text-xs", {
                      "text-destructive": errors.Email,
                    })}
                  >
                    {t(errors.Email.message)}
                  </p>
                )}
              </div>
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
                  {...register("Name")}
                  placeholder={t("Enter Address")}
                  className={cn("", {
                    "border-destructive focus:border-destructive":
                      errors.Address,
                  })}
                />
                {errors.Address && (
                  <p
                    className={cn("text-xs", {
                      "text-destructive": errors.Address,
                    })}
                  >
                    {t(errors.Address.message)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="Room_Number"
                  className={cn("", {
                    "text-destructive": errors.Room_Number,
                  })}
                >
                  {t("Room Number")}
                </Label>
                <Input
                  type="number"
                  {...register("Room_Number")}
                  placeholder={t("Enter Room Number")}
                  className={cn("", {
                    "border-destructive focus:border-destructive":
                      errors.Room_Number,
                  })}
                />
                {errors.Room_Number && (
                  <p
                    className={cn("text-xs", {
                      "text-destructive": errors.Room_Number,
                    })}
                  >
                    {t(errors.Room_Number.message)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="Region"
                  className={cn("", {
                    "text-destructive": errors.Region,
                  })}
                >
                  {t("Region")}
                </Label>
                <Input
                  type="text"
                  {...register("Region")}
                  placeholder={t("Enter Region")}
                  className={cn("", {
                    "border-destructive focus:border-destructive":
                      errors.Region,
                  })}
                />
                {errors.Region && (
                  <p
                    className={cn("text-xs", {
                      "text-destructive": errors.Region,
                    })}
                  >
                    {t(errors.Region.message)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="City"
                  className={cn("", {
                    "text-destructive": errors.City,
                  })}
                >
                  {t("City")}
                </Label>
                <Input
                  type="text"
                  {...register("City")}
                  placeholder={t("Enter City")}
                  className={cn("", {
                    "border-destructive focus:border-destructive": errors.City,
                  })}
                />
                {errors.City && (
                  <p
                    className={cn("text-xs", {
                      "text-destructive": errors.City,
                    })}
                  >
                    {t(errors.City.message)}
                  </p>
                )}
              </div>
            </div>
            {/* Submit Button inside form */}
            <div className="flex justify-center gap-3 mt-4">
              <DialogClose asChild>
                <Button
                  type="button"
                  className="w-28 border-[#dfc77d] hover:!bg-[#dfc77d] hover:!border-[#dfc77d] !text-black"
                  variant="outline"
                >
                  {t("Cancel")}
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className=" !bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
              >
                {t("Create Court")}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCourt;
