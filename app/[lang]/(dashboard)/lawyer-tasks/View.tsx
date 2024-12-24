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
          <SheetTitle>{t("Task Details")}</SheetTitle>
        </SheetHeader>
        <div className="py-6">
          <ul className="md:grid grid-cols-2  !mt-5 gap-2 space-y-2 md:space-y-0">
            <li>
              <span className="text-sm text-default-600 ">
                {t("Task Name")} :{" "}
              </span>{" "}
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
                {t("Importance Level")} :
              </span>
              <span className="text-warning-700 font-semibold"> مهمة جدا</span>
            </li>

            <li>
              <span className="text-sm text-default-600 ">
                {t("Due Date")} :{" "}
              </span>{" "}
              <span className="text-default-900 font-semibold ">
                {" "}
                September 12, 2024 12:11 PM
              </span>
            </li>

            <li>
              <span className="text-sm text-default-600 ">
                {t("Task Status")} :
              </span>{" "}
              <span className="text-success-700 font-semibold">
                {" "}
                قيدالانتظار
              </span>
            </li>
          </ul>
          <hr className="my-8" />
          <ul className="md:grid grid-cols-1  !mt-5 gap-2 space-y-2 md:space-y-0">
            <li className="flex flex-row justify-between items-center">
              <span className="text-sm text-default-600  w-[30%]">
                {t("Task Description")} :{" "}
              </span>{" "}
              <span className="text-default-900 font-semibold w-[67%]">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nulla,
                veritatis dolor obcaecati voluptas ullam commodi? Perferendis
                quae doloribus unde commodi voluptates totam magni fugit
                architecto, veritatis iusto? Nulla, doloremque. Corporis.
              </span>
            </li>
            <li className="flex flex-row justify-between items-center">
              <span className="text-sm text-default-600  w-[30%]">
                {t("Associated Case Details")} :
              </span>{" "}
              <span className="text-default-900 font-semibold w-[67%]">
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nulla,
                veritatis dolor obcaecati voluptas ullam commodi? Perferendis
                quae doloribus unde commodi voluptates totam magni fugit
                architecto, veritatis iusto? Nulla, doloremque. Corporis.
              </span>
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
