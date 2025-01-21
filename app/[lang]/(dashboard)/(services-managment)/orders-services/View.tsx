"use client";

import React, { useState } from "react";
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
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => setOpen(!open);
  return (
    <>
      {" "}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button
              size="icon"
              variant="outline"
              className=" h-7 w-7"
              color="secondary"
              onClick={handleOpen}
            >
              <Icon icon="heroicons:eye" className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p> {t("Services Details")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Sheet open={open} onOpenChange={handleOpen}>
        <SheetContent
          side={lang === "ar" ? "left" : "right"}
          dir={lang === "ar" ? "rtl" : "ltr"}
          className="max-w-[736px]"
        >
          <SheetHeader>
            <SheetTitle>{t("Services Details")}</SheetTitle>
          </SheetHeader>
          <div className="py-6">
            <ul className="md:grid grid-cols-2  !mt-5 gap-2 space-y-2 md:space-y-0">
              <motion.li
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-sm text-default-600 ">
                  {t("Title")} :{" "}
                </span>{" "}
                <span className="text-default-900 font-semibold "> Task 1</span>
              </motion.li>

              <motion.li
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <span className="text-sm text-default-600 ">
                  {t("Services Name")} :{" "}
                </span>{" "}
                <span className="text-default-900 font-semibold ">
                  {" "}
                  Abdullah
                </span>
              </motion.li>
              <motion.li
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.7 }}
              >
                <span className="text-sm text-default-600 ">
                  {t("Services Price")} :{" "}
                </span>{" "}
                <span className="text-default-900 font-semibold ">
                  {" "}
                  123 SAR
                </span>
              </motion.li>

              <motion.li
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9 }}
              >
                <span className="text-sm text-default-600 ">
                  {t("Date")} :{" "}
                </span>{" "}
                <span className="text-default-900 font-semibold ">
                  {" "}
                  September 12, 2024
                </span>
              </motion.li>

              <motion.li
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                transition={{ duration: 1.0 }}
              >
                <span className="text-sm text-default-600 ">
                  {t("Client_Name")} :{" "}
                </span>{" "}
                <span className="text-default-900 font-semibold ">
                  {" "}
                  احمد على محمد
                </span>
              </motion.li>

              <motion.li
                initial={{ y: 50 }}
                animate={{ y: 0 }}
                transition={{ duration: 1.1 }}
              >
                <span className="text-sm text-default-600 ">
                  {t("Show File")} :
                </span>{" "}
                <a href="#">
                  <span className="text-success-700 font-semibold">
                    {" "}
                    {t("Show File")}
                  </span>
                </a>
              </motion.li>
            </ul>
          </div>
          <SheetFooter>
            <SheetClose asChild>footer content</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default View;
