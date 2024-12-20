"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { data } from "./index";
import { columns } from "./columns";
import { useTranslate } from "@/config/useTranslation";

import { requiredFieldsVendors } from "@/config/columnsRequired";
import Create from "@/components/common/create/Create";
import { DataTable } from "../tables/advanced/components/data-table";

const page = () => {
  const { t, loading, error } = useTranslate();

  return (
    <div className="space-y-5">
      <div className="flex flex-row justify-between items-center my-5">
        <div>
          <div className=" text-default-900 text-2xl font-bold my-2">
            {t("Users")}
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle> {t("Users Details")} </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable data={data} columns={columns} />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
