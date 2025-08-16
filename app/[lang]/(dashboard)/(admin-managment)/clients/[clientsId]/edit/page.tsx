"use client";

import { Auth } from "@/components/auth/Auth";
import {
  getAllRoles,
  getSpecifiedRole,
} from "@/services/permissionsAndRoles/permissionsAndRoles";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Form from "./Form";
import { clearAuthInfo } from "@/services/utils";
import { useAccessToken } from "@/config/accessToken";
import { updateAxiosHeader } from "@/services/axios";
import { useSelector } from "react-redux";
import { useAllowedRoles } from "@/config/useAllowedRoles";

// Zod validation schema
interface RootState {
  user: any; // Adjust this based on your actual state shape
}
const PageWithAuth = () => {
  const { lang } = useParams();
  const { allowedRoles, loading, error } = useAllowedRoles();

  // Loading state while allowedRoles is being fetched
  if (!allowedRoles) {
    return; // Or <Loading />
  }

  const ProtectedPage = Auth({ allowedRoles })(() => <Form />);

  return <ProtectedPage />;
};

export default PageWithAuth;
