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

const AppointmentDetails = () => {
  const { t } = useTranslate();
  const { lang } = useParams();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleSheet = () => {
    setIsOpen((prevState) => !prevState);
  };

  const renderAppointmentInfo = () => (
    <>
      <motion.li
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex flex-row !flex-nowrap justify-between items-center"
      >
        <span className="text-sm text-default-600 w-[35%]">
          {t("Appointment_Title")} :
        </span>
        <span className="text-default-900 font-semibold w-[62%]">TASK1</span>
      </motion.li>
      <motion.li
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-row !flex-nowrap justify-between items-center"
      >
        <span className="text-sm text-default-600 w-[35%]">{t("Date")} :</span>
        <span className="text-default-900 font-semibold w-[62%]">
          {" "}
          September 12, 2024
        </span>
      </motion.li>
      <motion.li
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9 }}
        className="flex flex-row !flex-nowrap justify-between items-center"
      >
        <span className="text-sm text-default-600 w-[35%]">{t("Time")} :</span>
        <span className="text-default-900 font-semibold w-[62%]">12:11 PM</span>
      </motion.li>
      <motion.li
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ duration: 1 }}
      >
        <span className="text-sm text-default-600 w-[35%]">
          {t("Case_Name")} :
        </span>
        <span className="text-default-900 font-semibold w-[62%]">Ahmed</span>
      </motion.li>
      <motion.li
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ duration: 1.1 }}
        className="flex flex-row !flex-nowrap justify-between items-center"
      >
        <span className="text-sm text-default-600 w-[35%]">
          {t("Location")} :
        </span>
        <span className="text-default-900 font-semibold w-[62%]">الرياض</span>
      </motion.li>
      <motion.li
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ duration: 1.2 }}
        className="flex flex-row !flex-nowrap justify-between items-center"
      >
        <span className="text-sm text-default-600 w-[35%]">
          {t("Client_Name")} :
        </span>
        <span className="text-default-900 font-semibold w-[62%]">Ali</span>
      </motion.li>
    </>
  );

  const renderDetailsList = () => (
    <>
      <motion.li
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ duration: 1.3 }}
        className="flex flex-row !flex-nowrap justify-between items-center"
      >
        <span className="text-sm text-default-600 w-[30%]">
          {t("Appointment Description")} :
        </span>
        <span className="text-default-900 font-semibold w-[67%]">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla,
          veritatis dolor obcaecati voluptas ullam commodi?
        </span>
      </motion.li>
      <motion.li
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ duration: 1.4 }}
        className="flex flex-row !flex-nowrap justify-between items-center"
      >
        <span className="text-sm text-default-600 w-[30%]">
          {t("Associated Case Details")} :
        </span>
        <span className="text-default-900 font-semibold w-[67%]">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla,
          veritatis dolor obcaecati voluptas ullam commodi?
        </span>
      </motion.li>
      <motion.li
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ duration: 1.5 }}
        className="flex flex-row !flex-nowrap justify-between items-center"
      >
        <span className="text-sm text-default-600 w-[30%]">
          {t("Preparation Required")} :
        </span>
        <span className="text-default-900 font-semibold w-[67%]">
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
            <p>{t("Appointment Details")}</p>
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
            <SheetTitle className="mt-5 pt-5 font-bold text-2xl">
              {t("Appointment Details")}
            </SheetTitle>
          </SheetHeader>

          <div className="py-6">
            <ul className="md:grid grid-cols-2 !mt-5 gap-2 space-y-2 md:space-y-0">
              {renderAppointmentInfo()}
            </ul>
            <motion.hr
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 1.1 }}
              className="my-8"
            />
            <ul className="md:grid grid-cols-1 !mt-5 gap-2 space-y-2 md:space-y-0">
              {renderDetailsList()}
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

export default AppointmentDetails;
