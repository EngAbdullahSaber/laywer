"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslate } from "@/config/useTranslation";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import TableData from "./TableData";
import BreadcrumbComponent from "../../(category-mangement)/shared/BreadcrumbComponent";
import Link from "next/link";
import { motion } from "framer-motion";
import { exportToExcel } from "@/config/ExportButoons";
import { Auth } from "@/components/auth/Auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useParams } from "next/navigation";
import { getLawyerFile } from "@/services/lawyer/lawyer";
import { getAllRoles } from "@/services/permissionsAndRoles/permissionsAndRoles";
import { clearAuthInfo } from "@/services/utils";
import { updateAxiosHeader } from "@/services/axios";
import { useAccessToken } from "@/config/accessToken";
import { useAllowedRoles } from "@/config/useAllowedRoles";

const PageWithAuth = () => {
  const { t } = useTranslate();
  const [data, setData] = useState<any>([]);
  const { lang } = useParams();
  const permissionString = localStorage.getItem("permissions");
  const permission = permissionString ? JSON.parse(permissionString) : null;

  const getExcelFileData = async () => {
    try {
      const res = await getLawyerFile(lang);

      setData(res?.body?.file || []);
      window.open(res?.body?.file, "_blank");
      console.log(res?.body?.file);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };
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
            {t("Lawyer")}
          </div>{" "}
          <BreadcrumbComponent header={"Lawyers"} body={"Lawyers List"} />
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
            .find((item: any) => item.id === 20 || item.id === 146)
            .permissions.some(
              (item: any) => item.id === 22 || item.id === 148
            ) && (
            <a href={"lawyer/add"}>
              <Button className=" !bg-[#dfc77d] hover:!bg-[#fef0be] text-black">
                {t("Create Lawyer")}
              </Button>
            </a>
          )}
        </motion.div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle> {t("Lawyer Details")}</CardTitle>
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
