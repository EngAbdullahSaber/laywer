"use client";

import React, { useState } from "react";
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
const page = () => {
  const { t } = useTranslate();
  const [data, setData] = useState<any>([]);
  const { lang } = useParams();
  const permission = JSON.parse(localStorage.getItem("permissions"));

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
  return (
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
            .find((item: any) => item.id === 20)
            .permissions.some((item: any) => item.id === 22) && (
            <Link href={"lawyer/add"}>
              <Button className=" !bg-[#dfc77d] hover:!bg-[#fef0be] text-black">
                {t("Create Lawyer")}
              </Button>
            </Link>
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
  );
};

const allowedRoles = ["super_admin", "admin", "secretary"];

const ProtectedComponent = Auth({ allowedRoles })(page);

export default ProtectedComponent;
