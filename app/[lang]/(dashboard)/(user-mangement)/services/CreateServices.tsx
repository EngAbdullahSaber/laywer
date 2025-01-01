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
import { useTranslate } from "@/config/useTranslation";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
const CreateLawyerCategory = ({ buttonShape }: { buttonShape: any }) => {
  const { t, loading, error } = useTranslate();

  return (
    <Dialog>
      <DialogTrigger asChild>
        {buttonShape ? (
          <Button className=" !bg-[#dfc77d] hover:!bg-[#fef0be] text-black">
            {" "}
            {t("Create Services")}
          </Button>
        ) : (
          <Button size="icon" className=" h-7 w-7 bg-transparent">
            {" "}
            <Icon icon="gg:add" width="24" height="24" color="#dfc77d" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent size="2xl" className="h-[75%]">
        <DialogHeader className="p-0">
          <DialogTitle className="text-2xl font-bold text-default-700">
            {t("Create a New Services")}
          </DialogTitle>
        </DialogHeader>
        <div>
          <div className="h-[290px]">
            <ScrollArea className="h-full">
              <div className="sm:grid   sm:gap-5 space-y-4 sm:space-y-0">
                <motion.div
                  initial={{ y: -50 }}
                  whileInView={{ y: 0 }}
                  transition={{ duration: 1.7 }}
                  className="flex flex-col gap-2"
                >
                  <Label>{t("Services Name")}</Label>
                  <Input type="text" placeholder={t("Enter Services Name")} />
                </motion.div>
                <motion.div
                  initial={{ y: -50 }}
                  whileInView={{ y: 0 }}
                  transition={{ duration: 1.7 }}
                  className="flex flex-col gap-2"
                >
                  <Label>{t("Price")}</Label>
                  <Input type="number" placeholder={t("Enter Price")} />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 1.7 }}
                  className="flex flex-col gap-2"
                >
                  <Label>{t("Services Describtion")}</Label>
                  <Textarea placeholder={t("Type Here")} rows={7} />
                </motion.div>
              </div>
            </ScrollArea>
          </div>

          <motion.div
            initial={{ y: 50 }}
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
              type="button"
              className=" !bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
            >
              {t("Create Services")}
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLawyerCategory;
