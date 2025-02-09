"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Icon } from "@iconify/react";
import { useTranslate } from "@/config/useTranslation";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const View = () => {
  const { t } = useTranslate();
  const { lang } = useParams();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleSheet = () => {
    setIsOpen((prevState) => !prevState);
  };

  const renderInfoItem = (
    label: string,
    value: string,
    animationDelay: number
  ) => (
    <motion.li
      initial={{ y: 50 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 + animationDelay }}
      className="flex flex-row !flex-nowrap justify-between items-center"
    >
      <span className="text-sm text-default-600 w-[35%]">{label} :</span>
      <span className="text-default-900 font-semibold w-[62%]">{value}</span>
    </motion.li>
  );

  const renderTaskDetails = () => (
    <>
      {renderInfoItem(t("Task Name"), "Task 1", 0)}
      {renderInfoItem(t("Case Name"), "Abdullah", 0.1)}
      {renderInfoItem(t("Importance Level"), "مهمة جدا", 0.2)}
      {renderInfoItem(t("Due Date"), "September 12, 2024 12:11 PM", 0.3)}
      {renderInfoItem(t("Task Status"), "قيدالانتظار", 0.4)}
    </>
  );

  const renderDescription = () => (
    <>
      <motion.li
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ duration: 1.1 }}
        className="flex flex-row !flex-nowrap justify-between items-center"
      >
        <span className="text-sm text-default-600 w-[35%]">
          {t("Task Description")} :
        </span>
        <span className="text-default-900 font-semibold w-[62%]">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla,
          veritatis dolor obcaecati voluptas ullam commodi?
        </span>
      </motion.li>
      <motion.li
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ duration: 1.2 }}
        className="flex flex-row !flex-nowrap justify-between items-center"
      >
        <span className="text-sm text-default-600 w-[35%]">
          {t("Associated Case Details")} :
        </span>
        <span className="text-default-900 font-semibold w-[62%]">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla,
          veritatis dolor obcaecati voluptas ullam commodi?
        </span>
      </motion.li>
    </>
  );

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button
              size="icon"
              variant="outline"
              className="h-7 w-7"
              color="secondary"
              onClick={toggleSheet}
            >
              <Icon icon="heroicons:eye" className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("Task Details")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Sheet open={isOpen} onOpenChange={toggleSheet}>
        <SheetTrigger asChild />
        <SheetContent
          side={lang === "ar" ? "left" : "right"}
          dir={lang === "ar" ? "rtl" : "ltr"}
          className="max-w-[736px]"
        >
          <SheetHeader>
            <SheetTitle>{t("Task Details")}</SheetTitle>
          </SheetHeader>

          <div className="py-6">
            <ul className="md:grid grid-cols-2 !mt-5 gap-2 space-y-2 md:space-y-0">
              {renderTaskDetails()}
            </ul>

            <hr className="my-8" />

            <ul className="md:grid grid-cols-1 !mt-5 gap-2 space-y-2 md:space-y-0">
              {renderDescription()}
            </ul>
          </div>

          <SheetFooter>
            <SheetClose asChild />
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default View;
