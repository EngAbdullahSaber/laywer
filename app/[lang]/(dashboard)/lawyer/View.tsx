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
          <SheetTitle className="mt-5 pt-5 font-bold text-2xl">
            {t("Lawyer Details")}
          </SheetTitle>
        </SheetHeader>
        <div className="py-6">
          <hr className="my-8" />

          <ul className="md:grid grid-cols-2  !mt-5 gap-2 space-y-2 md:space-y-0">
            <li>
              <span className="text-sm text-default-600 ">
                {t("Lawyer Name")} :{" "}
              </span>{" "}
              <span className="text-default-900 font-semibold ">
                {" "}
                Ahmed Ali Abdullah
              </span>
            </li>
            <li>
              <span className="text-sm text-default-600 ">
                {t("Phone Number")} :
              </span>
              <span className="text-default-900 font-semibold ">
                {" "}
                011232342342
              </span>
            </li>
            <li>
              <span className="text-sm text-default-600 ">
                {t("Email Address")} :{" "}
              </span>{" "}
              <span className="text-default-900 font-semibold ">
                {" "}
                abc@gmail.com
              </span>
            </li>
            <li>
              <span className="text-sm text-default-600 ">
                {t("address")} :{" "}
              </span>{" "}
              <span className="text-default-900 font-semibold ">
                {" "}
                Saudi Arabia ,Riyadh
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
