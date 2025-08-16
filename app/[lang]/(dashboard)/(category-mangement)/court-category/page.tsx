"use client";

import BreadcrumbComponent from "../shared/BreadcrumbComponent";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslate } from "@/config/useTranslation";
import TableData from "./TableData";
import CreateCourtCategory from "./CreateCourtCategory";
import { motion } from "framer-motion";
import { Auth } from "@/components/auth/Auth";
import { useParams } from "next/navigation";
import { getAllRoles } from "@/services/permissionsAndRoles/permissionsAndRoles";
import { clearAuthInfo } from "@/services/utils";
import { useAccessToken } from "@/config/accessToken";
import { updateAxiosHeader } from "@/services/axios";
import { useAllowedRoles } from "@/config/useAllowedRoles";

const PageWithAuth = () => {
  const { t } = useTranslate();
  const [flag, setFlag] = useState(false);
  const permissionString = localStorage.getItem("permissions");
  const permission = permissionString ? JSON.parse(permissionString) : null;
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
            {t("Court Category")}
          </div>{" "}
          <BreadcrumbComponent header={"Courts"} body={"Court Category"} />
        </motion.div>
        <motion.div
          initial={{ x: -15 }}
          whileInView={{ x: 0 }}
          transition={{ duration: 1.7 }}
          className="flex sm:flex-row  xs:flex-col gap-[10px] justify-between items-center"
        >
          {permission
            .find((item: any) => item.id === 69 || item.id === 195)
            .permissions.some(
              (item: any) => item.id === 71 || item.id === 197
            ) && (
            <CreateCourtCategory
              buttonShape={true}
              setFlag={setFlag}
              flag={flag}
            />
          )}
        </motion.div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle> {t("Court Category Details")}</CardTitle>
        </CardHeader>
        <CardContent>
          <TableData flag={flag} />
        </CardContent>
      </Card>
    </div>
  ));

  return <ProtectedPage />;
};

export default PageWithAuth;
