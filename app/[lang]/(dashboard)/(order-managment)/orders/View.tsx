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
          {t("Orders Info")}
        </motion.h3>
        <ul className="md:grid grid-cols-2 !mt-5 gap-2 space-y-2 md:space-y-0">
          <DetailItem
            transitionDuration={0.8}
            label={t("Id")}
            value={lawyerData?.id || "-"}
          />
          <DetailItem
            transitionDuration={0.9}
            label={t("Title")}
            value={lawyerData?.title || "-"}
          />
          <DetailItem
            transitionDuration={1}
            label={t("status")}
            value={lawyerData?.status === "replied" ? "تم الرد" : "لم يتم الرد"}
          />
          <DetailItem
            transitionDuration={1.1}
            label={t("Client")}
            value={lawyerData?.client || "-"}
          />
          <DetailItem
            transitionDuration={1.1}
            label={t("details")}
            value={lawyerData?.details || "-"}
          />
          <DetailItem
            transitionDuration={1.1}
            label={t("Lawyer Name")}
            value={lawyerData?.lawyer || "-"}
          />
          <DetailItem
            transitionDuration={1.3}
            label={t("Date Of Create")}
            value={
              new Date(lawyerData?.created_at).toLocaleDateString("en-GB") ||
              "-"
            }
          />
          <DetailItem
            transitionDuration={1.3}
            label={t("Date Of Update")}
            value={
              new Date(lawyerData?.updated_at).toLocaleDateString("en-GB") ||
              "-"
            }
          />
        </ul>
        <hr className="my-8" />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-row gap-6 items-center"
        >
          <span className="text-sm text-default-900 font-medium w-[52%]">
            {t("details")}:
          </span>
          <span className="text-default-500 dark:text-white font-semibold w-[40%]">
            {lawyerData.details} {/* Display the file name */}
          </span>
        </motion.p>
      </>
    );
  };
  const renderReplyData = () => {
    const lawyerData = row?.original?.reply;

    return (
      <>
        <motion.h3
          className="font-semibold text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {t("Replying")}
        </motion.h3>
        <ul className="md:grid grid-cols-2 !mt-5 gap-2 space-y-2 md:space-y-0">
          <DetailItem
            transitionDuration={0.8}
            label={t("Id")}
            value={lawyerData?.id || "-"}
          />
          <DetailItem
            transitionDuration={0.9}
            label={t("Title")}
            value={lawyerData?.title || "-"}
          />
        </ul>
        <hr className="my-8" />

        {lawyerData?.files?.map((file, idx) => (
          <motion.p
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + idx * 0.1, duration: 0.5 }}
            className="flex flex-row gap-6 my-5 items-center"
          >
            <span className="text-sm text-default-900 font-medium w-[52%]">
              {t("Client file")} {idx + 1}:
            </span>
            <a
              href={file.url}
              className="text-default-500 cursor-pointer font-semibold w-[40%]"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("Show File")}{" "}
            </a>
          </motion.p>
        ))}
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
          <SheetTitle>{t("Orders Details")}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[100%]">
          <div className="py-6">
            {renderAppointementData()} <hr className="my-8" />
            {renderReplyData()}
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
