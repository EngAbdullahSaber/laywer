"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslate } from "@/config/useTranslation";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import TableData from "./columns";
import CreateCourt from "./CreateCourt";
import BreadcrumbComponent from "../(user-mangement)/shared/BreadcrumbComponent";

const page = () => {
  const { t, loading, error } = useTranslate();

  return (
    <div className="space-y-5">
      <div className="flex sm:flex-row xs:gap-5 xs:flex-col justify-between items-center my-5">
        <div>
          <div className=" text-default-900 text-2xl font-bold my-2">
            {t("Courts")}
          </div>{" "}
          <BreadcrumbComponent header={"Courts"} body={"Courts List"} />
        </div>
        <div className="flex sm:flex-row  xs:flex-col gap-[10px] justify-between items-center">
          <CreateCourt />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle> {t("Courts Details")}</CardTitle>
        </CardHeader>
        <CardContent>
          <TableData />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
