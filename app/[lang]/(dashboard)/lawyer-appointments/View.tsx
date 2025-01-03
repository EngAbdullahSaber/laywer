"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
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
  const { t, loading, error } = useTranslate();
  const { lang } = useParams();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button
                size="icon"
                variant="outline"
                className=" h-7 w-7"
                color="secondary"
              >
                <Icon icon="heroicons:eye" className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p> {t("Appointment Details")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </SheetTrigger>
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
          <ul className="md:grid grid-cols-2  !mt-5 gap-2 space-y-2 md:space-y-0">
            <motion.li
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="text-sm text-default-600 ">
                {t("Appointment_Title")} :
              </span>{" "}
              <span className="text-default-900 font-semibold "> TASK1</span>
            </motion.li>
            <motion.li
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-sm text-default-600 ">{t("Date")} : </span>{" "}
              <span className="text-default-900 font-semibold ">
                {" "}
                September 12, 2024
              </span>
            </motion.li>
            <motion.li
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9 }}
            >
              <span className="text-sm text-default-600 ">{t("Time")} : </span>
              <span className="text-warning-700 "> 12:11 PM</span>
            </motion.li>

            <motion.li
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 1 }}
            >
              <span className="text-sm text-default-600 ">
                {t("Case_Name")} :
              </span>{" "}
              <span className="text-default-900 font-semibold "> Ahmed</span>
            </motion.li>

            <motion.li
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 1.1 }}
            >
              <span className="text-sm text-default-600 ">
                {t("Location")} :
              </span>{" "}
              <span className="text-default-900 font-semibold "> الرياض</span>
            </motion.li>
            <motion.li
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 1.2 }}
            >
              <span className="text-sm text-default-600 ">
                {t("Client_Name")} :
              </span>{" "}
              <span className="text-default-900 font-semibold "> Ali</span>
            </motion.li>
          </ul>
          <motion.hr
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ duration: 1.1 }}
            className="my-8"
          />
          <ul className="md:grid grid-cols-1  !mt-5 gap-2 space-y-2 md:space-y-0">
            <motion.li
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 1.3 }}
              className="flex flex-row justify-between items-center"
            >
              <span className="text-sm text-default-600  w-[30%]">
                {t("Appointment Description")} :{" "}
              </span>{" "}
              <span className="text-default-900 font-semibold w-[67%]">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nulla,
                veritatis dolor obcaecati voluptas ullam commodi? Perferendis
                quae doloribus unde commodi voluptates totam magni fugit
                architecto, veritatis iusto? Nulla, doloremque. Corporis.
              </span>
            </motion.li>
            <motion.li
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 1.4 }}
              className="flex flex-row justify-between items-center"
            >
              <span className="text-sm text-default-600  w-[30%]">
                {t("Associated Case Details")} :
              </span>{" "}
              <span className="text-default-900 font-semibold w-[67%]">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nulla,
                veritatis dolor obcaecati voluptas ullam commodi? Perferendis
                quae doloribus unde commodi voluptates totam magni fugit
                architecto, veritatis iusto? Nulla, doloremque. Corporis.
              </span>
            </motion.li>
            <motion.li
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 1.5 }}
              className="flex flex-row justify-between items-center"
            >
              <span className="text-sm text-default-600  w-[30%]">
                {t("Preparation Required")} :
              </span>{" "}
              <span className="text-default-900 font-semibold w-[67%]">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nulla,
                veritatis dolor obcaecati voluptas ullam commodi? Perferendis
                quae doloribus unde commodi voluptates totam magni fugit
                architecto, veritatis iusto? Nulla, doloremque. Corporis.
              </span>
            </motion.li>
          </ul>
        </div>
        <SheetFooter>
          <SheetClose asChild>footer content</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default View;
