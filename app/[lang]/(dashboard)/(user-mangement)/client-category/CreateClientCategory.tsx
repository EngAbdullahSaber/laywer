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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useTranslate } from "@/config/useTranslation";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const schema = z.object({
  Name: z
    .string()
    .min(3, { message: "errorClientCategory.NameMin" })
    .max(20, { message: "errorClientCategory.NameMax" }),
  Description: z
    .string()
    .min(20, { message: "errorClientCategory.DescriptionMin" })
    .max(100, { message: "errorClientCategory.DescriptionMax" }),
});
const CreateClientCategory = ({ buttonShape }: { buttonShape: any }) => {
  const { t, loading, error } = useTranslate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  function onSubmit(data: z.infer<typeof schema>) {
    toast.message(JSON.stringify(data, null, 2));
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        {buttonShape ? (
          <Button className=" !bg-[#dfc77d] hover:!bg-[#fef0be] text-black">
            {" "}
            {t("Create Client Category")}
          </Button>
        ) : (
          <Button size="icon" className=" h-7 w-7 bg-transparent">
            {" "}
            <Icon icon="gg:add" width="24" height="24" color="#dfc77d" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent size="2xl" className="h-auto">
        <DialogHeader className="p-0">
          <DialogTitle className="text-2xl font-bold text-default-700">
            {t("Create a New Client Category")}
          </DialogTitle>
        </DialogHeader>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ScrollArea className="h-full">
              <div className="sm:grid   sm:gap-5 space-y-4 sm:space-y-0">
                <motion.div
                  initial={{ y: -30 }}
                  whileInView={{ y: 0 }}
                  transition={{ duration: 1.7 }}
                  className="flex flex-col gap-2"
                >
                  <Label
                    htmlFor="Name"
                    className={cn("", {
                      "text-destructive": errors.Name,
                    })}
                  >
                    {" "}
                    {t("Client Category Name")}
                  </Label>{" "}
                  <Input
                    id="Name"
                    placeholder={t("Enter Client Category Name")}
                    type="text"
                    {...register("Name")}
                    className={cn("", {
                      "border-destructive focus:border-destructive":
                        errors.Name,
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
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1.7 }}
                  className="flex flex-col gap-2"
                >
                  <Label
                    htmlFor="Description"
                    className={cn("", {
                      "text-destructive": errors.Description,
                    })}
                  >
                    {t("Description Of Client Category")}
                  </Label>{" "}
                  <Textarea
                    id="Description"
                    placeholder={t("Type Here")}
                    rows={7}
                    {...register("Description")}
                    className={cn("", {
                      "border-destructive focus:border-destructive":
                        errors.Description,
                    })}
                  />
                  {errors.Description && (
                    <p
                      className={cn("text-xs", {
                        "text-destructive": errors.Description,
                      })}
                    >
                      {t(errors.Description.message)}
                    </p>
                  )}{" "}
                </motion.div>
              </div>
            </ScrollArea>

            <motion.div
              initial={{ y: 30 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 1.7 }}
              className=" flex justify-center gap-3 mt-4"
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
                className=" !bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
              >
                {t("Create Client Category")}
              </Button>
            </motion.div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateClientCategory;
