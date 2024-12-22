"use client";
import { Radio } from "@/components/common/atoms/Radio";
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
import { useTranslate } from "@/config/useTranslation";
import Link from "next/link";
import Flatpickr from "react-flatpickr";
const CreateContact = () => {
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
        <Button className="w-28 !bg-[#dfc77d] hover:!bg-[#fef0be] text-black">
          {t("Create Contact")}
        </Button>
      </DialogTrigger>
      <DialogContent size="2xl">
        <DialogHeader className="p-0">
          <DialogTitle className="text-base font-medium text-default-700 ">
            {t("Create a New Contact")}
          </DialogTitle>
        </DialogHeader>
        <div>
          <div className="h-[290px]">
            <ScrollArea className="h-full">
              <div className="sm:grid  sm:grid-cols-2 sm:gap-5 space-y-4 sm:space-y-0">
                <div className="flex flex-col gap-2">
                  <Label>{t("User Name")}</Label>
                  <Input type="text" placeholder={t("Enter User Name")} />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>{t("Email Address")}</Label>
                  <Input type="email" placeholder={t("Enter email address")} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>{t("Phone Number")}</Label>
                  <Input type="number" placeholder={t("Your phone number")} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label> {t("Category")}</Label>
                  <Input type="text" placeholder={t("Enter Category")} />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>{t("Select Gender")}</Label>
                  <Radio text1={"Female"} text2={"Male"} />
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
              className="w-28 !bg-[#dfc77d] hover:!bg-[#fef0be] text-black"
            >
              {t("Create Contact")}{" "}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateContact;
