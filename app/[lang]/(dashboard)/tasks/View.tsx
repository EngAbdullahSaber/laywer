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
              </Button>{" "}
            </TooltipTrigger>
            <TooltipContent>
              <p> {t("Task Details")}</p>
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
            {t("Task Details")}
          </SheetTitle>
        </SheetHeader>
        <div className="py-6">
          <hr className="my-8" />
          <ul className="md:grid grid-cols-2  !mt-5 gap-2 space-y-2 md:space-y-0">
            <motion.li
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-sm text-default-600 ">
                {t("Task Name")} :{" "}
              </span>{" "}
              <span className="text-default-900 font-semibold  "> Task 1</span>
            </motion.li>
            <motion.li
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9 }}
            >
              <span className="text-sm text-default-600 ">
                {t("Importance Level")} :
              </span>
              <span className="text-warning-700 font-semibold "> High</span>
            </motion.li>
            <motion.li
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 1 }}
            >
              <span className="text-sm text-default-600 ">
                {t("Assigned To")} :{" "}
              </span>{" "}
              <span className="text-default-900 font-semibold  "> Ahmed</span>
            </motion.li>
            <motion.li
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 1.1 }}
            >
              <span className="text-sm text-default-600 ">
                {t("Due Date")} :{" "}
              </span>{" "}
              <span className="text-default-900 font-semibold  ">
                {" "}
                September 12, 2024 12:11 PM
              </span>
            </motion.li>
            <motion.li
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 1.2 }}
            >
              <span className="text-sm text-default-600 ">
                {t("Case Name")} :{" "}
              </span>{" "}
              <span className="text-default-900 font-semibold  ">
                {" "}
                Abdullah
              </span>
            </motion.li>
            <motion.li
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 1.3 }}
            >
              <span className="text-sm text-default-600 ">
                {t("Task Status")} :{" "}
              </span>{" "}
              <span className="text-success-700 font-semibold  ">
                {" "}
                Progress
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
