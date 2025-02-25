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
const DetailItemLink = ({
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
          {t("Services Order Info")}
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
            value={lawyerData?.service?.title || "-"}
          />
          <DetailItem
            transitionDuration={1}
            label={t("price")}
            value={lawyerData?.service?.price || "-"}
          />
          <DetailItem
            transitionDuration={1.1}
            label={t("client")}
            value={lawyerData?.client?.name || "-"}
          />
          <DetailItem
            transitionDuration={1.3}
            label={t("Date Of Create Services")}
            value={
              new Date(lawyerData?.created_at).toLocaleDateString("en-GB") ||
              "-"
            }
          />
          <DetailItem
            transitionDuration={1.3}
            label={t("Date Of Update Services")}
            value={
              new Date(lawyerData?.updated_at).toLocaleDateString("en-GB") ||
              "-"
            }
          />{" "}
          <motion.li
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-row gap-6 items-center"
          >
            <span className="text-sm text-default-900 font-medium w-[52%]">
              {t("invoice")}:
            </span>
            <span className="text-default-500 font-semibold w-[40%]">
              <Avatar className="w-16 h-16">
                <AvatarImage
                  className="w-16 h-16"
                  src={`${lawyerData?.invoice_file?.url}`}
                />
                <AvatarFallback>
                  {lawyerData?.invoice_file?.image_name
                    ?.slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </span>
          </motion.li>
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
          <SheetTitle>{t("Services Order Details")}</SheetTitle>
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
            </ul>{" "}
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
