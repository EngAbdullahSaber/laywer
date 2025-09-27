"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslate } from "@/config/useTranslation";
import TableData from "./TableData";
import BreadcrumbComponent from "../../(category-mangement)/shared/BreadcrumbComponent";
import { motion } from "framer-motion";
import { Auth } from "@/components/auth/Auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import { exportToExcel } from "@/config/ExportButoons";

import { getAllRoles } from "@/services/permissionsAndRoles/permissionsAndRoles";
import { useAccessToken } from "@/config/accessToken";
import { updateAxiosHeader } from "@/services/axios";
import CreateTransactionComponent from "../transaction/CreateTransactionComponent";
import TransactionTableData from "../transaction/TransactionTableData";
import { useAllowedRoles } from "@/config/useAllowedRoles";
import { getFile } from "@/services/archieved-cases/archieved-cases";

const PageWithAuth = () => {
  const { t } = useTranslate();
  const { lang } = useParams();
  const [flag, setFlag] = useState(false);
  const permissionString = localStorage.getItem("permissions");
  const permission = permissionString ? JSON.parse(permissionString) : null;
  const { allowedRoles, loading, error } = useAllowedRoles();
  const [data, setData] = useState<any>([]);

  // Loading state while allowedRoles is being fetched
  if (!allowedRoles) {
    return; // Or <Loading />
  }
  const getExcelFileData = async () => {
    try {
      const res = await getFile(lang);

      setData(res?.body?.file || []);
      window.open(res?.body?.file, "_blank");
      console.log(res?.body?.file);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };
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
                {t("Case List")}
              </div>{" "}
              <BreadcrumbComponent header={"Cases"} body={"Case List"} />
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
                ?.find((item: any) => item.id === 12 || item.id === 138)
                ?.permissions.some(
                  (item: any) => item.id === 14 || item.id === 140
                ) && (
                <a href={"cases-archieved/add"}>
                  <Button className=" !bg-[#dfc77d] hover:!bg-[#fef0be] text-black">
                    {t("Create Case")}
                  </Button>
                </a>
              )}
            </motion.div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle> {t("Case List Details")}</CardTitle>
            </CardHeader>
            <CardContent>
              <TableData />
            </CardContent>
          </Card>
        </div>
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
