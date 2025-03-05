"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslate } from "@/config/useTranslation";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import TableData from "./TableData";
import CreateTask from "./CreateTask";
import BreadcrumbComponent from "../../(category-mangement)/shared/BreadcrumbComponent";
import Link from "next/link";
import { motion } from "framer-motion";
import { exportToExcel } from "@/config/ExportButoons";
import { Auth } from "@/components/auth/Auth";

const page = () => {
  const { t, loading, error } = useTranslate();

  return (
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
          <Link href={"tasks/add"}>
            <Button className=" !bg-[#dfc77d] hover:!bg-[#fef0be] text-black">
              {t("Create Task")}
            </Button>
          </Link>{" "}
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
  );
};

const allowedRoles = ["super_admin"];

const ProtectedComponent = Auth({ allowedRoles })(page);

export default ProtectedComponent;
