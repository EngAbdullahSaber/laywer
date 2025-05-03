"use client";

import React from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";

// A reusable component to display a list of details
const DetailItem = ({
  label,
  value,
  transitionDuration,
}: {
  label: string;
  value: string;
  transitionDuration: number;
}) => (
  <motion.li
    className="flex flex-row gap-6 items-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: transitionDuration }}
  >
    <span className="text-sm text-default-900 font-medium w-[52%]">
      {label}:
    </span>
    <span className="text-default-500 dark:text-white font-semibold w-[40%]">
      {value}
    </span>
  </motion.li>
);
const DetailItemLink = ({
  label,
  value,
  transitionDuration,
}: {
  label: string;
  value: React.ReactNode; // Allow JSX elements
  transitionDuration: number;
}) => (
  <motion.li
    className="flex flex-row gap-6 items-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: transitionDuration }}
  >
    <span className="text-sm text-default-900 font-medium w-[52%]">
      {label}:
    </span>
    <span className="text-blue-700 font-semibold w-[40%]">{value}</span>
  </motion.li>
);

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
interface ViewUserData {
  row: any;
}

const ViewMore: React.FC<ViewUserData> = ({ row }) => {
  const { t, loading, error } = useTranslate();
  const { lang } = useParams();

  const renderAppointementData = () => {
    const lawyerData = row?.original;

    return (
      <>
        <motion.h3
          className="font-semibold text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {t("Appointment Info")}
        </motion.h3>
        <ul className="md:grid grid-cols-2 !mt-5 gap-2 space-y-2 md:space-y-0">
          <DetailItem
            transitionDuration={0.8}
            label={t("Id")}
            value={lawyerData?.id || "-"}
          />
          <DetailItem
            transitionDuration={0.9}
            label={t("title")}
            value={lawyerData?.title || "-"}
          />
          <DetailItem
            transitionDuration={1}
            label={t("appointment_date")}
            value={lawyerData?.appointment_date || "-"}
          />
          <DetailItem
            transitionDuration={1.1}
            label={t("appointment_time")}
            value={lawyerData?.appointment_time || "-"}
          />
          <DetailItem
            transitionDuration={1.2}
            label={t("client")}
            value={lawyerData?.client?.name || "-"}
          />
        </ul>
      </>
    );
  };
  const renderClientData = () => {
    const lawyerData = row?.original?.client;
    const clientFiles = row?.original?.client?.client_files;
    if (clientFiles?.length === 0) return null;
    return (
      <>
        <motion.h3
          className="font-semibold text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {t("Client Info")}
        </motion.h3>
        <ul className="md:grid grid-cols-2 !mt-5 gap-2 space-y-2 md:space-y-0">
          <DetailItem
            transitionDuration={1.4}
            label={t("Id")}
            value={lawyerData?.id || "-"}
          />
          <DetailItem
            transitionDuration={1.5}
            label={t("name")}
            value={lawyerData?.name || "-"}
          />
          <DetailItem
            transitionDuration={1.6}
            label={t("email")}
            value={lawyerData?.email || "-"}
          />
          <DetailItem
            transitionDuration={1.7}
            label={t("phone")}
            value={lawyerData?.phone || "-"}
          />
          <DetailItem
            transitionDuration={1.8}
            label={t("address")}
            value={lawyerData?.address || "-"}
          />
        </ul>
        <ul className="md:grid grid-cols-2 !mt-5 gap-2 space-y-2 md:space-y-0">
          {clientFiles.map((file: any, index: number) => (
            <DetailItemLink
              key={index}
              transitionDuration={1.9}
              label={t("File")}
              value={
                <a
                  href={file.url}
                  target="_blank"
                  className="to-blue-700"
                  rel="noopener noreferrer"
                >
                  {file.image_name}
                </a>
              }
            />
          ))}
        </ul>
      </>
    );
  };
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="h-7 w-7"
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
          <SheetTitle>{t("Appointment Details")}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[100%]">
          <div className="py-6">
            {renderAppointementData()}
            <hr className="my-8" />
            <ul className="md:grid grid-cols-1 !mt-5 gap-2 space-y-2 md:space-y-0">
              <ListItem
                label={t("details")}
                value={row?.original?.details}
                transitionDuration={1.4}
              />
              <ListItem
                label={t("requested_details")}
                value={row?.original?.requested_details}
                transitionDuration={1.5}
              />
            </ul>{" "}
            <hr className="my-8" />
            {renderClientData()}
          </div>
        </ScrollArea>
        <SheetFooter>
          <SheetClose asChild>footer content</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ViewMore;
