"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
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
import { ScrollArea } from "@radix-ui/react-scroll-area";

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
            <p>{t("Case Details")}</p>
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
              {t("Case Details")}
            </SheetTitle>
          </SheetHeader>
          <div className="py-6 overflow-y-auto h-full">
            <CaseDetails />
            <ClientInformation />
            <CourtDetails />
          </div>
          <SheetClose asChild>footer content</SheetClose>
        </SheetContent>
      </Sheet>
    </>
  );
};

const CaseDetails = () => {
  const { t } = useTranslate();
  const caseInfo = [
    { label: t("Case Name"), value: "Ahmed" },
    { label: t("Category"), value: "Admin" },
    { label: t("Next Appointment Date"), value: "12/03/2004" },
    { label: t("Status"), value: "Criminal" },
    { label: t("Case Date"), value: "12/03/2004" },
    { label: t("main_case_number"), value: "15546" },
    { label: t("secondary_case_number"), value: "435345" },
    {
      label: t("Description"),
      value:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente, natus.",
    },
    { label: t("Case follow-up report"), value: t("show file"), isLink: true },
  ];

  return (
    <>
      <Section title={t("Case Info")}>
        <DetailsList items={caseInfo} />
      </Section>
    </>
  );
};

const ClientInformation = () => {
  const { t } = useTranslate();
  const clientInfo = [
    { label: t("Name"), value: "Ahmed" },
    { label: t("Phone Number"), value: "011223344555" },
    {
      label: t("Email Address"),
      value: "abc@gmail.com",
    },
    { label: t("Address"), value: "الرياض" },
  ];

  return (
    <Section title={t("Client Information")}>
      <DetailsList items={clientInfo} />
    </Section>
  );
};

const CourtDetails = () => {
  const { t } = useTranslate();
  const courtInfo = [
    { label: t("Court Name"), value: "Riyadh Court" },
    { label: t("Room Number"), value: "22" },
    { label: t("Address"), value: "Saudi Arabia, Riyadh" },
    { label: t("Court Category"), value: "Criminals" },
    {
      label: t("Report of attendance at a judicial hearing"),
      value: t("show file"),
      isLink: true,
    },
  ];

  return (
    <Section title={t("Court Details")}>
      <DetailsList items={courtInfo} />
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
      >
        <span className="text-sm text-default-600">{item.label} :</span>
        {item.isLink ? (
          <span className="text-blue-700 font-semibold">{item.value}</span>
        ) : (
          <span className="text-default-900 font-semibold">{item.value}</span>
        )}
      </motion.li>
    ))}
  </ul>
);

export default View;
