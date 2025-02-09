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
import { Icon } from "@iconify/react";

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

const CreateLawyer = () => {
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
    <Dialog>
      <DialogTrigger>
        {" "}
        <Button
          size="icon"
          variant="outline"
          className=" h-7 w-7 "
          color="secondary"
        >
          {" "}
          <Icon icon="heroicons:pencil" className="h-4 w-4" />{" "}
        </Button>
      </DialogTrigger>
      <DialogContent size="2xl" className="gap-3 h-[65%] ">
        <DialogHeader className="p-0">
          <DialogTitle className="text-2xl font-bold text-default-700">
            {t("Update Lawyer")}
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
              {/* <div className="flex flex-col gap-2">
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
                )}
              </div>{" "} */}
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
                className="w-28 !bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
              >
                {t("Update Lawyer")}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLawyer;
