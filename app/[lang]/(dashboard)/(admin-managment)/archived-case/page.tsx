"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslate } from "@/config/useTranslation";
import TableData from "./TableData";
import BreadcrumbComponent from "../../(category-mangement)/shared/BreadcrumbComponent";
import { motion } from "framer-motion";
import { Auth } from "@/components/auth/Auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useParams } from "next/navigation";
import { getAllRoles } from "@/services/permissionsAndRoles/permissionsAndRoles";
import { useAccessToken } from "@/config/accessToken";
import { updateAxiosHeader } from "@/services/axios";
import CreateTransactionComponent from "../transaction/CreateTransactionComponent";
import TransactionTableData from "../transaction/TransactionTableData";

const PageWithAuth = () => {
  const { t } = useTranslate();
  const { lang } = useParams();
  const [flag, setFlag] = useState(false);
  const permissionString = localStorage.getItem("permissions");
  const permission = permissionString ? JSON.parse(permissionString) : null;
  const [allowedRoles, setAllowedRoles] = useState<string[] | null>(null);
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
        // if (message === "please login first") {
        //   console.warn("User not authenticated, redirecting to login...");
        //   clearAuthInfo();
        //   window.location.replace("/auth/login");
        // } else if (message === "Unauthorized" || message === "غير مصرح") {
        //   console.warn("User unauthorized, redirecting to 403 page...");
        //   window.location.replace("/error-page/403");
        // }
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
    <Tabs defaultValue="Answered" className="">
      <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 h-20 sm:h-12">
        <TabsTrigger value="Answered">{t("Archived Case Lists")}</TabsTrigger>
        <TabsTrigger value="NotAnswered">{t("Transaction List")}</TabsTrigger>
      </TabsList>
      <TabsContent value="Answered">
        <div className="space-y-5">
          <div className="flex sm:flex-row xs:gap-5 xs:flex-col justify-between items-center my-5">
            <motion.div
              initial={{ x: 15 }}
              whileInView={{ x: 0 }}
              transition={{ duration: 1.7 }}
            >
              <div className=" text-default-900 text-2xl font-bold my-2">
                {t("Archived Case Lists")}
              </div>{" "}
              <BreadcrumbComponent
                header={"Archived Cases"}
                body={"Archived Case Lists"}
              />
            </motion.div>
            <motion.div
              initial={{ x: -15 }}
              whileInView={{ x: 0 }}
              transition={{ duration: 1.7 }}
              className="flex sm:flex-row  xs:flex-col gap-[10px] justify-between items-center"
            ></motion.div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle> {t("Archived Case List Details")}</CardTitle>
            </CardHeader>
            <CardContent>
              <TableData />
            </CardContent>
          </Card>
        </div>{" "}
      </TabsContent>{" "}
      <TabsContent value="NotAnswered">
        {" "}
        <div className="flex sm:flex-row xs:gap-5 xs:flex-col justify-between items-center my-5">
          <motion.div
            initial={{ x: 15 }}
            whileInView={{ x: 0 }}
            transition={{ duration: 1.7 }}
          >
            <div className=" text-default-900 text-2xl font-bold my-2">
              {t("Transaction List")}
            </div>{" "}
            <BreadcrumbComponent
              header={"Transaction"}
              body={"Transaction List"}
            />
          </motion.div>
          <motion.div
            initial={{ x: -15 }}
            whileInView={{ x: 0 }}
            transition={{ duration: 1.7 }}
            className="flex sm:flex-row  xs:flex-col gap-[10px] justify-between items-center"
          >
            {permission
              .find((item: any) => item.parent_key_name == "api.transactions")
              .permissions.some(
                (item: any) => item.name == "Create" || item.name == "انشاء"
              ) && <CreateTransactionComponent flag={flag} setFlag={setFlag} />}
          </motion.div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle> {t("Transaction List Details")}</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionTableData flag={flag} />
          </CardContent>
        </Card>
      </TabsContent>{" "}
    </Tabs>
  ));
  return <ProtectedPage />;
};

export default PageWithAuth;
