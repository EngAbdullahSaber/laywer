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
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Reusable ListItem component to avoid repetitive code
const ListItem = ({
  label,
  value,
  transitionDuration,
}: {
  label: string;
  value: string;
  transitionDuration: number;
}) => (
  <motion.li
    initial={{ y: 30 }}
    animate={{ y: 0 }}
    transition={{ duration: transitionDuration }}
    className="flex flex-row !flex-nowrap justify-between items-center"
  >
    <span className="text-sm text-default-600 w-[30%]">{label}:</span>
    <span className="text-default-900 font-semibold w-[67%]">{value}</span>
  </motion.li>
);

const View = () => {
  const { t } = useTranslate();
  const { lang } = useParams();

  return (
    <Sheet>
      <SheetTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button
                size="icon"
                variant="outline"
                className="h-7 w-7"
                color="secondary"
              >
                <Icon icon="heroicons:eye" className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("Case Details")}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </SheetTrigger>{" "}
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
          <ul className="md:grid grid-cols-2 !mt-5 gap-2 space-y-2 md:space-y-0">
            <ListItem
              label={t("Case Name")}
              value="Ahmed"
              transitionDuration={0.6}
            />
            <ListItem
              label={t("Case Status")}
              value="Pending"
              transitionDuration={0.7}
            />
            <ListItem
              label={t("Client Name")}
              value="Mohamed"
              transitionDuration={0.8}
            />
            <ListItem
              label={t("Court Name")}
              value="Court 1"
              transitionDuration={0.9}
            />
            <ListItem
              label={t("Case Number")}
              value="21231"
              transitionDuration={1}
            />
            <ListItem
              label={t("appointment_title")}
              value="September 12, 2024 12:11 PM"
              transitionDuration={1.1}
            />
            <ListItem
              label={t("Date")}
              value="September 12, 2024 12:11 PM"
              transitionDuration={1.2}
            />
            <ListItem
              label={t("Address")}
              value="الرياض"
              transitionDuration={1.3}
            />
          </ul>

          <hr className="my-8" />

          <ul className="md:grid grid-cols-1 !mt-5 gap-2 space-y-2 md:space-y-0">
            <ListItem
              label={t("Task Description")}
              value="Lorem ipsum dolor sit amet..."
              transitionDuration={1.4}
            />
            <ListItem
              label={t("Associated Case Details")}
              value="Lorem ipsum dolor sit amet..."
              transitionDuration={1.5}
            />
            <ListItem
              label={t("Case follow-up report")}
              value={t("show file")}
              transitionDuration={1.6}
            />
            <ListItem
              label={t("Report of attendance at a judicial hearing")}
              value={t("show file")}
              transitionDuration={1.7}
            />
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
