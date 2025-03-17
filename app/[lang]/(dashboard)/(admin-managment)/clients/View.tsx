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
    <span className="text-sm text-default-900 font-medium w-[52%]">
      {label}:
    </span>
    <span className="text-default-500 font-semibold w-[40%]">{value}</span>
  </motion.li>
);

interface ViewUserData {
  row: any;
}

const ViewMore: React.FC<ViewUserData> = ({ row }) => {
  const { t } = useTranslate();
  const { lang } = useParams();

  const renderLawyerCasesData = () => {
    const lawyerData = row?.original?.client_files;
    console.log(typeof lawyerData);
    // If lawyerData is not an array or is empty, return a fallback message
    if (!Array.isArray(lawyerData) || lawyerData.length === 0) {
      return (
        <>
          <motion.h3
            className="font-semibold text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {t("Client Files")}
          </motion.h3>
          <p className="text-gray-500 mt-2">{t("No Files found")}</p>
        </>
      );
    }

    return (
      <>
        <div className="space-y-4 mt-5">
          {lawyerData.map((file, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-row gap-6 items-center"
            >
              <span className="text-sm text-default-900 font-medium w-[52%]">
                {t("Client Files")}:
              </span>
              <a
                href={file.url} // Access the file URL dynamically from the `file` object
                className="text-default-500 font-semibold w-[40%]"
                target="_blank"
                rel="noopener noreferrer" // Added for security when opening links
              >
                {t("Show File")} {/* Display the file name */}
              </a>
            </motion.li>
          ))}
        </div>
      </>
    );
  };

  const renderClientData = () => {
    const clientData = row?.original;

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
          <DetailItem label={t("Id")} value={clientData?.id || "-"} />
          <DetailItem label={t("Email")} value={clientData?.email || "-"} />
          <DetailItem label={t("Name")} value={clientData?.name || "-"} />
          <DetailItem label={t("Phone")} value={clientData?.phone || "-"} />
          <DetailItem
            label={t("Status")}
            value={clientData?.status == "active" ? "Yes" : "No" }
          />
          <DetailItem label={t("Address")} value={clientData?.address || "-"} />
          <DetailItem
            label={t("national_id_number")}
            value={clientData?.national_id_number || "-"}
          />

          <DetailItem
            label={t("Category")}
            value={clientData?.category?.name || "-"}
          />
          <DetailItem
            label={t("Date Of Create Account")}
            value={
              new Date(clientData?.created_at).toLocaleDateString("en-GB") ||
              "-"
            }
          />
          <DetailItem
            label={t("Last Update of Account")}
            value={
              new Date(clientData?.updated_at).toLocaleDateString("en-GB") ||
              "-"
            }
          />
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
          <SheetTitle>{t("Client Details")}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[100%]">
          <div className="py-6">
            {renderClientData()}
            <hr className="my-8" />
            {renderLawyerCasesData()}
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
