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
import { useState } from "react";
import { Icon } from "@iconify/react";
import BasicSelect from "@/components/common/Select/BasicSelect";
import { useTranslate } from "@/config/useTranslation";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { motion } from "framer-motion";

// Update the schema to validate date properly
const schema = z.object({
  Title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters." })
    .max(20, { message: "Title must not exceed 20 characters." }),

  Case_Status: z.string().min(8, { message: "errorCourt.clientAddressMin" }),
});

const AssignCase = () => {
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

  return (
    <Dialog>
      <DialogTrigger>
        <Button
          size="icon"
          variant="outline"
          className=" h-7 w-7"
          color="secondary"
        >
          <Icon icon="fluent:status-32-regular" className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent size="md" className="gap-3 h-[50%] ">
        <DialogHeader className="p-0">
          <DialogTitle className="text-2xl font-bold text-default-700">
            {t("Assign Case To Lawyer")}
          </DialogTitle>
        </DialogHeader>
        <div className="h-auto">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
              <div className="flex flex-col gap-2">
                <motion.div
                  initial={{ y: -50 }}
                  whileInView={{ y: 0 }}
                  transition={{ duration: 1.7 }}
                  className="flex flex-row justify-between items-center"
                >
                  <div className="!w-[87%]" style={{ width: "87%" }}>
                    <Label htmlFor="Title" className="my-4">
                      {t("Select Lawyer")}
                    </Label>
                    <BasicSelect
                      name="Case_Status"
                      menu={Case_Status}
                      control={control}
                      errors={errors}
                    />
                    {errors.Case_Status && (
                      <p className="text-xs text-destructive">
                        {t(errors.Case_Status.message)}
                      </p>
                    )}{" "}
                  </div>
                  <Link href={"/lawyer"} className="w-[8%] mt-10">
                    <Icon
                      icon="gg:add"
                      width="24"
                      height="24"
                      color="#dfc77d"
                    />
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* Submit Button inside form */}
            <motion.div
              initial={{ y: 50 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 1.7 }}
              className="flex justify-center gap-3 mt-4"
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
                className="w-28 !bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
              >
                {t("Select Lawyer")}
              </Button>
            </motion.div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignCase;
