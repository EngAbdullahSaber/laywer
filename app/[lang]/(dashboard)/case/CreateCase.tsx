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
import Flatpickr from "react-flatpickr";
import { useState } from "react";
import { Icon } from "@iconify/react";
const schema = z.object({
  Name: z
    .string()
    .min(3, { message: "Client name must be at least 3 characters." })
    .max(20, { message: "Client name must not exceed 20 characters." }),
  phone: z.string().refine((value) => value.length === 11, {
    message: "Phone number must be exactly 11 characters.",
  }),
  email: z
    .string()
    .min(8, { message: "Client Email must be at least 8 characters." })
    .max(20, { message: "Client Email must not exceed 20 characters." }),
  Address: z
    .string()
    .min(8, { message: "Client Address must be at least 8 characters." })
    .max(25, { message: "Client Address must not exceed 25 characters." }),
  case: z
    .string()
    .min(8, {
      message: "Client Current Case Name must be at least 8 characters.",
    })
    .max(25, {
      message: "Client Current Case Name must not exceed 25 characters.",
    }),
  password: z
    .string()
    .min(8, { message: "Client Password must be at least 8 characters." })
    .max(25, { message: "Client Password must not exceed 25 characters." }),
});

const CreateCase = () => {
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
  const [picker, setPicker] = useState<Date>(new Date());
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Case</Button>
      </DialogTrigger>
      <DialogContent size="2xl">
        <DialogHeader className="p-0">
          <DialogTitle className="text-lg font-semibold text-default-700 ">
            Create a New Case
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[100%]">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-2 px-3 gap-4">
              <div className="flex flex-col gap-2 my-2">
                <Label htmlFor="Client ">Client Selection</Label>
                <BasicSelect menu={category} />
              </div>
              <div className="flex flex-col gap-2 my-2">
                <Label htmlFor="category">Case Category </Label>
                <BasicSelect menu={category} />{" "}
              </div>
              <div className="flex flex-col gap-2 my-2">
                <Label htmlFor="category">Case Name </Label>
                <Input type="text" placeholder="Enter User Case Name" />
              </div>

              <div className="flex flex-col gap-2 my-2">
                <Label htmlFor="Court">Court Selection </Label>
                <BasicSelect menu={category} />
              </div>

              <div className="flex flex-col gap-2 my-2">
                <Label htmlFor="category">Court Category</Label>

                <BasicSelect menu={category} />
              </div>
              <div className="flex flex-col gap-2 my-2">
                <Label htmlFor="category">Status </Label>
                <Radio text1={"Plaintiff"} text2={"Defendant"} />
              </div>
              <div className="flex flex-col gap-2 my-2">
                <Label htmlFor="category">Opposing Party Name </Label>
                <Input type="text" placeholder="Enter Opposing Party Name" />
              </div>
              <div className="flex flex-col gap-2 my-2">
                <Label htmlFor="category">Lawyer Name</Label>
                <Input type="text" placeholder="Enter Lawyer Name" />
              </div>
              <div className="flex flex-col gap-2 my-2">
                <Label htmlFor="category">Case Number </Label>
                <Input type="number" placeholder="Enter Case Number" />
              </div>
              <div className="flex flex-col gap-2 my-2">
                <Label htmlFor="category">Lawyer Selection </Label>
                <BasicSelect menu={category} />
              </div>
              <div className="flex flex-col gap-2 my-2">
                <Label htmlFor="category">Receipt Date </Label>
                <Flatpickr
                  className="w-full bg-background border border-default-200 focus:border-primary focus:outline-none h-10 rounded-md px-2 placeholder:text-default-600"
                  placeholder="Enter Receipt Date"
                  value={picker}
                  onChange={(dates: Date[]) => {
                    setPicker(dates[0] || null);
                  }}
                />{" "}
              </div>
              <div className="flex flex-col gap-2 my-2">
                <Label htmlFor="category">Submission Date </Label>
                <Flatpickr
                  className="w-full bg-background border border-default-200 focus:border-primary focus:outline-none h-10 rounded-md px-2 placeholder:text-default-600"
                  placeholder="Enter Submission Date"
                  value={picker}
                  onChange={(dates: Date[]) => {
                    setPicker(dates[0] || null);
                  }}
                />{" "}
              </div>
              <div className="flex flex-col gap-2 my-2">
                <Label htmlFor="category">Judgment Date </Label>
                <Flatpickr
                  className="w-full bg-background border border-default-200 focus:border-primary focus:outline-none h-10 rounded-md px-2 placeholder:text-default-600"
                  placeholder="Enter Judgment  Date"
                  value={picker}
                  onChange={(dates: Date[]) => {
                    setPicker(dates[0] || null);
                  }}
                />{" "}
              </div>
              <div className="flex flex-col gap-2 my-2">
                <Label htmlFor="category">Hearing Date </Label>
                <Flatpickr
                  className="w-full bg-background border border-default-200 focus:border-primary focus:outline-none h-10 rounded-md px-2 placeholder:text-default-600"
                  placeholder="Enter Hearing   Date"
                  value={picker}
                  onChange={(dates: Date[]) => {
                    setPicker(dates[0] || null);
                  }}
                />{" "}
              </div>
            </div>
            <div className="grid grid-cols-1 px-3 my-2 lg:grid-cols-1 gap-4">
              <div className="flex flex-col gap-2 my-2">
                <Label htmlFor="category">Case Description </Label>
                <Textarea placeholder="Type Here.." rows={7} />
              </div>
            </div>
            {/* Submit Button inside form */}
            <div className="flex justify-center gap-3 mt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Create Client</Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCase;
