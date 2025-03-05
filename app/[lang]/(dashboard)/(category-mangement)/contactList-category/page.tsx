"use client";

import BreadcrumbComponent from "../shared/BreadcrumbComponent";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslate } from "@/config/useTranslation";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import TableData from "./TableData";
import CreateContactListCategory from "./CreateContactListCategory";
import { motion } from "framer-motion";
import {  exportToExcel } from "@/config/ExportButoons";
import { Auth } from "@/components/auth/Auth";

const page = () => {
  const { t } = useTranslate();
  const [flag, setFlag] = useState(false);
  return (
    <div className="space-y-5">
      <div className="flex sm:flex-row xs:gap-5 xs:flex-col justify-between items-center my-5">
        <motion.div
          initial={{ x: 15 }}
          whileInView={{ x: 0 }}
          transition={{ duration: 1.7 }}
        >
          <div className=" text-default-900 text-2xl font-bold my-2">
            {t("Contact Lists Category")}
          </div>{" "}
          <BreadcrumbComponent
            header={"Contact Lists"}
            body={"Contact List Category"}
          />
        </motion.div>
        <motion.div
          initial={{ x: -15 }}
          whileInView={{ x: 0 }}
          transition={{ duration: 1.7 }}
          className="flex sm:flex-row  xs:flex-col gap-[10px] justify-between items-center"
        >
          <CreateContactListCategory
            buttonShape={true}
            setFlag={setFlag}
            flag={flag}
          />
        </motion.div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle> {t("Contact List Category Detail")}</CardTitle>
        </CardHeader>
        <CardContent>
          <TableData flag={flag} />
        </CardContent>
      </Card>
    </div>
  );
};

const allowedRoles = ["super_admin"];

const ProtectedComponent = Auth({ allowedRoles })(page);

export default ProtectedComponent;
