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
          Profile Data
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
            label="Date Of Create Account"
            value={
              new Date(lawyerData?.created_at).toLocaleDateString("en-GB") ||
              "-"
            }
          />
          <DetailItem
            label="Last Update of Account"
            value={
              new Date(lawyerData?.updated_at).toLocaleDateString("en-GB") ||
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
          <SheetTitle>{t("Lawyer Details")}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-[100%]">
          <div className="py-6">
            {renderLawyerData()}
            <hr className="my-8" />
            {renderImagesData()}
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
