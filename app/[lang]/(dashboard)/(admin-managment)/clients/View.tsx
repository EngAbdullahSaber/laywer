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

  const toggleSheet = () => {
    setIsOpen((prevState) => !prevState);
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
              onClick={toggleSheet}
            >
              <Icon icon="heroicons:eye" className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{t("Client Details")}</p>
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
            <SheetTitle className="mt-5 pt-5 font-bold text-2xl">
              {t("Client Details")}
            </SheetTitle>
          </SheetHeader>
          <div className="py-6 overflow-y-auto h-full">
            <ClientDetails />
          </div>
          <SheetFooter>
            <SheetClose asChild>footer content</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

const ClientDetails = () => {
  const { t } = useTranslate();
  const clientInfo = [
    { label: t("Client_Name"), value: "Court 1" },
    { label: t("Email"), value: "abc@gmail.com" },
    { label: t("Address"), value: "Saudi Arabia, Riyadh" },
    { label: t("Current_Case_Name"), value: "Ali" },
  ];

  return (
    <Section title={t("Client Information")}>
      <DetailsList items={clientInfo} />
    </Section>
  );
};

const Section = ({ title, children }) => (
  <>
    <motion.h3
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="font-semibold text-lg my-3"
    >
      {title}
    </motion.h3>
    {children}
    <motion.hr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="my-8"
    />
  </>
);

const DetailsList = ({ items }) => (
  <ul className="md:grid grid-cols-2 !mt-5 gap-2 space-y-2 md:space-y-0">
    {items.map((item, index) => (
      <motion.li
        key={index}
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 + index * 0.1 }}
        className="my-3 flex flex-wrap items-center"
      >
        <span className="text-sm text-default-600">{item.label}:</span>
        <span className="text-default-900 font-semibold">{item.value}</span>
      </motion.li>
    ))}
  </ul>
);

export default View;
