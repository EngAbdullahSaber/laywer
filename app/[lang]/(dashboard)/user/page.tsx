"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import TableData from "./TableData";
import { useTranslate } from "@/config/useTranslation";
import Create from "@/components/common/create/Create";
import { requiredFieldsUser } from "@/config/columnsRequired";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import BreadcrumbComponent from "../(category-mangement)/shared/BreadcrumbComponent";
const page = () => {
  const { t, loading, error } = useTranslate();

  return (
    <div className="space-y-5">
      <div className="flex sm:flex-row xs:gap-5 xs:flex-col justify-between items-center my-5">
        <div>
          <div className=" text-default-900 text-2xl font-bold my-2">
            {t("UserManagment.user.User Management")}
          </div>
          <BreadcrumbComponent
            header={"UserManagment.user.User Management"}
            body={"UserManagment.user.User"}
          />
        </div>
        <div className="flex sm:flex-row  xs:flex-col gap-[10px] justify-between items-center">
          <Button color="secondary" variant="outline">
            <Icon icon="lets-icons:export" className="h-5 w-5" />
            {t("management.retailers.Export Excel")}
          </Button>
          <Button color="secondary" variant="outline">
            <Icon icon="lets-icons:export" className="h-5 w-5" />
            {t("management.retailers.Export PDF")}
          </Button>
          <Create
            titleBtn={t("Create User")}
            titleHeader={t("Create a New User")}
            requiredFields={requiredFieldsUser}
          />
        </div>
        {/* <CreateUser t={t} /> */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle> {t("UserManagment.user.User Details")}</CardTitle>
        </CardHeader>
        <CardContent>
          <TableData t={t} />
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
