"use client";
import BasicSelect from "@/components/common/Select/BasicSelect";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Radio } from "@/components/common/atoms/Radio";

const schema = z.object({
  Name: z
    .string()
    .min(3, { message: "Client name must be at least 3 charecters." })
    .max(20, { message: "Client name must not exceed 20 characters." }),
  phone: z.string().refine((value) => value.length === 11, {
    message: "Phone number must be exactly 11 characters.",
  }),
  email: z
    .string()
    .min(8, { message: "Client Email must be at least 8 charecters." })
    .max(20, { message: "Client Email must not exceed 20 characters." }),
  Address: z
    .string()
    .min(8, { message: "Client Address must be at least 8 charecters." })
    .max(25, { message: "Client Address must not exceed 25 characters." }),
  case: z
    .string()
    .min(8, {
      message: "Client Current Case Name must be at least 8 charecters.",
    })
    .max(25, {
      message: "Client Current Case Name must not exceed 25 characters.",
    }),
  password: z
    .string()
    .min(8, {
      message: "Client Current Case Name must be at least 8 charecters.",
    })
    .max(25, {
      message: "Client Current Case Name must not exceed 25 characters.",
    }),
});

const CreateLawyer = () => {
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
  const category: { value: string; label: string }[] = [
    { value: "Admin", label: "Admin" },
    { value: "S Admin", label: "S Admin" },
    { value: "Client", label: "Client" },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Lawyer</Button>
      </DialogTrigger>
      <DialogContent size="2xl" className="gap-3 h-[70%] ">
        <DialogHeader className="p-0">
          <DialogTitle className="text-lg font-semibold text-default-700 ">
            Create a New Lawyer
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
                  htmlFor="phone"
                  className={cn("", {
                    "text-destructive": errors.phone,
                  })}
                >
                  Mobile Number
                </Label>
                <Input
                  type="number"
                  placeholder="Enter Client Mobile Number"
                  {...register("phone")}
                  className={cn("", {
                    "border-destructive focus:border-destructive": errors.phone,
                  })}
                />
                {errors.phone && (
                  <p className="text-xs text-destructive">
                    {errors.phone.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="Address"
                  className={cn("", {
                    "text-destructive": errors.Address,
                  })}
                >
                  Client Address
                </Label>
                <Input
                  type="text"
                  {...register("Address")}
                  placeholder="Enter Client Address"
                  className={cn("", {
                    "border-destructive focus:border-destructive":
                      errors.Address,
                  })}
                />
                {errors.Address && (
                  <p className="text-xs text-destructive">
                    {errors.Address.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="email"
                  className={cn("", {
                    "text-destructive": errors.email,
                  })}
                >
                  Email
                </Label>
                <Input
                  type="email"
                  {...register("email")}
                  placeholder="Enter Email"
                  className={cn("", {
                    "border-destructive focus:border-destructive": errors.email,
                  })}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="password"
                  className={cn("", {
                    "text-destructive": errors.password,
                  })}
                >
                  Password
                </Label>
                <Input
                  type="password"
                  {...register("password")}
                  placeholder="Enter Password"
                  className={cn("", {
                    "border-destructive focus:border-destructive":
                      errors.password,
                  })}
                />
                {errors.password && (
                  <p className="text-xs text-destructive">
                    {errors.password.message}
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
              <Button type="submit">Create Lawyer</Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLawyer;
