"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslate } from "@/config/useTranslation";
import { motion } from "framer-motion";
import BreadcrumbComponent from "../../(category-mangement)/shared/BreadcrumbComponent";
import TableData from "./TableData";
import { Auth } from "@/components/auth/Auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { getAllRoles } from "@/services/permissionsAndRoles/permissionsAndRoles";
import { clearAuthInfo } from "@/services/utils";
import { useAccessToken } from "@/config/accessToken";
import { updateAxiosHeader } from "@/services/axios";
import { useAllowedRoles } from "@/config/useAllowedRoles";

const PageWithAuth = () => {
  const { t } = useTranslate();
  const [flag, setFlag] = useState(false);
  const [data, setData] = useState<any>([]);
  const { lang } = useParams();

  const { allowedRoles, loading, error } = useAllowedRoles();

  // Loading state while allowedRoles is being fetched
  if (!allowedRoles) {
    return; // Or <Loading />
  }

  // Wrap the actual page component in Auth once allowedRoles are available
  const ProtectedPage = Auth({ allowedRoles })(() => (
    <div className="space-y-5">
      <div className="flex sm:flex-row xs:gap-5 xs:flex-col justify-between items-center my-5">
        <motion.div
          initial={{ x: 15 }}
          whileInView={{ x: 0 }}
          transition={{ duration: 1.7 }}
        >
          <div className=" text-default-900 text-2xl font-bold my-2">
            {t("Roles")}
          </div>
          <BreadcrumbComponent header={"Roles"} body={"Roles List"} />
        </motion.div>
        <motion.div
          initial={{ x: -15 }}
          whileInView={{ x: 0 }}
          transition={{ duration: 1.7 }}
          className="flex sm:flex-row  xs:flex-col gap-[10px] justify-between items-center"
        >
          <a href={"roles/add"}>
            <Button className=" !bg-[#dfc77d] hover:!bg-[#fef0be] text-black">
              {t("Create Roles")}
            </Button>
          </a>
        </motion.div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("Roles Details")}</CardTitle>
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
