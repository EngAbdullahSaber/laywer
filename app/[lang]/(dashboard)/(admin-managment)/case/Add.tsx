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
import { useTranslate } from "@/config/useTranslation";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// Update the schema to validate date properly
const schema = z.object({
  Title: z
    .string()
    .min(3, { message: "errorCase.caseTitleMin" })
    .max(20, { message: "errorCase.caseTitleMin" }),

  date: z
    .string()
    .min(1, { message: "Date is required." })
    .refine(
      (value) => {
        // Check if the value is a valid date format
        const date = new Date(value);
        return !isNaN(date.getTime());
      },
      {
        message: "Please select a valid date.",
      }
    ),
});

const Add = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const [picker, setPicker] = useState<Date>(new Date());
  const { t } = useTranslate();

  function onSubmit(data: z.infer<typeof schema>) {
    toast.message(JSON.stringify(data, null, 2));
  }

  const handleDateChange = (dates: Date[]) => {
    const selectedDate = dates[0] || null;
    setPicker(selectedDate);
    setValue("date", selectedDate ? selectedDate.toISOString() : "");
  };

  return (
    <Dialog>
      <DialogTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button
                size="icon"
                variant="outline"
                className="h-7 w-7"
                color="secondary"
              >
                <Icon icon="ic:outline-add" className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p> {t("Create New Date With Client")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent size="md" className="gap-3 h-auto">
        <DialogHeader className="p-0">
          <DialogTitle className="text-2xl font-bold text-default-700">
            {t("Create New Date With Client")}
          </DialogTitle>
        </DialogHeader>
        <div className="h-auto">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
              <motion.div
                initial={{ y: -30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.7 }}
                className="flex flex-col gap-2"
              >
                <Label
                  htmlFor="Title"
                  className={cn("", {
                    "text-destructive": errors.Title,
                  })}
                >
                  {t("Title")}
                </Label>
                <Input
                  type="text"
                  {...register("Title")}
                  placeholder={t("Enter Title About Date")}
                  className={cn("", {
                    "border-destructive focus:border-destructive": errors.Title,
                  })}
                />
                {errors.Title && (
                  <p
                    className={cn("text-xs", {
                      "text-destructive": errors.Title,
                    })}
                  >
                    {t(errors.Title.message)}
                  </p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 1.7 }}
                className="flex flex-col gap-2"
              >
                <Label
                  htmlFor="date"
                  className={cn("", {
                    "text-destructive": errors.date,
                  })}
                >
                  {t("Date")}
                </Label>
                <Flatpickr
                  className="w-full bg-background border border-default-200 focus:border-primary focus:outline-none h-10 rounded-md px-2 placeholder:text-default-600"
                  placeholder={t("Select Date About Meeting")}
                  value={picker}
                  onChange={handleDateChange}
                  options={{
                    clickOpens: true,
                    static: true,
                    appendTo: document.body,
                  }}
                  onClick={(e) => e.preventDefault()}
                  id="default-picker"
                />
                {errors.date && (
                  <p className="text-xs text-destructive">
                    {t(errors.date.message)}
                  </p>
                )}
              </motion.div>
            </div>

            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
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
                {t("Create Date")}
              </Button>
            </motion.div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Add;
