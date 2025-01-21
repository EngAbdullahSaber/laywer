"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
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

  const toggleSheet = () => setIsOpen((prev) => !prev);

  const courtDetails = [
    { label: t("Court Name"), value: "Court 1" },
    { label: t("Court Category"), value: t("Criminal"), isWarning: true },
    { label: t("Email"), value: "abc@gmail.com" },
    { label: t("Address"), value: "Egypt, Cairo" },
  ];

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
            <p>{t("Court Details")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Sheet open={isOpen} onOpenChange={toggleSheet}>
        <SheetContent
          side={lang === "ar" ? "left" : "right"}
          dir={lang === "ar" ? "rtl" : "ltr"}
          className="max-w-[736px]"
        >
          <SheetHeader>
            <SheetTitle className="mt-5 font-bold text-xl">
              {t("Court Details")}
            </SheetTitle>
          </SheetHeader>

          <div className="py-6">
            <ul className="flex flex-wrap justify-between">
              {courtDetails.map((detail, index) => (
                <motion.li
                  key={index}
                  initial={{ y: 50 }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8 + index * 0.1 }}
                  className="my-3 w-[48%]"
                >
                  <span className="text-sm text-default-600">
                    {detail.label}:
                  </span>
                  <span
                    className={`font-semibold ${
                      detail.isWarning ? "text-warning-700" : "text-default-900"
                    }`}
                  >
                    {detail.value}
                  </span>
                </motion.li>
              ))}
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
