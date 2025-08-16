"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslate } from "@/config/useTranslation";
import { Button } from "@/components/ui/button";
import BreadcrumbComponent from "../../(category-mangement)/shared/BreadcrumbComponent";
import Link from "next/link";
import { motion } from "framer-motion";
import TableData from "./TableData";
import { Auth } from "@/components/auth/Auth";
import { useParams } from "next/navigation";
import { getAllRoles } from "@/services/permissionsAndRoles/permissionsAndRoles";
import { clearAuthInfo } from "@/services/utils";
import { updateAxiosHeader } from "@/services/axios";
import { useAccessToken } from "@/config/accessToken";
import { ImportFile } from "@/services/courts/courts";
import { UploadImage } from "@/services/auth/auth";
import { toast as reToast } from "react-hot-toast";
import { useAllowedRoles } from "@/config/useAllowedRoles";

const PageWithAuth = () => {
  const { t } = useTranslate();
  const [flag, setFlag] = useState(false);
  const permissionString = localStorage.getItem("permissions");
  const permission = permissionString ? JSON.parse(permissionString) : null;
  const [data, setData] = useState<any>([]);
  const { lang } = useParams();

  const { allowedRoles, loading, error } = useAllowedRoles();

  const getExcelFileData = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx,.xls,.csv";

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        // Show loading state

        // Upload the file
        const uploadFormData = new FormData();
        uploadFormData.append("image", file);
        const uploadRes = await UploadImage(uploadFormData, lang);

        if (!uploadRes?.body?.image_id) {
          throw new Error("Failed to upload file - no image_id returned");
        }

        // Prepare for import
        const importFormData = new FormData();
        importFormData.append("court_file", uploadRes.body.image_id);

        const importRes = await ImportFile(importFormData, lang);

        if (importRes) {
          setData(importRes);
          reToast.success(importRes.message || "File imported successfully");
        } else {
          throw new Error("No file data returned from import");
        }
      } catch (error) {
        console.error("File processing error:", error);

        // Dismiss any loading toasts first
        reToast.dismiss();

        // Handle different error formats
        const errorData = error.response?.data || error;

        // Main error message
        if (errorData.message) {
          reToast.error(errorData.message);
        } else {
          reToast.error("Failed to process file");
        }

        // Field-specific errors
        if (errorData.errors) {
          Object.entries(errorData.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages)) {
              messages.forEach((msg) => reToast.error(`${field}: ${msg}`));
            }
          });
        }
      }
    };

    input.click();
  };

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
            {t("Courts")}
          </div>{" "}
          <BreadcrumbComponent header={"Courts"} body={"Courts List"} />
        </motion.div>
        <motion.div
          initial={{ x: -15 }}
          whileInView={{ x: 0 }}
          transition={{ duration: 1.7 }}
          className="flex sm:flex-row  xs:flex-col gap-[10px] justify-between items-center"
        >
          {permission
            .find((item: any) => item.id === 33 || item.id === 159)
            .permissions.some(
              (item: any) => item.id === 35 || item.id === 161
            ) && (
            <a href={"courts/add"}>
              <Button className=" !bg-[#dfc77d] hover:!bg-[#fef0be] text-black">
                {t("Create a New Court")}
              </Button>
            </a>
          )}
          <Button
            color="secondary"
            variant="outline"
            onClick={getExcelFileData}
          >
            {t("Import Courts")}
          </Button>
        </motion.div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle> {t("Courts Details")}</CardTitle>
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
