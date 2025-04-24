"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslate } from "@/config/useTranslation";
import { Button } from "@/components/ui/button";
import BreadcrumbComponent from "../../(category-mangement)/shared/BreadcrumbComponent";
import Link from "next/link";
import { motion } from "framer-motion";
import TableData from "./TableData";
import { Auth } from "@/components/auth/Auth";
import { useParams } from "next/navigation";
import { getAllRoles } from "@/services/permissionsAndRoles/permissionsAndRoles";
import { clearAuthInfo } from "@/services/utils";

const PageWithAuth = () => {
  const { t } = useTranslate();
  const [flag, setFlag] = useState(false);
  const permissionString = localStorage.getItem("permissions");
  const permission = permissionString ? JSON.parse(permissionString) : null;
  const [data, setData] = useState<any>([]);
  const [allowedRoles, setAllowedRoles] = useState<string[] | null>(null);
  const { lang } = useParams();

  const getServicesData = async () => {
    try {
      const res = await getAllRoles(lang);

      const roles = Array.isArray(res?.body?.roles_and_permissions)
        ? res.body.roles_and_permissions.filter(
            (role: any) => role.role !== "client" && role.role !== "lawyer"
          )
        : [];

      setAllowedRoles(["super_admin", ...roles.map((r: any) => r.role)]);
    } catch (error: any) {
      const message = error?.response?.data?.message;
      const status = error?.response?.status;

      if (status === 401) {
        if (message === "please login first") {
          console.warn("User not authenticated, redirecting to login...");
          clearAuthInfo();
          window.location.replace("/auth/login");
        } else if (message === "Unauthorized" || message === "غير مصرح") {
          console.warn("User unauthorized, redirecting to 403 page...");
          window.location.replace("/error-page/403");
        }
      } else {
        console.error("An unexpected error occurred:", error);
        // You can add a fallback or show a toast here if needed
      }
    }
  };

  useEffect(() => {
    getServicesData();
  }, []);

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
            {t("Courts")}
          </div>{" "}
          <BreadcrumbComponent header={"Courts"} body={"Courts List"} />
        </motion.div>
        <motion.div
          initial={{ x: -15 }}
          whileInView={{ x: 0 }}
          transition={{ duration: 1.7 }}
          className="flex sm:flex-row  xs:flex-col gap-[10px] justify-between items-center"
        >
          {permission
            .find((item: any) => item.id === 33)
            .permissions.some((item: any) => item.id === 35) && (
            <Link href={"courts/add"}>
              <Button className=" !bg-[#dfc77d] hover:!bg-[#fef0be] text-black">
                {t("Create a New Court")}
              </Button>
            </Link>
          )}
        </motion.div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle> {t("Courts Details")}</CardTitle>
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
