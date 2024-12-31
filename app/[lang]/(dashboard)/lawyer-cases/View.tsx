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

const View = () => {
  const { t, loading, error } = useTranslate();
  const { lang } = useParams();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className=" h-7 w-7"
          color="secondary"
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
          <SheetTitle className="mt-5 pt-5 font-bold text-2xl">
            {t("Case Details")}
          </SheetTitle>
        </SheetHeader>
        <div className="py-6" dir={lang === "ar" ? "rtl" : "ltr"}>
          <ul className="md:grid grid-cols-2  !mt-5 gap-2 space-y-2 md:space-y-0">
            <motion.li
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-sm text-default-600 ">
                {t("Case Name")} :{" "}
              </span>{" "}
              <span className="text-default-900 font-semibold "> Ahmed</span>
            </motion.li>
            <motion.li
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="text-sm text-default-600 ">
                {t("Case Status")} :{" "}
              </span>
              <span className="text-default-900 font-semibold "> Pending</span>
            </motion.li>
            <motion.li
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-sm text-default-600 ">
                {t("Client Name")} :{" "}
              </span>{" "}
              <span className="text-default-900 font-semibold "> mohamed</span>
            </motion.li>
            <motion.li
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9 }}
            >
              <span className="text-sm text-default-600 ">
                {t("Court Name")} :{" "}
              </span>{" "}
              <span className="text-default-900 font-semibold "> Court 1</span>
            </motion.li>
            <motion.li
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 1 }}
            >
              <span className="text-sm text-default-600 ">
                {t("Case Number")} :{" "}
              </span>{" "}
              <span className="text-default-900 font-semibold "> 21231</span>
            </motion.li>
            <motion.li
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 1.1 }}
            >
              <span className="text-sm text-default-600 ">Appointment </span>{" "}
              <span className="text-default-900 font-semibold ">
                {" "}
                September 12, 2024 12:11 PM
              </span>
            </motion.li>
            <motion.li
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 1.2 }}
            >
              <span className="text-sm text-default-600 ">{t("Date")} : </span>{" "}
              <span className="text-default-900 font-semibold ">
                {" "}
                September 12, 2024 12:11 PM
              </span>
            </motion.li>
            <motion.li
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 1.3 }}
            >
              <span className="text-sm text-default-600 ">
                {t("Address")} :{" "}
              </span>{" "}
              <span className="text-default-900 font-semibold "> الرياض</span>
            </motion.li>
          </ul>
          <hr className="my-8" />
          <ul className="md:grid grid-cols-1  !mt-5 gap-2 space-y-2 md:space-y-0">
            <motion.li
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 1.4 }}
              className="flex flex-row justify-between items-center"
            >
              <span className="text-sm text-default-600  w-[30%]">
                {t("Task Description")} :{" "}
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
              transition={{ duration: 1.3 }}
              className="flex flex-row justify-between items-center"
            >
              <span className="text-sm text-default-600  w-[30%] ">
                {t("Case follow-up report")} :
              </span>{" "}
              <span className="text-blue-700 font-semibold  w-[67%]">
                {" "}
                {t("show file")}
              </span>
            </motion.li>
            <motion.li
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 1.3 }}
              className="flex flex-row justify-between items-center"
            >
              <span className="text-sm text-default-600  w-[30%]">
                {t("Report of attendance at a judicial hearing")} :
              </span>{" "}
              <span className="text-blue-700 font-semibold  w-[67%] ">
                {" "}
                {t("show file")}
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
