"use client";

import React, { useEffect, useState } from "react";
import { Auth } from "@/components/auth/Auth";
import { useParams } from "next/navigation";
import { getAllRoles } from "@/services/permissionsAndRoles/permissionsAndRoles";

import { clearAuthInfo } from "@/services/utils";
import Strcuture from "./Strcuture";
const PageWithAuth = () => {
  const { lang } = useParams();
  const [allowedRoles, setAllowedRoles] = useState<string[] | null>(null);

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
        if (message === "please login first") {
          console.warn("User not authenticated, redirecting to login...");
          clearAuthInfo();
          window.location.replace("/auth/login");
        } else if (message === "Unauthorized" || message === "غير مصرح") {
          console.warn("User unauthorized, redirecting to 403 page...");
          window.location.replace("/error-page/403");
        }
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

  const ProtectedPage = Auth({ allowedRoles })(() => <Strcuture />);

  return <ProtectedPage />;
};

export default PageWithAuth;
