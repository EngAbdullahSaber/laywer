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
import { toast } from "sonner";
import { useTranslate } from "@/config/useTranslation";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { Radio } from "@/components/common/atoms/Radio";

// Zod validation schema
const schema = z.object({
  Name: z
    .string()
    .min(3, { message: "error.clientNameMin" })
    .max(20, { message: "error.clientNameMax" }),
  phone: z.string().refine((value) => value.length === 11, {
    message: "error.phoneNumberLength",
  }),
  email: z
    .string()
    .min(8, { message: "error.clientEmailMin" })
    .max(25, { message: "error.clientEmailMax" }),
  Address: z
    .string()
    .min(8, { message: "error.clientAddressMin" })
    .max(35, { message: "error.clientAddressMax" }),
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

const CreateContact = () => {
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

  const category: { value: string; label: string }[] = [
    { value: "Admin", label: "Admin" },
    { value: "S Admin", label: "S Admin" },
    { value: "Client", label: "Client" },
  ];
  console.log(errors.rrole);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-28 !bg-[#dfc77d] hover:!bg-[#fef0be] text-black">
          {t("Create Client")}
        </Button>
      </DialogTrigger>
      <DialogContent size="2xl" className="gap-3 !h-[90%]">
        <DialogHeader className="p-0">
          <DialogTitle className="text-2xl font-bold text-default-700">
            {t("Create a New Client")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-row justify-between items-center  gap-4">
            <div className="flex flex-col gap-2 w-[48%]">
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
            </div>

            <div className="flex flex-col gap-2 w-[48%]">
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
            </div>
            <div className="flex flex-col gap-2 my-2 w-[48%]">
              <Label htmlFor="category">{t("Status")} </Label>
              <Radio text1={"Plaintiff"} text2={"Defendant"} />
            </div>
            <div className="flex flex-col gap-2 w-[48%]">
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
                  "border-destructive focus:border-destructive": errors.Address,
                })}
              />
              {errors.Address && (
                <p className="text-xs text-destructive">
                  {t(errors.Address.message)}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 w-[48%]">
              <Label htmlFor="Role">{t("Role")}</Label>
              <Radio text1={"Company"} text2={"Personal"} />
            </div>

            <div className="flex flex-col gap-2 w-[48%]">
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
            </div>

            <div className="flex flex-col gap-2 w-[48%]">
              <Label htmlFor="Identity Number">{t("Identity Number *")}</Label>
              <Input type="text" placeholder={t("Enter Identity Number")} />
            </div>
            <div className="flex flex-col gap-2 w-[48%]">
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
            </div>
            <div className="flex flex-col gap-2 w-[100%]">
              <Label htmlFor="Details">{t("Details *")}</Label>
              <Textarea placeholder={t("Enter Details")} />
            </div>
          </div>

          <div className="flex justify-center gap-3 mt-4">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="w-28 border-[#dfc77d] hover:!bg-[#dfc77d] hover:!border-[#dfc77d] !text-black"
              >
                {t("Cancel")}
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="w-28 !bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
            >
              {t("Create Client")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateContact;
