"use client";
import React from "react";
import BasicSelect from "@/components/common/Select/BasicSelect";
import { Icon } from "@iconify/react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslate } from "@/config/useTranslation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import Flatpickr from "react-flatpickr";
import { useState } from "react";
const schema = z.object({
  Name: z
    .string()
    .min(3, { message: "Task name must be at least 3 charecters." })
    .max(20, { message: "Task name must not exceed 20 characters." }),

  Importance_Level: z
    .string()
    .min(8, { message: "Task Email must be at least 8 charecters." })
    .max(20, { message: "Task Email must not exceed 20 characters." }),
  Assigned_To: z
    .string()
    .min(8, { message: "Client Address must be at least 8 charecters." })
    .max(25, { message: "Client Address must not exceed 25 characters." }),
  Task_Status: z
    .string()
    .min(8, {
      message: "Client Current Case Name must be at least 8 charecters.",
    })
    .max(25, {
      message: "Client Current Case Name must not exceed 25 characters.",
    }),
  Case_Name: z
    .string()
    .min(8, {
      message: "Client Current Case Name must be at least 8 charecters.",
    })
    .max(25, {
      message: "Client Current Case Name must not exceed 25 characters.",
    }),
});

const Edit = () => {
  const { t, loading, error } = useTranslate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const [picker, setPicker] = useState<Date>(new Date());

  function onSubmit(data: z.infer<typeof schema>) {
    toast.message(JSON.stringify(data, null, 2));
  }
  const Importance_Level: { value: string; label: string }[] = [
    { value: "High", label: "High" },
    { value: "Meduim", label: "Meduim" },
    { value: "Low", label: "Low" },
  ];
  const Assigned_To: { value: string; label: string }[] = [
    { value: "Ahmed", label: "Ahmed" },
    { value: "Abdullah", label: "Abdullah" },
    { value: "Ali", label: "Ali" },
  ];
  const Task_Status: { value: string; label: string }[] = [
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
          <Icon icon="heroicons:pencil" className="h-4 w-4" />{" "}
        </Button>{" "}
      </DialogTrigger>

      <DialogContent size="2xl" className="gap-3 h-[70%] ">
        <DialogHeader className="p-0">
          <DialogTitle className="text-lg font-semibold text-default-700 ">
            Update Task
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
                  Lawyer Name
                </Label>
                <Input
                  type="text"
                  {...register("Name")}
                  placeholder="Enter Lawyer Name"
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
                    {errors.Name.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="Importance_Level"
                  className={cn("", {
                    "text-destructive": errors.Importance_Level,
                  })}
                >
                  Importance Level
                </Label>
                <BasicSelect menu={Importance_Level} />{" "}
                {errors.Importance_Level && (
                  <p className="text-xs text-destructive">
                    {errors.Importance_Level.message}
                  </p>
                )}
              </div>{" "}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="Assigned_To"
                  className={cn("", {
                    "text-destructive": errors.Assigned_To,
                  })}
                >
                  Assigned To
                </Label>
                <BasicSelect menu={Assigned_To} />{" "}
                {errors.Assigned_To && (
                  <p className="text-xs text-destructive">
                    {errors.Assigned_To.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="Case_Name"
                  className={cn("", {
                    "text-destructive": errors.Case_Name,
                  })}
                >
                  Case Name
                </Label>
                <Flatpickr
                  className="w-full bg-background border border-default-200 focus:border-primary focus:outline-none h-10 rounded-md px-2 placeholder:text-default-600"
                  placeholder="Enter Receipt Date"
                  value={picker}
                  onChange={(dates: Date[]) => {
                    setPicker(dates[0] || null);
                  }}
                />{" "}
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="Case_Name"
                  className={cn("", {
                    "text-destructive": errors.Case_Name,
                  })}
                >
                  Case Name
                </Label>
                <Input
                  type="text"
                  {...register("Case_Name")}
                  placeholder="Enter Case Name"
                  className={cn("", {
                    "border-destructive focus:border-destructive":
                      errors.Case_Name,
                  })}
                />
                {errors.Case_Name && (
                  <p
                    className={cn("text-xs", {
                      "text-destructive": errors.Case_Name,
                    })}
                  >
                    {errors.Case_Name.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="Task_Status"
                  className={cn("", {
                    "text-destructive": errors.Task_Status,
                  })}
                >
                  Task Status
                </Label>
                <BasicSelect menu={Task_Status} />{" "}
                {errors.Task_Status && (
                  <p className="text-xs text-destructive">
                    {errors.Task_Status.message}
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
              <Button type="submit">Update Task</Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Edit;
