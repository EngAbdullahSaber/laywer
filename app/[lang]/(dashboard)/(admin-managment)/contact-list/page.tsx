"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslate } from "@/config/useTranslation";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import TableData from "./TableData";
import CreateContact from "./CreateContact";
import { motion } from "framer-motion";
import { exportToExcel } from "@/config/ExportButoons";
import BreadcrumbComponent from "../../(category-mangement)/shared/BreadcrumbComponent";
import { Auth } from "@/components/auth/Auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useParams } from "next/navigation";
import { getContactListFile } from "@/services/contact-list/contact-list";
import { getAllRoles } from "@/services/permissionsAndRoles/permissionsAndRoles";
import { clearAuthInfo } from "@/services/utils";
import { updateAxiosHeader } from "@/services/axios";
import { useAccessToken } from "@/config/accessToken";

const PageWithAuth = () => {
  const { t } = useTranslate();
  const [flag, setFlag] = useState(false);
  const [loading, setLoading] = useState(true);
  const { lang } = useParams();
  const [data, setData] = useState<any>([]);
  const [allowedRoles, setAllowedRoles] = useState<string[] | null>(null);

  const permissionString = localStorage.getItem("permissions");
  const permission = permissionString ? JSON.parse(permissionString) : null;
  const getExcelFileData = async () => {
    try {
      const res = await getContactListFile(lang);

      setData(res?.body?.file || []);
      window.open(res?.body?.file, "_blank");
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const accessToken = useAccessToken();
  if (accessToken) {
    updateAxiosHeader(accessToken);
  }
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
          // clearAuthInfo();
          // window.location.replace("/auth/login");
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
            {t("Contact List")}
          </div>{" "}
          <BreadcrumbComponent header={"Contacts"} body={"Contact List"} />
        </motion.div>
        <motion.div
          initial={{ x: -15 }}
          whileInView={{ x: 0 }}
          transition={{ duration: 1.7 }}
          className="flex sm:flex-row  xs:flex-col gap-[10px] justify-between items-center"
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button color="secondary" variant="outline">
                <Icon icon="lets-icons:export" className="h-5 w-5" />
                {t("Export Excel")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[196px]" align="start">
              <DropdownMenuItem onClick={exportToExcel}>
                {t("Current Page")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={getExcelFileData}>
                {t("All Data")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {permission
            .find((item: any) => item.id === 45)
            .permissions.some((item: any) => item.id === 47) && (
            <CreateContact setFlag={setFlag} flag={flag} />
          )}
        </motion.div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle> {t("Contact List Details")}</CardTitle>
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
