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
import { ScrollArea } from "@/components/ui/scroll-area";
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
  const handleOpen = () => {
    setOpen(!open);
  };

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
              onClick={handleOpen}
            >
              <Icon icon="heroicons:eye" className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("Case Details")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Sheet open={open} onOpenChange={handleOpen}>
        <SheetTrigger asChild>
          {/* Button already triggering the modal */}
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
          <ScrollArea className="h-[100%]">
            <div className="py-6" dir={lang === "ar" ? "rtl" : "ltr"}>
              <ul className="md:grid grid-cols-2 !mt-5 gap-2 space-y-2 md:space-y-0">
                {[
                  { label: "Case Name", value: "Ahmed" },
                  { label: "Case Number", value: "21231" },
                  { label: "Court Name", value: "Court 1" },
                  { label: "Court Category", value: "Family" },
                  { label: "Case Status", value: "Pending" },
                  { label: "Client Name", value: "Mohamed" },
                  {
                    label: "Hearing Dates",
                    value: "September 12, 2024 12:11 PM",
                  },
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ y: 30 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.6 + index * 0.1 }}
                    className="flex flex-row !flex-nowrap justify-between items-center"
                  >
                    <span className="text-sm text-default-600 w-[35%]">
                      {t(item.label)}:
                    </span>{" "}
                    <span className="text-default-900 font-semibold w-[62%]">
                      {item.value}
                    </span>
                  </motion.li>
                ))}
              </ul>
              <hr className="my-8" />
              <ul className="md:grid grid-cols-1 !mt-5 gap-2 space-y-2 md:space-y-0">
                {[
                  { label: "Full Case Description", value: "Lorem ipsum..." },
                  { label: "Case Category", value: "Lorem ipsum..." },
                  { label: "Opposing Party", value: "Lorem ipsum..." },
                  { label: "Attorney Name", value: "Lorem ipsum..." },
                  { label: "Case Notes", value: "Lorem ipsum..." },
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ y: 30 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1.3 + index * 0.1 }}
                    className="flex flex-row !flex-nowrap justify-between items-center"
                  >
                    <span className="text-sm text-default-600 w-[35%]">
                      {t(item.label)}:
                    </span>{" "}
                    <span className="text-default-900 font-semibold w-[62%]">
                      {item.value}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </ScrollArea>

          <SheetFooter>
            <SheetClose asChild>
              <Button variant="outline" onClick={handleOpen}>
                {t("Close")}
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default View;
