"use client";

import BreadcrumbComponent from "../shared/BreadcrumbComponent";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslate } from "@/config/useTranslation";

import TableData from "./TableData";
import CreateStaffCategory from "./CreateStaffCategory";
import { motion } from "framer-motion";
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
          {" "}
          <div className=" text-default-900 text-2xl font-bold my-2">
            {t("Staff Category")}
          </div>{" "}
          <BreadcrumbComponent header={"Staff"} body={"Staff Category"} />
        </motion.div>
        <motion.div
          initial={{ x: -15 }}
          whileInView={{ x: 0 }}
          transition={{ duration: 1.7 }}
          className="flex sm:flex-row  xs:flex-col gap-[10px] justify-between items-center"
        >
          <CreateStaffCategory
            buttonShape={true}
            setFlag={setFlag}
            flag={flag}
          />
        </motion.div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle> {t("Staff Category Details")}</CardTitle>
        </CardHeader>
        <CardContent>
          <TableData flag={flag} />
        </CardContent>
      </Card>
    </div>
  );
};

const allowedRoles = ["super_admin", "admin", "secretary"];

const ProtectedComponent = Auth({ allowedRoles })(page);

export default ProtectedComponent;
