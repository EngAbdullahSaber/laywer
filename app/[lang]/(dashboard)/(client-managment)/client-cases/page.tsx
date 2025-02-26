"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslate } from "@/config/useTranslation";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";
import TableData from "./TableData";
import { motion } from "framer-motion";
import { downloadPDF, exportToExcel } from "@/config/ExportButoons";
import BreadcrumbComponent from "../../(category-mangement)/shared/BreadcrumbComponent";
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
          <div className="text-default-900 text-2xl font-bold my-2">
            {t("Case List")}
          </div>
          <BreadcrumbComponent header={"Cases"} body={"Case List"} />
        </motion.div>
        <motion.div
          initial={{ x: -15 }}
          whileInView={{ x: 0 }}
          transition={{ duration: 1.7 }}
          className="flex sm:flex-row  xs:flex-col gap-[10px] justify-between items-center"
        >
          <Button color="secondary" variant="outline" onClick={exportToExcel}>
            <Icon icon="lets-icons:export" className="h-5 w-5" />
            {t("Export Excel")}
          </Button>
          <Button color="secondary" variant="outline" onClick={downloadPDF}>
            <Icon icon="lets-icons:export" className="h-5 w-5" />
            {t("Export PDF")}
          </Button>
        </motion.div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            <motion.div
              initial={{ y: -15 }}
              whileInView={{ y: 0 }}
              transition={{ duration: 1.7 }}
            >
              {t("Case List Details")}
            </motion.div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TableData />
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth(page);
