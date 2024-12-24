"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslate } from "@/config/useTranslation";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import TableData from "./columns";
import BreadcrumbComponent from "../(user-mangement)/shared/BreadcrumbComponent";
import CreateDate from "./CreateDate";

const page = () => {
  const { t, loading, error } = useTranslate();

  return (
    <div className="space-y-5">
      <div className="flex sm:flex-row xs:gap-5 xs:flex-col justify-between items-center my-5">
        <div>
          <div className=" text-default-900 text-2xl font-bold my-2">
            {t("Messages List")}
          </div>{" "}
          <BreadcrumbComponent header={"Messages"} body={"Messages List"} />
        </div>
        <div className="flex sm:flex-row  xs:flex-col gap-[10px] justify-between items-center">
          <CreateDate />
        </div>
      </div>

      <Card className="my-4">
        <div className="flex flex-row  !flex-nowrap justify-between items-center p-4 rounded-xl my-3">
          <div className="flex flex-col gap-3 justify-between items-start">
            <p className="font-bold text-xl  text-[#1A1A1A] dark:text-slate-400">
              اريد ان احجز قضية جديدة
            </p>
            <p className="font-semibold  text-base text-[#1A1A1A] dark:text-slate-400">
              {" "}
              اسم العميل : <span className="font-bold">احمد على</span>
            </p>

            <p className="font-semibold  text-base text-[#1A1A1A] dark:text-slate-400">
              العنوان <span className="font-bold">الرياض</span>
            </p>
            <p className="font-semibold  text-base text-[#1A1A1A] dark:text-slate-400">
              تاريح الارسال:{" "}
              <span className="font-bold">September 12, 2024 </span>
            </p>
            <p className="font-semibold  text-base text-[#1A1A1A] dark:text-slate-400">
              تاريح المقابلة مع المحامى:{" "}
              <span className="font-bold">September 16, 2024 </span>
            </p>
          </div>
          <div className="flex flex-col justify-center items-center gap-6">
            {" "}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default page;
