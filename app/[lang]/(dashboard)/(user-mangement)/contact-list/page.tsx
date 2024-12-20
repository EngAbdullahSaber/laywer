"use client";

import BreadcrumbComponent from "../shared/BreadcrumbComponent";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslate } from "@/config/useTranslation";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import TableData from "./columns";
import CreateContact from "./CreateContact";

const page = () => {
  const { t, loading, error } = useTranslate();

  return (
    <div className="space-y-5">
      <div className="flex sm:flex-row xs:gap-5 xs:flex-col justify-between items-center my-5">
        <div>
          <div className=" text-default-900 text-2xl font-bold my-2">
            Contact List
          </div>{" "}
          <BreadcrumbComponent header={"Contact"} body={"Contact List"} />
        </div>
        <div className="flex sm:flex-row  xs:flex-col gap-[10px] justify-between items-center">
          <Button color="secondary" variant="outline">
            <Icon icon="lets-icons:export" className="h-5 w-5" />
            Export Excel
          </Button>
          <Button color="secondary" variant="outline">
            <Icon icon="lets-icons:export" className="h-5 w-5" />
            Export PDF
          </Button>
          <CreateContact />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle> Contact List Details</CardTitle>
        </CardHeader>
        <CardContent>
          <TableData />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
