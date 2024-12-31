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
        <div className="py-6">
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
                {t("Category")} :{" "}
              </span>
              <span className="text-default-900 font-semibold "> Admin</span>
            </motion.li>
            <motion.li
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-sm text-default-600 ">
                {t("Next Appointment Date")} :
              </span>{" "}
              <span className="text-default-900 font-semibold ">
                {" "}
                12/03/2004
              </span>
            </motion.li>
            <motion.li
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9 }}
            >
              <span className="text-sm text-default-600 ">
                {t("Status")} :{" "}
              </span>{" "}
              <span className="text-default-900 font-semibold "> Criminal</span>
            </motion.li>
            <motion.li
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 1 }}
            >
              <span className="text-sm text-default-600 ">
                {t("Case Date")} :
              </span>{" "}
              <span className="text-default-900 font-semibold ">
                {" "}
                12/03/2004
              </span>
            </motion.li>
            <motion.li
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 1.1 }}
            >
              <span className="text-sm text-default-600 ">
                {t("main_case_number")} :
              </span>{" "}
              <span className="text-default-900 font-semibold "> 15546</span>
            </motion.li>
            <motion.li
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 1.2 }}
            >
              <span className="text-sm text-default-600 ">
                {t("secondary_case_number")} :
              </span>{" "}
              <span className="text-default-900 font-semibold "> 435345 </span>
            </motion.li>
            <motion.li
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 1.3 }}
            >
              <span className="text-sm text-default-600 ">
                {t("Description")} :
              </span>{" "}
              <span className="text-default-900 font-semibold ">
                {" "}
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Sapiente, natus.
              </span>
            </motion.li>
            <motion.li
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 1.3 }}
            >
              <span className="text-sm text-default-600 ">
                {t("Case follow-up report")} :
              </span>{" "}
              <span className="text-blue-700 font-semibold ">
                {" "}
                {t("show file")}
              </span>
            </motion.li>
          </ul>
          <motion.hr
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="my-8"
          />
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="font-semibold  text-lg my-3"
          >
            {t("Client Information")}
          </motion.h3>
          <ul className="md:grid grid-cols-2  !mt-5 gap-2 space-y-2 md:space-y-0">
            <motion.li
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 1.1 }}
            >
              <span className="text-sm text-default-600 ">{t("Name")} : </span>{" "}
              <span className="text-default-900 font-semibold "> Ahmed</span>
            </motion.li>
            <motion.li
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 1.2 }}
            >
              <span className="text-sm text-default-600 ">
                {t("Phone Number")} :{" "}
              </span>{" "}
              <span className="text-default-900 font-semibold">
                011223344555
              </span>
            </motion.li>
            <motion.li
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 1.3 }}
              className="col-span-2"
            >
              <span className="text-sm text-default-600 ">
                {t("Email Address")} :{" "}
              </span>{" "}
              <span className="text-default-900 font-semibold ">
                {" "}
                abc@gmail.com
              </span>
            </motion.li>
            <motion.li
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 1.4 }}
            >
              <span className="text-sm text-default-600 ">
                {t("Address")} :
              </span>{" "}
              <span className="text-default-900 font-semibold "> الرياض </span>
            </motion.li>
          </ul>
          <motion.hr
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="my-8"
          />
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="font-semibold  text-lg my-3"
          >
            {t("Court Details")}
          </motion.h3>

          <ul className="md:grid grid-cols-2  !mt-5 gap-2 space-y-2 md:space-y-0">
            <motion.li
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 1.5 }}
            >
              <span className="text-sm text-default-600 ">
                {t("Court Name")} :{" "}
              </span>{" "}
              <span className="text-default-900 font-semibold ">
                {" "}
                Riyadh Court
              </span>
            </motion.li>
            <motion.li
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 1.6 }}
            >
              <span className="text-sm text-default-600 ">
                {t("Room Number")} :{" "}
              </span>
              <span className="text-default-900 font-semibold ">22</span>
            </motion.li>
            <motion.li
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 1.7 }}
            >
              <span className="text-sm text-default-600 ">
                {t("Address")} :{" "}
              </span>{" "}
              <span className="text-default-900 font-semibold ">
                {" "}
                Saudi Arabia ,Riyadh
              </span>
            </motion.li>
            <motion.li
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 1.8 }}
            >
              <span className="text-sm text-default-600 ">
                {t("Court Category")} :
              </span>{" "}
              <span className="text-default-900 font-semibold"> Criminals</span>
            </motion.li>
            <motion.li
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 1.3 }}
            >
              <span className="text-sm text-default-600 ">
                {t("Report of attendance at a judicial hearing")} :
              </span>{" "}
              <span className="text-blue-700 font-semibold ">
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
