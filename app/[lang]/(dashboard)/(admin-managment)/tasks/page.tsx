"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslate } from "@/config/useTranslation";
import { Button } from "@/components/ui/button";
import TableData from "./TableData";
import BreadcrumbComponent from "../../(category-mangement)/shared/BreadcrumbComponent";
import Link from "next/link";
import { motion } from "framer-motion";
import { Auth } from "@/components/auth/Auth";
import { getAllRoles } from "@/services/permissionsAndRoles/permissionsAndRoles";
import { useParams } from "next/navigation";
import { clearAuthInfo } from "@/services/utils";
import { useAccessToken } from "@/config/accessToken";
import { updateAxiosHeader } from "@/services/axios";
import { useAllowedRoles } from "@/config/useAllowedRoles";

const PageWithAuth = () => {
  const { t } = useTranslate();
  const permissionString = localStorage.getItem("permissions");
  const permission = permissionString ? JSON.parse(permissionString) : null;
  const [data, setData] = useState<any>([]);
  const { lang } = useParams();

  const { allowedRoles, loading, error } = useAllowedRoles();

  // Loading state while allowedRoles is being fetched
  if (!allowedRoles) {
    return; // Or <Loading />
  }
  const ProtectedPage = Auth({ allowedRoles })(() => (
    <div className="space-y-5">
      <div className="flex sm:flex-row xs:gap-5 xs:flex-col justify-between items-center my-5">
        <motion.div
          initial={{ x: 15 }}
          whileInView={{ x: 0 }}
          transition={{ duration: 1.7 }}
        >
          <div className=" text-default-900 text-2xl font-bold my-2">
            {t("Tasks")}
          </div>{" "}
          <BreadcrumbComponent header={"Tasks"} body={"Task List"} />
        </motion.div>
        <motion.div
          initial={{ x: -15 }}
          whileInView={{ x: 0 }}
          transition={{ duration: 1.7 }}
          className="flex sm:flex-row  xs:flex-col gap-[10px] justify-between items-center"
        >
          {permission
            .find((item: any) => item.id === 27 || item.id === 153)
            .permissions.some(
              (item: any) => item.id === 29 || item.id === 155
            ) && (
            <a href={"tasks/add"}>
              <Button className=" !bg-[#dfc77d] hover:!bg-[#fef0be] text-black">
                {t("Create Task")}
              </Button>
            </a>
          )}
        </motion.div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle> {t("Task Details")}</CardTitle>
        </CardHeader>
        <CardContent>
          <TableData />
        </CardContent>
      </Card>
    </div>
  ));
  return <ProtectedPage />;
};

export default PageWithAuth;
