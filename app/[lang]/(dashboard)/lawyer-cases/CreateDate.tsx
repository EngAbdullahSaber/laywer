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

// Update the schema to validate date properly
const schema = z.object({
  Title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters." })
    .max(20, { message: "Title must not exceed 20 characters." }),

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

const CreateDate = () => {
  const {
    register,
    handleSubmit,
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
  const handleDateChange = (dates: Date[]) => {
    const selectedDate = dates[0] || null;
    setPicker(selectedDate);
    setValue("date", selectedDate ? selectedDate.toISOString() : ""); // Update react-hook-form state
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button
          size="icon"
          variant="outline"
          className=" h-7 w-7"
          color="secondary"
        >
          <Icon icon="ic:outline-add" className="h-4 w-4" />{" "}
        </Button>
      </DialogTrigger>
      <DialogContent size="md" className="gap-3 h-[60%] ">
        <DialogHeader className="p-0">
          <DialogTitle className="text-lg font-semibold text-default-700 ">
            Create New Date With Client
          </DialogTitle>
        </DialogHeader>
        <div className="h-auto">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="Title"
                  className={cn("", {
                    "text-destructive": errors.Title,
                  })}
                >
                  Title
                </Label>
                <Input
                  type="text"
                  {...register("Title")}
                  placeholder="Enter Title"
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
                    {errors.Title.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="date"
                  className={cn("", {
                    "text-destructive": errors.date,
                  })}
                >
                  Date
                </Label>
                <Flatpickr
                  className="w-full bg-background border border-default-200 focus:border-primary focus:outline-none h-10 rounded-md px-2 placeholder:text-default-600"
                  placeholder="Select Date"
                  value={picker}
                  onChange={handleDateChange}
                  id="default-picker"
                />
                {errors.date && (
                  <p className="text-xs text-destructive">
                    {errors.date.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button inside form */}
            <div className="flex justify-center gap-3 mt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Create Date</Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDate;
