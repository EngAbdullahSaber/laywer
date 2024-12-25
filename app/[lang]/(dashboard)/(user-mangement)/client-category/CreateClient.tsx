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
import Link from "next/link";
import Flatpickr from "react-flatpickr";
const CreateClient = ({ buttonShape }: { buttonShape: any }) => {
  const gender: { value: string; label: string }[] = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
  ];
  const category: { value: string; label: string }[] = [
    { value: "Admin", label: "Admin" },
    { value: "S Admin", label: "S Admin" },
    { value: "Client", label: "Client" },
  ];
  const { t, loading, error } = useTranslate();

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
      <DialogContent size="2xl" className="h-[75%]">
        <DialogHeader className="p-0">
          <DialogTitle className="text-2xl font-bold text-default-700">
            {t("Create a New Client Category")}
          </DialogTitle>
        </DialogHeader>
        <div>
          <div className="h-[290px]">
            <ScrollArea className="h-full">
              <div className="sm:grid   sm:gap-5 space-y-4 sm:space-y-0">
                <div className="flex flex-col gap-2">
                  <Label>{t("Name")}</Label>
                  <Input type="text" placeholder={t("Enter Client Name")} />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>{t("Description")}</Label>
                  <Textarea placeholder={t("Type Here")} rows={7} />
                </div>
              </div>
            </ScrollArea>
          </div>

          <div className=" flex justify-center gap-3 mt-4">
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
              {t("Create Client Category")}{" "}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateClient;
