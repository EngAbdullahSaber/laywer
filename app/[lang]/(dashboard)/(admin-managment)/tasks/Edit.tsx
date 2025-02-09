"use client";
import BasicSelect from "@/components/common/Select/BasicSelect";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
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
import { useTranslate } from "@/config/useTranslation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
const schema = z.object({
  Name: z
    .string()
    .min(3, { message: "errorTask.TaskNameMin" })
    .max(20, { message: "errorTask.TaskNameMax" }),
  Case_Name: z
    .string()
    .min(8, {
      message: "errorTask.CaseNameMin",
    })
    .max(25, {
      message: "errorTask.CaseNameMax",
    }),

  AssignedTo: z.string().min(8, { message: "errorTask.clientAddressMin" }),
  ImportanceLevel: z.string().min(8, { message: "errorTask.clientAddressMin" }),
  TaskStatus: z.string().min(8, { message: "errorTask.clientAddressMin" }),
});

const Edit = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const [picker, setPicker] = useState<Date>(new Date());
  const { t, loading, error } = useTranslate();

  function onSubmit(data: z.infer<typeof schema>) {
    toast.message(JSON.stringify(data, null, 2));
  }
  const Importance_Level: { value: string; label: string }[] = [
    { value: "مهمة جدا", label: "مهمة جدا" },
    { value: "متوسطة الاهمية", label: "متوسطة الاهمية" },
    { value: "ذات اهمية ضعيفة", label: "ذات اهمية ضعيفة" },
  ];
  const Assigned_To: { value: string; label: string }[] = [
    { value: "احمد محمد", label: "احمد محمد" },
    { value: "فهد عبدالله", label: "فهد عبدالله" },
    { value: "محمد على احمد", label: "محمد على احمد" },
  ];
  const Task_Status: { value: string; label: string }[] = [
    { value: "قيدالانتظار", label: "قيدالانتظار" },
    { value: "قيد التنفيذ", label: "قيد التنفيذ" },
    { value: "قيد التنفيذ", label: "قيد التنفيذ" },
  ];
  const Case_Name: { value: string; label: string }[] = [
    { value: "القضية 1", label: "القضية 1" },
    { value: "القضية 2", label: "القضية 2" },
    { value: "القضية 3", label: "القضية 3" },
  ];
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
                className=" h-7 w-7"
                color="secondary"
              >
                <Icon icon="heroicons:pencil" className="h-4 w-4" />{" "}
              </Button>{" "}
            </TooltipTrigger>
            <TooltipContent>
              <p> {t("Edit Task")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent size="2xl" className="gap-3 h-[70%] ">
        <DialogHeader className="p-0">
          <DialogTitle className="text-2xl font-bold text-default-700">
            {t("Edit Task")}
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
                  {t("Task Name")}
                </Label>
                <Input
                  type="text"
                  {...register("Name")}
                  placeholder={t("Enter Task Name")}
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
                  htmlFor="Importance_Level"
                  className={cn("", {
                    "text-destructive": errors.Importance_Level,
                  })}
                >
                  {t("Importance Level")}
                </Label>

                <BasicSelect
                  name="ImportanceLevel"
                  menu={Importance_Level}
                  control={control}
                  errors={errors}
                />
                {errors.ImportanceLevel && (
                  <p className="text-xs text-destructive">
                    {t(errors.ImportanceLevel.message)}
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
                  {t("Assigned To")}
                </Label>
                <BasicSelect
                  name="AssignedTo"
                  menu={Assigned_To}
                  control={control}
                  errors={errors}
                />
                {errors.AssignedTo && (
                  <p className="text-xs text-destructive">
                    {t(errors.AssignedTo.message)}
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
                  {t("Due Date")}
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
                  {t("Case Name")}
                </Label>
                <BasicSelect
                  name="Case_Name"
                  menu={Case_Name}
                  control={control}
                  errors={errors}
                />
                {errors.TaskStatus && (
                  <p className="text-xs text-destructive">
                    {t(errors.Case_Name.message)}
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
                  {t("Task Status")}
                </Label>

                <BasicSelect
                  name="TaskStatus"
                  menu={Task_Status}
                  control={control}
                  errors={errors}
                />
                {errors.TaskStatus && (
                  <p className="text-xs text-destructive">
                    {t(errors.TaskStatus.message)}
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
                {t("Edit Task")}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Edit;
