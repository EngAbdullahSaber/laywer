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

  const renderImagesData = () => {
    const profile = row?.original;

    return (
      <>
        <motion.h3
          className="font-semibold text-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {t("Profile Data")}
        </motion.h3>
        <ul className="md:grid grid-cols-2 !mt-5 gap-2 space-y-2 md:space-y-0">
          <motion.li
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-row gap-6 items-center"
          >
            <span className="text-sm text-default-900 font-medium w-[52%]">
              {t("Lawyer Licence Photo")}:
            </span>
            <span className="text-default-500 font-semibold w-[40%]">
              <Avatar className="w-16 h-16">
                <AvatarImage
                  className="w-16 h-16"
                  src={`${profile?.lawyer_licence?.url}`}
                />
                <AvatarFallback>
                  {profile?.name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </span>
          </motion.li>
          <motion.li
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-row gap-6 items-center"
          >
            <span className="text-sm text-default-900 font-medium w-[52%]">
              {t("Driving Licence Photo")}:
            </span>
            <span className="text-default-500 font-semibold w-[40%]">
              <Avatar className="w-16 h-16">
                <AvatarImage
                  className="w-16 h-16"
                  src={`${profile?.driving_licence?.url}`}
                />
                <AvatarFallback>
                  {profile?.name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </span>
          </motion.li>
          <motion.li
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-row gap-6 items-center"
          >
            <span className="text-sm text-default-900 font-medium w-[52%]">
              {t("National Id Photo")}:
            </span>
            <span className="text-default-500 font-semibold w-[40%]">
              <Avatar className="w-16 h-16">
                <AvatarImage
                  className="w-16 h-16"
                  src={`${profile?.national_id_image?.url}`}
                />
                <AvatarFallback>
                  {profile?.name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </span>
          </motion.li>
          <motion.li
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-row gap-6 items-center"
          >
            <span className="text-sm text-default-900 font-medium w-[52%]">
              {t("Subscription Photo")}:
            </span>
            <span className="text-default-500 font-semibold w-[40%]">
              <Avatar className="w-16 h-16">
                <AvatarImage
                  className="w-16 h-16"
                  src={`${profile?.subscription_image?.url}`}
                />
                <AvatarFallback>
                  {profile?.name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </span>
          </motion.li>
        </ul>
      </>
    );
  };

  const renderLawyerData = () => {
    const lawyerData = row?.original;

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
          <DetailItem label={t("Id")} value={lawyerData?.id || "-"} />
          <DetailItem label={t("Email")} value={lawyerData?.email || "-"} />
          <DetailItem label={t("Name")} value={lawyerData?.name || "-"} />
          <DetailItem label={t("Phone")} value={lawyerData?.phone || "-"} />
          <DetailItem
            label={t("Status")}
            value={lawyerData?.status == "active" ? "Yes" : "No" || "-"}
          />
          <DetailItem label={t("Address")} value={lawyerData?.address || "-"} />
          <DetailItem
            label={t("Driving Licence Number")}
            value={lawyerData?.driving_licence_number || "-"}
          />
          <DetailItem
            label={t("National Id Number")}
            value={lawyerData?.national_id_number || "-"}
          />
          <DetailItem
            label={t("Category")}
            value={lawyerData?.category.name || "-"}
          />
          <DetailItem
            label={t("Date Of Create Accounts")}
            value={
              new Date(lawyerData?.created_at).toLocaleDateString("en-GB") ||
              "-"
            }
          />
          <DetailItem
            label={t("Last Update of Accounts")}
            value={
              new Date(lawyerData?.updated_at).toLocaleDateString("en-GB") ||
              "-"
            }
          />
        </ul>
      </>
    );
  };
  const renderLawyerCasesData = () => {
    const lawyerData = row?.original.suits;

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
            {t("Lawyer Cases")}
          </motion.h3>
          <p className="text-gray-500 mt-2">{t("No cases found")}</p>
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
          {t("Lawyer Cases")}
        </motion.h3>
        <div className="space-y-4 mt-5">
          {lawyerData.map((suit, index) => (
            <div key={index} className="border-b-2 py-4">
              <h4 className="font-semibold text-md mb-3">{suit?.title}</h4>
              <ul className="md:grid grid-cols-2 gap-2 space-y-2 md:space-y-0">
                <DetailItem label={t("Id")} value={suit?.id || "-"} />
                <DetailItem label={t("Title")} value={suit?.title || "-"} />
                <DetailItem
                  label={t("Court Name")}
                  value={suit?.court?.name || "-"}
                />
                <DetailItem
                  label={t("Court Region")}
                  value={suit?.court?.region?.name?.en || "-"}
                />
                <DetailItem
                  label={t("Court City")}
                  value={suit?.court?.city?.name?.en || "-"}
                />
                <DetailItem
                  label={t("Court Address")}
                  value={suit?.court?.address || "-"}
                />
                <DetailItem
                  label={t("Main Case Number")}
                  value={suit?.main_case_number || "-"}
                />
                <DetailItem
                  label={t("Case Numbers")}
                  value={
                    suit?.case_numbers
                      ?.map(
                        (caseNum) =>
                          `${caseNum.first_letter}${caseNum.second_letter}/${caseNum.case_year}/${caseNum.case_number_id}`
                      )
                      .join(", ") || "-"
                  }
                />
                <DetailItem
                  label={t("Category")}
                  value={suit?.category?.name || "-"}
                />
                <DetailItem
                  label={t("Receive Date")}
                  value={suit?.receive_date || "-"}
                />
                <DetailItem
                  label={t("Submit Date")}
                  value={suit?.submit_date || "-"}
                />
                <DetailItem
                  label={t("Judgment Date")}
                  value={suit?.judgment_date || "-"}
                />
                <DetailItem
                  label={t("Session Date")}
                  value={suit?.session_date || "-"}
                />
                <DetailItem label={t("Status")} value={suit?.status || "-"} />
                <DetailItem
                  label={t("Claim Status")}
                  value={suit?.claim_status || "-"}
                />
                <DetailItem
                  label={t("Defendants")}
                  value={suit?.defendants?.join(", ") || "-"}
                />
                <DetailItem label={t("Details")} value={suit?.details || "-"} />
                <DetailItem
                  label={t("Files")}
                  value={
                    suit?.files?.length > 0 ? suit.files.length : "No files"
                  }
                />
              </ul>
            </div>
          ))}
        </div>
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
          <SheetTitle>{t("Lawyer Details")}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[100%]">
          <div className="py-6">
            {renderLawyerData()}
            <hr className="my-8" />
            {renderImagesData()}
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
