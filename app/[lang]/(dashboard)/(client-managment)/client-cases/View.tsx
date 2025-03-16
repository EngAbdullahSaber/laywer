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

  const renderCourtsData = () => {
    const casesData = row?.original?.court;

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
          <DetailItem label={t("Id")} value={casesData?.id || "-"} />
          <DetailItem label={t("name")} value={casesData?.name || "-"} />
          <DetailItem
            label={t("category")}
            value={casesData?.category.name || "-"}
          />
          <DetailItem
            label={t("Region")}
            value={
              lang == "en"
                ? casesData?.region?.name.en
                : casesData?.region?.name.ar || "-"
            }
          />
          <DetailItem
            label={t("City")}
            value={
              lang == "en"
                ? casesData?.city?.name.en
                : casesData?.city?.name.ar || "-"
            }
          />{" "}
          <DetailItem label={t("address")} value={casesData?.address || "-"} />
          <DetailItem
            label={t("room_number")}
            value={casesData?.room_number || "-"}
          />
          <DetailItem
            label="Date Of Create"
            value={
              new Date(casesData?.created_at).toLocaleDateString("en-GB") || "-"
            }
          />
          <DetailItem
            label="Date Of Update"
            value={
              new Date(casesData?.updated_at).toLocaleDateString("en-GB") || "-"
            }
          />
        </ul>
      </>
    );
  };
  const renderCaseFilesData = () => {
    const lawyerData = row?.original?.files;
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
  const renderCasaesData = () => {
    const casesData = row?.original;

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
          <DetailItem label={t("Id")} value={casesData?.id || "-"} />
          <DetailItem label={t("Title")} value={casesData?.title || "-"} />
          <DetailItem
            label={t("category")}
            value={casesData?.category.name || "-"}
          />

          <DetailItem
            label={t("main_case_number")}
            value={casesData?.main_case_number || "-"}
          />
          <DetailItem
            label={t("receive_date")}
            value={casesData?.receive_date || "-"}
          />
          <DetailItem
            label={t("submit_date")}
            value={casesData?.submit_date || "-"}
          />
          <DetailItem
            label={t("judgment_date")}
            value={casesData?.judgment_date || "-"}
          />
          <DetailItem
            label={t("session_date")}
            value={casesData?.session_date || "-"}
          />

          <DetailItem
            label={t("status")}
            value={
              lang == "en"
                ? casesData?.status == "completed"
                  ? "Completed"
                  : casesData?.status == "in_progress"
                  ? "In Progress"
                  : "Pending"
                : casesData?.status == "completed"
                ? "مكتملة"
                : casesData?.status == "in_progress"
                ? "قيد التنفيذ"
                : "قيدالانتظار"
            }
          />
          <DetailItem
            label={t("claim_status")}
            value={
              casesData?.claim_status == "claimant"
                ? t("claimant")
                : t("defendant") || "-"
            }
          />
          <DetailItem label={t("details")} value={casesData?.details || "-"} />
          {/* <DetailItem
            label="Date Of Create Account"
            value={
              new Date(casesData?.created_at).toLocaleDateString("en-GB") || "-"
            }
          />
          <DetailItem
            label="Last Update of Account"
            value={
              new Date(casesData?.updated_at).toLocaleDateString("en-GB") || "-"
            }
          /> */}
        </ul>
        {renderCaseFilesData()}
      </>
    );
  };
  const renderLawyerData = () => {
    const casesData = row?.original?.lawyer;

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
          <DetailItem label={t("Id")} value={casesData?.id || "-"} />
          <DetailItem label={t("name")} value={casesData?.name || "-"} />
          <DetailItem label={t("email")} value={casesData?.email || "-"} />
          <DetailItem label={t("address")} value={casesData?.address || "-"} />
          <DetailItem label={t("phone")} value={casesData?.phone || "-"} />
          <DetailItem
            label={t("category")}
            value={casesData?.category.name || "-"}
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
          <div className="py-6">
            {renderCasaesData()}
            <hr className="my-8" />
            {renderLawyerData()}
            <hr className="my-8" />
            {renderCourtsData()}
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
