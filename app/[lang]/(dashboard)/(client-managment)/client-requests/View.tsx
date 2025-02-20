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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
    <span className="text-default-500 font-semibold w-[40%]">{value}</span>
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
          {t("Cases Info")}
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
            label={t("status")}
            value={lawyerData?.status || "-"}
          />
          <DetailItem
            transitionDuration={1.1}
            label={t("requested_data")}
            value={lawyerData?.requested_data || "-"}
          />
          <DetailItem
            transitionDuration={1.2}
            label={t("details")}
            value={lawyerData?.details || "-"}
          />
          <DetailItem
            transitionDuration={1.3}
            label={t("lawyer")}
            value={lawyerData?.lawyer || "-"}
          />
          <DetailItem
            transitionDuration={1.3}
            label={t("lawyer")}
            value={lawyerData?.law_suit || "-"}
          />
          <DetailItem
            transitionDuration={1.3}
            label={t("created_at")}
            value={lawyerData?.created_at || "-"}
          />
          <DetailItem
            transitionDuration={1.3}
            label={t("updated_at")}
            value={lawyerData?.updated_at || "-"}
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
          <SheetTitle>{t("Cases Details")}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[100%]">
          <div className="py-6">{renderAppointementData()}</div>
        </ScrollArea>
        <SheetFooter>
          <SheetClose asChild>footer content</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ViewMore;
