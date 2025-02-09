"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Icon } from "@iconify/react";
import { useTranslate } from "@/config/useTranslation";
import { useParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";

// A reusable component to display a list of details
const DetailItem: React.FC<{
  label: string;
  value: string | number;
  className?: string;
}> = ({ label, value, className = "" }) => (
  <li className="flex flex-row gap-6 items-center">
    <span className="text-sm text-default-900 font-medium w-[52%]">
      {label}:
    </span>
    <span className={`text-default-500 font-semibold w-[40%] ${className}`}>
      {value}
    </span>
  </li>
);

const View = () => {
  const { t } = useTranslate();
  const { lang } = useParams();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleSheet = () => setIsOpen((prevState) => !prevState);

  // Task details to be displayed in the sheet
  const taskDetails = [
    { label: t("Task Name"), value: "Task 1" },
    {
      label: t("Importance Level"),
      value: "High",
      className: "text-warning-700",
    },
    { label: t("Assigned To"), value: "Ahmed" },
    { label: t("Due Date"), value: "September 12, 2024 12:11 PM" },
    { label: t("Case Name"), value: "Abdullah" },
    {
      label: t("Task Status"),
      value: "Progress",
      className: "text-success-700",
    },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="h-7 w-7"
          color="secondary"
          onClick={toggleSheet}
        >
          <Icon icon="heroicons:eye" className="h-4 w-4" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side={lang === "ar" ? "left" : "right"}
        dir={lang === "ar" ? "rtl" : "ltr"}
        className="max-w-[736px]"
      >
        <SheetHeader>
          <SheetTitle>{t("Task Details")}</SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[100%]">
          <div className="py-6">
            <ul className="md:grid grid-cols-2 !mt-5 gap-2 space-y-2 md:space-y-0">
              {taskDetails.map((detail, index) => (
                <DetailItem
                  key={index}
                  label={detail.label}
                  value={detail.value}
                  className={detail.className}
                />
              ))}
            </ul>
          </div>
        </ScrollArea>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">{t("Close")}</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default View;
