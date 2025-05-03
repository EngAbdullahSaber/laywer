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
    <span className="text-default-500 dark:text-white font-semibold w-[40%]">
      {value}
    </span>
  </motion.li>
);

interface ViewUserData {
  row: any;
}

const ViewMore: React.FC<ViewUserData> = ({ row }) => {
  const { t } = useTranslate();
  const { lang } = useParams();

  const renderCourtData = () => {
    const courtData = row?.original;

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
          <DetailItem label={t("Id")} value={courtData?.id || "-"} />
          <DetailItem label={t("Name")} value={courtData?.name || "-"} />
          <DetailItem label={t("Email")} value={courtData?.email || "-"} />
          <DetailItem label={t("Address")} value={courtData?.address || "-"} />
          <DetailItem
            label={t("Room Number")}
            value={courtData?.room_number || "-"}
          />

          <DetailItem label={t("Address")} value={courtData?.address || "-"} />
          <DetailItem
            label={t("Category")}
            value={courtData?.category.name || "-"}
          />
          <DetailItem
            label={t("Region")}
            value={
              lang == "en"
                ? courtData?.region.name.en
                : courtData?.region.name.ar || "-"
            }
          />
          <DetailItem
            label={t("City")}
            value={
              lang == "en"
                ? courtData?.city.name.en
                : courtData?.city.name.ar || "-"
            }
          />
          <motion.li
            className="flex flex-row gap-6 items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-sm text-default-900 dark:text-white font-medium w-[52%]">
              {t("Court Website Link")}:
            </span>
            <a
              href={row.original.website}
              className="text-default-500 font-semibold w-[40%]"
            >
              {t("Court Website Link")}
            </a>
          </motion.li>
          <DetailItem
            label="Date Of Create"
            value={
              new Date(courtData?.created_at).toLocaleDateString("en-GB") || "-"
            }
          />
          <DetailItem
            label="Date Of Update"
            value={
              new Date(courtData?.updated_at).toLocaleDateString("en-GB") || "-"
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
          <SheetTitle>{t("Court Details")}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[100%]">
          <div className="py-6">{renderCourtData()}</div>
        </ScrollArea>
        <SheetFooter>
          <SheetClose asChild>footer content</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ViewMore;
