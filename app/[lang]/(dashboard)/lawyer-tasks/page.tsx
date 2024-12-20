"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslate } from "@/config/useTranslation";

import TableData from "./columns";
import BreadcrumbComponent from "../(user-mangement)/shared/BreadcrumbComponent";

const page = () => {
  const { t, loading, error } = useTranslate();

  return (
    <div className="space-y-5">
      <div className="flex sm:flex-row xs:gap-5 xs:flex-col justify-between items-center my-5">
        <div>
          <div className=" text-default-900 text-2xl font-bold my-2">
            Lawyer
          </div>{" "}
          <BreadcrumbComponent header={"Client"} body={"Client List"} />
        </div>
        <div className="flex sm:flex-row  xs:flex-col gap-[10px] justify-between items-center">
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle> Lawyer Details</CardTitle>
        </CardHeader>
        <CardContent>
          <TableData />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
