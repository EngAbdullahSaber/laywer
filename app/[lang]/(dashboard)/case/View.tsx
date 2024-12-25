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
            {t("Case Details")}
          </SheetTitle>
        </SheetHeader>
        <div className="py-6">
          <ul className="md:grid grid-cols-2  !mt-5 gap-2 space-y-2 md:space-y-0">
            <li>
              <span className="text-sm text-default-600 ">
                {t("Case Name")} :{" "}
              </span>{" "}
              <span className="text-default-900 font-semibold "> Ahmed</span>
            </li>
            <li>
              <span className="text-sm text-default-600 ">
                {t("Category")} :{" "}
              </span>
              <span className="text-default-900 font-semibold "> Admin</span>
            </li>
            <li>
              <span className="text-sm text-default-600 ">
                {t("Next Appointment Date")} :
              </span>{" "}
              <span className="text-default-900 font-semibold ">
                {" "}
                12/03/2004
              </span>
            </li>
            <li>
              <span className="text-sm text-default-600 ">
                {t("Status")} :{" "}
              </span>{" "}
              <span className="text-default-900 font-semibold "> Criminal</span>
            </li>
            <li>
              <span className="text-sm text-default-600 ">
                {t("Case Date")} :
              </span>{" "}
              <span className="text-default-900 font-semibold ">
                {" "}
                12/03/2004
              </span>
            </li>
          </ul>
          <hr className="my-8" />
          <h3 className="font-semibold  text-lg my-3">
            {t("Client Information")}
          </h3>
          <ul className="md:grid grid-cols-2  !mt-5 gap-2 space-y-2 md:space-y-0">
            <li>
              <span className="text-sm text-default-600 ">{t("Name")} : </span>{" "}
              <span className="text-default-900 font-semibold "> Ahmed</span>
            </li>
            <li>
              <span className="text-sm text-default-600 ">
                {t("Phone Number")} :{" "}
              </span>{" "}
              <span className="text-default-900 font-semibold">
                011223344555
              </span>
            </li>
            <li className="col-span-2">
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
                {t("Address")} :
              </span>{" "}
              <span className="text-default-900 font-semibold "> الرياض </span>
            </li>
          </ul>
          <hr className="my-8" />
          <h3 className="font-semibold  text-lg my-3">{t("Court Details")}</h3>

          <ul className="md:grid grid-cols-2  !mt-5 gap-2 space-y-2 md:space-y-0">
            <li>
              <span className="text-sm text-default-600 ">
                {t("Court Name")} :{" "}
              </span>{" "}
              <span className="text-default-900 font-semibold ">
                {" "}
                Riyadh Court
              </span>
            </li>
            <li>
              <span className="text-sm text-default-600 ">
                {t("Room Number")} :{" "}
              </span>
              <span className="text-default-900 font-semibold ">22</span>
            </li>
            <li>
              <span className="text-sm text-default-600 ">
                {t("Address")} :{" "}
              </span>{" "}
              <span className="text-default-900 font-semibold ">
                {" "}
                Saudi Arabia ,Riyadh
              </span>
            </li>
            <li>
              <span className="text-sm text-default-600 ">
                {t("Court Category")} :
              </span>{" "}
              <span className="text-default-900 font-semibold"> Criminals</span>
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
