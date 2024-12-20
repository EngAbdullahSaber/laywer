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
          <SheetTitle>Case Details</SheetTitle>
        </SheetHeader>
        <div className="py-6">
          <ul className="md:grid grid-cols-2  !mt-5 gap-2 space-y-2 md:space-y-0">
            <li>
              <span className="text-sm text-default-600 ">Case Name :</span>{" "}
              <span className="text-default-500 "> Ahmed</span>
            </li>
            <li>
              <span className="text-sm text-default-600 ">Category :</span>
              <span className="text-default-500 "> Admin</span>
            </li>
            <li>
              <span className="text-sm text-default-600 ">
                Next Appointment Date :
              </span>{" "}
              <span className="text-default-500 "> 12/03/2004</span>
            </li>
            <li>
              <span className="text-sm text-default-600 ">Status :</span>{" "}
              <span className="text-default-500 "> Criminal</span>
            </li>
          </ul>
          <hr className="my-8" />
          <h3 className="font-semibold  text-base my-3">Client Information</h3>
          <ul className="md:grid grid-cols-2  !mt-5 gap-2 space-y-2 md:space-y-0">
            <li>
              <span className="text-sm text-default-600 ">Name :</span>{" "}
              <span className="text-default-500 "> Ahmed</span>
            </li>
            <li>
              <span className="text-sm text-default-600 ">Phone Number : </span>{" "}
              <span className="text-default-500">011223344555</span>
            </li>
            <li className="col-span-2">
              <span className="text-sm text-default-600 ">
                Email Address :{" "}
              </span>{" "}
              <span className="text-default-500 "> abc@gmail.com</span>
            </li>
          </ul>
          <hr className="my-8" />
          <h3 className="font-semibold  text-base my-3">Court Details</h3>

          <ul className="md:grid grid-cols-2  !mt-5 gap-2 space-y-2 md:space-y-0">
            <li>
              <span className="text-sm text-default-600 ">Court Name : </span>{" "}
              <span className="text-default-500 "> Aswan Court</span>
            </li>
            <li>
              <span className="text-sm text-default-600 ">Room Number : </span>
              <span className="text-default-500 ">22</span>
            </li>
            <li>
              <span className="text-sm text-default-600 ">Address : </span>{" "}
              <span className="text-default-500 "> In Vacation</span>
            </li>
            <li>
              <span className="text-sm text-default-600 ">
                Court Category :
              </span>{" "}
              <span className="text-default-500"> Criminals</span>
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
