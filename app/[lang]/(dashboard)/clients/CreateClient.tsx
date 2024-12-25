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
import { toast } from "sonner";
import { useTranslate } from "@/config/useTranslation";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import { Radio } from "@/components/common/atoms/Radio";
import { ScrollArea } from "@/components/ui/scroll-area";

// Zod validation schema
const schema = z.object({
  Name: z
    .string()
    .min(3, { message: "error.clientNameMin" })
    .max(20, { message: "error.clientNameMax" }),
  phone: z.string().refine((value) => value.length === 11, {
    message: "error.phoneNumberLength",
  }),
  email: z
    .string()
    .min(8, { message: "error.clientEmailMin" })
    .max(25, { message: "error.clientEmailMax" }),
  Address: z
    .string()
    .min(8, { message: "error.clientAddressMin" })
    .max(35, { message: "error.clientAddressMax" }),
  Email: z
    .string()
    .min(8, { message: "error.clientEmailMin" })
    .max(35, { message: "error.clientEmailMax" }),
  rrole: z.string().min(8, { message: "error.clientAddressMin" }),
  case: z
    .string()
    .min(8, { message: "error.clientCaseMin" })
    .max(25, { message: "error.clientCaseMax" }),
  password: z
    .string()
    .min(8, { message: "error.clientPasswordMin" })
    .max(25, { message: "error.clientPasswordMax" }),
});

const CreateContact = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const { t } = useTranslate();

  function onSubmit(data: z.infer<typeof schema>) {
    toast.message(JSON.stringify(data, null, 2));
  }

  console.log(errors.rrole);
  return (
    <Dialog>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent size="2xl" className="gap-3 !h-[90%]">
        <DialogHeader className="p-0">
          <DialogTitle className="text-2xl font-bold text-default-700">
            {t("Create a New Client")}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full"></ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CreateContact;
