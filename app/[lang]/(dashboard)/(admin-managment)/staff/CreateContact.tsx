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
import { useTranslate } from "@/config/useTranslation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
const schema = z.object({
  Name: z
    .string()
    .min(3, { message: "errorStaff.NameMin" })
    .max(20, { message: "errorStaff.NameMax" }),
  Email: z
    .string()
    .min(8, { message: "errorStaff.EmailMin" })
    .max(30, { message: "errorStaff.EmailMax" })
    .email({ message: "errorStaff.InvalidEmail" }), // Ensure it's a valid email
  phone: z
    .string()
    .refine((value) => value.length === 11, { message: "errorStaff.Phone" }), // Ensure phone is 11 digits
  Category: z.string().min(1, { message: "errorStaff.CategoryRequired" }), // Ensure category is selected
  Password: z
    .string()
    .min(8, { message: "errorStaff.PasswordMin" }) // Minimum length of 8 characters
    .regex(/[A-Z]/, { message: "errorStaff.PasswordUppercase" }) // At least one uppercase letter
    .regex(/[a-z]/, { message: "errorStaff.PasswordLowercase" }) // At least one lowercase letter
    .regex(/[0-9]/, { message: "errorStaff.PasswordNumber" }) // At least one number
    .regex(/[@$!%*?&]/, { message: "errorStaff.PasswordSpecial" }), // At least one special character
});
const CreateContact = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const category: { value: string; label: string }[] = [
    { value: "مسئول", label: "مسئول" },
    { value: "محامى", label: "محامى" },
    { value: "عميل", label: "عميل" },
  ];

  const { t, loading, error } = useTranslate();
  function onSubmit(data: z.infer<typeof schema>) {
    toast.message(JSON.stringify(data, null, 2));
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className=" !bg-[#dfc77d] hover:!bg-[#fef0be] text-black">
          {t("Create Staff")}
        </Button>
      </DialogTrigger>
      <DialogContent size="2xl" className="gap-3 h-auto">
        <DialogHeader className="p-0">
          <DialogTitle className="text-2xl font-bold text-default-700">
            {t("Create a New Staff")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="flex flex-row justify-between items-center  gap-4">
              <motion.div
                initial={{ y: -30 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1.7 }}
                className="flex flex-col gap-2 w-[48%]"
              >
                <Label
                  htmlFor="Name"
                  className={cn("", {
                    "text-destructive": errors.Name,
                  })}
                >
                  {t("userss")}
                </Label>
                <Input
                  id="Name"
                  type="text"
                  {...register("Name")}
                  placeholder={t("Enter User")}
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
                initial={{ y: -30 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1.7 }}
                className="flex flex-col gap-2 w-[48%]"
              >
                <Label
                  htmlFor="Email"
                  className={cn("", {
                    "text-destructive": errors.Email,
                  })}
                >
                  {t("Email Address")}
                </Label>
                <Input
                  id="Email"
                  type="text"
                  {...register("Email")}
                  placeholder={t("Enter email address")}
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
              </motion.div>
              <motion.div
                initial={{ y: -30 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1.7 }}
                className="flex flex-col gap-2 w-[48%]"
              >
                <Label
                  htmlFor="Password"
                  className={cn("", {
                    "text-destructive": errors.Password,
                  })}
                >
                  {t("Password")}
                </Label>
                <Input
                  type="Password"
                  {...register("Password")}
                  placeholder={t("Enter passowrd")}
                  className={cn("", {
                    "border-destructive focus:border-destructive":
                      errors.Password,
                  })}
                />
                {errors.Password && (
                  <p
                    className={cn("text-xs", {
                      "text-destructive": errors.Password,
                    })}
                  >
                    {t(errors.Password.message)}
                  </p>
                )}
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1.7 }}
                className="flex flex-col gap-2 w-[48%]"
              >
                <Label
                  htmlFor="phone"
                  className={cn("", {
                    "text-destructive": errors.phone,
                  })}
                >
                  {t("Phone Number")}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  {...register("phone")}
                  placeholder={t("Your phone number")}
                  className={cn("", {
                    "border-destructive focus:border-destructive": errors.phone,
                  })}
                />
                {errors.phone && (
                  <p
                    className={cn("text-xs", {
                      "text-destructive": errors.phone,
                    })}
                  >
                    {t(errors.phone.message)}
                  </p>
                )}
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1.7 }}
                className="flex flex-col gap-2 w-[48%]"
              >
                <Label
                  htmlFor="Category"
                  className={cn("", {
                    "text-destructive": errors.Category,
                  })}
                >
                  {t("Category")}
                </Label>
                <BasicSelect
                  name="Category"
                  menu={category}
                  control={control}
                  errors={errors}
                />
                {errors.Category && (
                  <p className="text-xs text-destructive">
                    {t(errors.Category.message)}
                  </p>
                )}{" "}
              </motion.div>
            </div>

            <motion.div
              initial={{ y: 30 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 1.7 }}
              className=" flex justify-center gap-3 mt-4"
            >
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
                {t("Create Staff")}{" "}
              </Button>
            </motion.div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateContact;
