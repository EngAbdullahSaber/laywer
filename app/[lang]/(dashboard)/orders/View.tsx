"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Icon } from "@iconify/react";
import { useTranslate } from "@/config/useTranslation";
import { useParams } from "next/navigation";

const View = () => {
  const { t, loading, error } = useTranslate();
  const { lang } = useParams();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className=" h-7 w-7"
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
          <SheetTitle>{t("Order Details")}</SheetTitle>
        </SheetHeader>
        <div className="py-6">
          <ul className="md:grid grid-cols-2  !mt-5 gap-2 space-y-2 md:space-y-0">
            <li>
              <span className="text-sm text-default-600 ">{t("Title")} : </span>{" "}
              <span className="text-default-900 font-semibold "> Task 1</span>
            </li>
            <li>
              <span className="text-sm text-default-600 ">
                {t("Case Name")} :{" "}
              </span>{" "}
              <span className="text-default-900 font-semibold "> Abdullah</span>
            </li>
            <li>
              <span className="text-sm text-default-600 ">
                {t("order_status")} :
              </span>
              <span className="text-warning-700 font-semibold"> تم الرد</span>
            </li>

            <li>
              <span className="text-sm text-default-600 ">{t("Date")} : </span>{" "}
              <span className="text-default-900 font-semibold ">
                {" "}
                September 12, 2024
              </span>
            </li>
            <li>
              <span className="text-sm text-default-600 ">
                {t("Lawyer_Name")} :{" "}
              </span>{" "}
              <span className="text-default-900 font-semibold ">
                {" "}
                احمد على محمد
              </span>
            </li>
            <li>
              <span className="text-sm text-default-600 ">
                {t("Show File")} :
              </span>{" "}
              <a href="#">
                <span className="text-success-700 font-semibold">
                  {" "}
                  {t("Show File")}
                </span>
              </a>
            </li>
          </ul>
        </div>
        <SheetFooter>
          <SheetClose asChild>footer content</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default View;
