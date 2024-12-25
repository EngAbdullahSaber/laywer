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
import { motion } from "framer-motion";

// Update the schema to validate date properly
const schema = z.object({
  Title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters." })
    .max(20, { message: "Title must not exceed 20 characters." }),

  Case_Status: z
    .string()
    .min(3, { message: "Title must be at least 3 characters." })
    .max(20, { message: "Title must not exceed 20 characters." }),
});

const TaskStatus = () => {
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

  const Case_Status: { value: string; label: string }[] = [
    { value: "Pending", label: "Pending" },
    { value: "Progress", label: "Progress" },
    { value: "Completed", label: "Completed" },
  ];
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
      <DialogContent size="md" className="gap-3 h-[60%] ">
        <DialogHeader className="p-0">
          <DialogTitle className="text-lg font-semibold text-default-700 ">
            Change Staus of Cases
          </DialogTitle>
        </DialogHeader>
        <div className="h-auto">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
              <motion.div
                initial={{ x: 50 }}
                whileInView={{ x: 0 }}
                transition={{ duration: 3 }}
                className="flex flex-col gap-2"
              >
                <Label htmlFor="Title">Change Case Status</Label>
                <BasicSelect menu={Case_Status} />{" "}
                {errors.Case_Status && (
                  <p className="text-xs text-destructive">
                    {errors.Case_Status.message}
                  </p>
                )}
              </motion.div>
            </div>

            {/* Submit Button inside form */}
            <div className="flex justify-center gap-3 mt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Change Staus</Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskStatus;
