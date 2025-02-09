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
import { Icon } from "@iconify/react";
import { useTranslate } from "@/config/useTranslation";
import { Upload } from "lucide-react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import FileUploaderSingle from "./FileUploaderSingle";
// Update the schema to validate date properly
const schema = z.object({
  Title: z
    .string()
    .min(3, { message: "errorClientRequest.TitleMin" })
    .max(20, { message: "errorClientRequest.TitleMax" }),
});

const FileRequest = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue, // Add setValue to update the date field in react-hook-form
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  function onSubmit(data: z.infer<typeof schema>) {
    toast.message(JSON.stringify(data, null, 2));
  }
  const { t } = useTranslate();

  // Handle Flatpickr change event and set value in react-hook-form

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
                <Icon icon="fluent-mdl2:file-request" className="h-4 w-4" />{" "}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p> {t("Response to the lawyer")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent size="md" className="gap-3 h-auto ">
        <DialogHeader className="p-0">
          <DialogTitle className="text-lg font-semibold text-default-700 ">
            {t("Response to the lawyer")}
          </DialogTitle>
        </DialogHeader>
        <div className="h-auto">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
              <motion.div
                initial={{ y: -30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.5 }}
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
                  placeholder={t("Enter Title")}
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
                transition={{ duration: 1.5 }}
                className="flex flex-col gap-2 "
              >
                <FileUploaderSingle />
              </motion.div>
            </div>

            {/* Submit Button inside form */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.5 }}
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
                {t("Send Response")}
              </Button>
            </motion.div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileRequest;
