"use client";
import React from "react";
import { Icon } from "@iconify/react";
import { useTranslate } from "@/config/useTranslation";
import Flatpickr from "react-flatpickr";
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
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";
const schema = z.object({
  Name: z
    .string()
    .min(3, { message: "Court name must be at least 3 charecters." })
    .max(20, { message: "Court name must not exceed 20 characters." }),

  Court_Category: z
    .string()
    .min(8, { message: "Court Category must be at least 8 charecters." })
    .max(20, { message: "Court Category must not exceed 20 characters." }),
  Email: z
    .string()
    .min(8, { message: "Email Address must be at least 8 charecters." })
    .max(25, { message: "Email Address must not exceed 25 characters." }),
  Address: z
    .string()
    .min(8, {
      message: "Address must be at least 8 charecters.",
    })
    .max(25, {
      message: "Address must not exceed 25 characters.",
    }),
  Room_Number: z
    .string()
    .min(1, {
      message: "Room Number must be at least 1 charecters.",
    })
    .max(6, {
      message: "Room Number must not exceed 6 characters.",
    }),
  City: z
    .string()
    .min(1, {
      message: "City must be at least 1 charecters.",
    })
    .max(20, {
      message: "City must not exceed 6 characters.",
    }),
  Region: z
    .string()
    .min(1, {
      message: "Region must be at least 1 charecters.",
    })
    .max(20, {
      message: "Region must not exceed 6 characters.",
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

  function onSubmit(data: z.infer<typeof schema>) {
    toast.message(JSON.stringify(data, null, 2));
  }
  const Court_Category: { value: string; label: string }[] = [
    { value: "Family", label: "Family" },
    { value: "Criminal", label: "Criminal" },
    { value: "Civil", label: "Civil" },
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
            Create a New Court
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
                  Court Name
                </Label>
                <Input
                  type="text"
                  {...register("Name")}
                  placeholder="Enter Court Name"
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
                  htmlFor="Court_Category"
                  className={cn("", {
                    "text-destructive": errors.Court_Category,
                  })}
                >
                  Court Category Level
                </Label>
                <BasicSelect menu={Court_Category} />{" "}
                {errors.Court_Category && (
                  <p className="text-xs text-destructive">
                    {errors.Court_Category.message}
                  </p>
                )}
              </div>{" "}
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="Email "
                  className={cn("", {
                    "text-destructive": errors.Email,
                  })}
                >
                  Email
                </Label>
                <Input
                  type="text"
                  {...register("Name")}
                  placeholder="Enter Email "
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
                    {errors.Email.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="Address "
                  className={cn("", {
                    "text-destructive": errors.Address,
                  })}
                >
                  Address
                </Label>
                <Input
                  type="text"
                  {...register("Name")}
                  placeholder="Enter Address "
                  className={cn("", {
                    "border-destructive focus:border-destructive":
                      errors.Address,
                  })}
                />
                {errors.Address && (
                  <p
                    className={cn("text-xs", {
                      "text-destructive": errors.Address,
                    })}
                  >
                    {errors.Address.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="Room_Number"
                  className={cn("", {
                    "text-destructive": errors.Room_Number,
                  })}
                >
                  Room Number
                </Label>
                <Input
                  type="number"
                  {...register("Room_Number")}
                  placeholder="Enter Room Number "
                  className={cn("", {
                    "border-destructive focus:border-destructive":
                      errors.Room_Number,
                  })}
                />
                {errors.Room_Number && (
                  <p
                    className={cn("text-xs", {
                      "text-destructive": errors.Room_Number,
                    })}
                  >
                    {errors.Room_Number.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="Room_Number"
                  className={cn("", {
                    "text-destructive": errors.Room_Number,
                  })}
                >
                  Room Number
                </Label>
                <Input
                  type="number"
                  {...register("Room_Number")}
                  placeholder="Enter Room Number "
                  className={cn("", {
                    "border-destructive focus:border-destructive":
                      errors.Room_Number,
                  })}
                />
                {errors.Room_Number && (
                  <p
                    className={cn("text-xs", {
                      "text-destructive": errors.Room_Number,
                    })}
                  >
                    {errors.Room_Number.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="Region"
                  className={cn("", {
                    "text-destructive": errors.Region,
                  })}
                >
                  Region
                </Label>
                <Input
                  type="number"
                  {...register("Region")}
                  placeholder="Enter Room Number "
                  className={cn("", {
                    "border-destructive focus:border-destructive":
                      errors.Region,
                  })}
                />
                {errors.Region && (
                  <p
                    className={cn("text-xs", {
                      "text-destructive": errors.Region,
                    })}
                  >
                    {errors.Region.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="City"
                  className={cn("", {
                    "text-destructive": errors.City,
                  })}
                >
                  City
                </Label>
                <Input
                  type="number"
                  {...register("City")}
                  placeholder="Enter Room Number "
                  className={cn("", {
                    "border-destructive focus:border-destructive": errors.City,
                  })}
                />
                {errors.City && (
                  <p
                    className={cn("text-xs", {
                      "text-destructive": errors.City,
                    })}
                  >
                    {errors.City.message}
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
              <Button type="submit">Create Court</Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Edit;
