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
  const { t, loading, error } = useTranslate();
  const { lang } = useParams();

  const renderTasksData = () => {
    const TaskData = row?.original;

    return (
      <>
        <motion.h3
          className="font-semibold text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {t("Task Info")}
        </motion.h3>
        <ul className="md:grid grid-cols-2 !mt-5 gap-2 space-y-2 md:space-y-0">
          <DetailItem label={t("Id")} value={TaskData?.id || "-"} />
          <DetailItem label={t("title")} value={TaskData?.title || "-"} />

          <DetailItem
            label={t("case_number")}
            value={TaskData?.law_suit?.case_number || "-"}
          />
          <DetailItem label={t("due_date")} value={TaskData?.phone || "-"} />
          <DetailItem
            label={t("status")}
            value={
              TaskData?.status == "completed"
                ? "مكتملة"
                : TaskData?.importance_level == "in_progress"
                ? "قيد التنفيذ"
                : "قيدالانتظار"
            }
          />
          <DetailItem
            label={t("status")}
            value={
              TaskData?.importance_level == "high"
                ? " مهمة جدا"
                : TaskData?.importance_level == "mid"
                ? "متوسطة الاهمية"
                : "ذات اهمية ضعيفة"
            }
          />
          <DetailItem label={t("due_date")} value={TaskData?.due_date || "-"} />
          <DetailItem label={t("details")} value={TaskData?.details || "-"} />

          <DetailItem
            label={t("Date Of Create Task")}
            value={
              new Date(TaskData?.created_at).toLocaleDateString("en-GB") || "-"
            }
          />
          <DetailItem
            label={t("Last Update of Task")}
            value={
              new Date(TaskData?.updated_at).toLocaleDateString("en-GB") || "-"
            }
          />
        </ul>{" "}
        <hr className="my-8" />
        <motion.div
          className="flex flex-row gap-6 my-3 items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-sm text-default-900 font-medium w-[52%]">
            {t("Details")} :
          </span>
          <span className="text-default-500 font-semibold w-[40%]">
            {TaskData?.details}
          </span>
        </motion.div>
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
          <SheetTitle>{t("Task Details")}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[100%]">
          <div className="py-6">{renderTasksData()}</div>
        </ScrollArea>
        <SheetFooter>
          <SheetClose asChild>footer content</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ViewMore;
