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
import { Upload } from "lucide-react";
import { motion } from "framer-motion";
import ImageUploader from "../../(admin-managment)/lawyer/add/ImageUploader";

// Update the schema to validate date properly
const schema = z.object({
  message: z
    .string()
    .min(10, { message: "errorClientServices.MessageMin" })
    .max(70, { message: "errorClientServices.MessageMax" }),
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

  const [picker, setPicker] = useState<Date>(new Date());
  const flatpickrRef = useRef<Flatpickr | null>(null); // Create a ref to access Flatpickr

  useEffect(() => {
    // This will ensure that Flatpickr doesn't open on its own when the dialog is opened.
    if (flatpickrRef.current) {
      flatpickrRef.current.close();
    }
  }, []);
  function onSubmit(data: z.infer<typeof schema>) {
    toast.message(JSON.stringify(data, null, 2));
  }

  // Handle Flatpickr change event and set value in react-hook-form

  const Case_Status: { value: string; label: string }[] = [
    { value: "على", label: "على" },
    { value: "احمد", label: "احمد" },
    { value: "محمد", label: "محمد" },
    { value: "مصطفى", label: "احمد" },
  ];
  const { t, loading, error } = useTranslate();
  const handleDateChange = (dates: Date[]) => {
    const selectedDate = dates[0] || null;
    setPicker(selectedDate);
    setValue("date", selectedDate ? selectedDate.toISOString() : "");
  };
  return (
    <Dialog>
      <DialogTrigger>
        <Button className=" !bg-[#dfc77d] hover:!bg-[#fef0be] text-black">
          {t("Ask Services")}
        </Button>
      </DialogTrigger>
      <DialogContent size="md" className="gap-3 h-auto ">
        <DialogHeader className="p-0">
          <DialogTitle className="text-2xl font-bold text-default-700">
            {t("Ask Services")}
          </DialogTitle>
        </DialogHeader>
        <div className="h-auto">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
              <motion.div
                initial={{ y: -30 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1.2 }}
                className="flex flex-col gap-2"
              >
                <Label htmlFor="question" className="my-4">
                  {t("Your Describtion")}
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
                )}{" "}
              </motion.div>
              <motion.div
                initial={{ y: -30 }}
                whileInView={{ y: 0 }}
                transition={{ duration: 1.2 }}
                className="flex flex-col gap-2"
              >
                <Label>{t("Payment Receipt")}</Label>
                <ImageUploader />
              </motion.div>
            </div>

            {/* Submit Button inside form */}
            <div git initclassName="flex justify-center gap-3 mt-4">
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
                {t("Ask Services")}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDate;
