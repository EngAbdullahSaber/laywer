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
import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import BasicSelect from "@/components/common/Select/BasicSelect";
import { useTranslate } from "@/config/useTranslation";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

// Update the schema to validate the message properly
const schema = z.object({
  message: z
    .string()
    .min(10, { message: "errorClientOrder.MessageMin" })
    .max(70, { message: "errorClientOrder.MessageMax" }),
});

const CreateDate = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue, // Add setValue to update the date field in react-hook-form
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  function onSubmit(data: z.infer<typeof schema>) {
    toast.message(JSON.stringify(data, null, 2));
  }

  // Handle Flatpickr change event and set value in react-hook-form
  const { t } = useTranslate();

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="!bg-[#dfc77d] hover:!bg-[#fef0be] text-black">
          {t("Ask")}
        </Button>
      </DialogTrigger>
      <DialogContent size="md" className="gap-3 h-auto">
        <DialogHeader className="p-0">
          <DialogTitle className="text-2xl font-bold text-default-700">
            {t("Send Your Message")}
          </DialogTitle>
        </DialogHeader>
        <div className="h-auto">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="message" className="my-4">
                  {t("Your Question")}
                </Label>
                <Textarea
                  {...register("message")} // Register textarea with react-hook-form
                  placeholder={t("Type Here")}
                  rows={3}
                  id="message"
                  className={cn(errors.message ? "border-red-300" : "")} // Add error styling if validation fails
                />
                {errors.message && (
                  <p className="text-sm text-red-300 mt-1">
                    {t(errors.message.message)}
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
                {t("Send")}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDate;
