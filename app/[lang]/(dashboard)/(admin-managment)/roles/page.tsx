"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslate } from "@/config/useTranslation";
import { motion } from "framer-motion";
import BreadcrumbComponent from "../../(category-mangement)/shared/BreadcrumbComponent";
import TableData from "./TableData";
import { Auth } from "@/components/auth/Auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
            {t("Roles")}
          </div>{" "}
          <BreadcrumbComponent header={"Roles"} body={"Roles List"} />
        </motion.div>
        <motion.div
          initial={{ x: -15 }}
          whileInView={{ x: 0 }}
          transition={{ duration: 1.7 }}
          className="flex sm:flex-row  xs:flex-col gap-[10px] justify-between items-center"
        >
          {/* <Link href={"roles/add"}>
            <Button className=" !bg-[#dfc77d] hover:!bg-[#fef0be] text-black">
              {t("Create Roles")}
            </Button>
          </Link>{" "} */}
        </motion.div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle> {t("Roles Details")}</CardTitle>
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
