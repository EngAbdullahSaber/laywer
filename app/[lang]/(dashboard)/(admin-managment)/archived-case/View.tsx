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
const DetailItem: React.FC<{ label: string; value: string | number }> = ({
  label,
  value,
}) => (
  <motion.li
    className="flex flex-row gap-6 items-center"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    <span className="text-sm dark:text-white text-default-900 font-medium w-[40%]">
      {label}:
    </span>
    <span className="text-default-500 dark:text-white font-semibold w-[55%]">
      {value || "-"}
    </span>
  </motion.li>
);

interface ViewUserData {
  row: any;
}

const ViewMore: React.FC<ViewUserData> = ({ row }) => {
  const { t, loading, error } = useTranslate();
  const { lang } = useParams();

  const renderLawyerData = () => {
    const lawyerName = row?.original?.lawyer_name;

    return (
      <>
        <motion.h3
          className="font-semibold text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {t("Lawyer Info")}
        </motion.h3>
        <ul className="md:grid grid-cols-2 !mt-5 gap-2 space-y-2 md:space-y-0">
          <DetailItem label={t("Name")} value={lawyerName} />
        </ul>
      </>
    );
  };

  const renderCourtsData = () => {
    const courtName = row?.original?.court_name;

    return (
      <>
        <motion.h3
          className="font-semibold text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {t("Court Info")}
        </motion.h3>
        <ul className="md:grid grid-cols-2 !mt-5 gap-2 space-y-2 md:space-y-0">
          <DetailItem label={t("Name")} value={courtName} />
        </ul>
      </>
    );
  };

  const renderCaseFilesData = () => {
    const files = row?.original?.files || [];

    if (!Array.isArray(files) || files.length === 0) {
      return (
        <>
          <motion.h3
            className="font-semibold text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {t("Case Files")}
          </motion.h3>
          <p className="text-gray-500 dark:text-white mt-2">
            {t("No Files found")}
          </p>
        </>
      );
    }

    return (
      <>
        <motion.h3
          className="font-semibold text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {t("Case Files")}
        </motion.h3>
        <div className="space-y-4 mt-5">
          {files.map((file, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-row gap-6 items-center"
            >
              <span className="text-sm text-default-900 font-medium w-[52%]">
                {t("File")} {index + 1}:
              </span>
              <a
                href={file.url || file}
                className="text-default-500 font-semibold w-[40%]"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("View File")}
              </a>
            </motion.li>
          ))}
        </div>
      </>
    );
  };

  const renderCasesData = () => {
    const casesData = row?.original;

    return (
      <>
        <motion.h3
          className="font-semibold text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {t("Case Info")}
        </motion.h3>
        <ul className="md:grid grid-cols-2 !mt-5 gap-2 space-y-2 md:space-y-0">
          <DetailItem label={t("ID")} value={casesData?.id} />
          <DetailItem label={t("Title")} value={casesData?.title} />
          <DetailItem label={t("Category")} value={casesData?.category} />
          <DetailItem
            label={t("Main Case Number")}
            value={casesData?.main_case_number}
          />
          <DetailItem
            label={t("Receive Date")}
            value={
              casesData?.receive_date
                ? new Date(casesData.receive_date).toLocaleDateString("en-GB")
                : "-"
            }
          />
          <DetailItem
            label={t("Submit Date")}
            value={
              casesData?.submit_date
                ? new Date(casesData.submit_date).toLocaleDateString("en-GB")
                : "-"
            }
          />
          <DetailItem
            label={t("Judgment Date")}
            value={
              casesData?.judgment_date
                ? new Date(casesData.judgment_date).toLocaleDateString("en-GB")
                : "-"
            }
          />
          <DetailItem
            label={t("Session Date")}
            value={
              casesData?.session_date
                ? new Date(casesData.session_date).toLocaleDateString("en-GB")
                : "-"
            }
          />
          <DetailItem
            label={t("Status")}
            value={casesData?.claim_status || "-"}
          />
          <DetailItem label={t("Details")} value={casesData?.details} />
        </ul>
        {renderCaseFilesData()}
      </>
    );
  };

  const renderClientsData = () => {
    const clientName = row?.original?.client_name;

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
          <DetailItem label={t("Name")} value={clientName} />
        </ul>
      </>
    );
  };

  const renderDefendantsData = () => {
    const defendants = row?.original?.defendants || [];

    if (defendants.length === 0) {
      return null;
    }

    return (
      <>
        <motion.h3
          className="font-semibold text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {t("Defendants")}
        </motion.h3>
        <ul className="!mt-5 space-y-2">
          {defendants.map((defendant: string, index: number) => (
            <motion.li
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex flex-row gap-6 items-center"
            >
              <span className="text-sm text-default-900 font-medium w-[40%]">
                {t("defendant")} {index + 1}:
              </span>
              <span className="text-default-500 font-semibold w-[55%]">
                {defendant}
              </span>
            </motion.li>
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
          <SheetTitle>{t("Case Details")}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[100%]">
          <div className="py-6">
            {renderCasesData()}
            <hr className="my-8" />
            {renderClientsData()}
            <hr className="my-8" />
            {renderLawyerData()}
            <hr className="my-8" />
            {renderCourtsData()}
            <hr className="my-8" />
            {renderDefendantsData()}
          </div>
        </ScrollArea>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">{t("Close")}</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ViewMore;
