"use client";

import React, { useEffect, useState } from "react";
import { Auth } from "@/components/auth/Auth";
import { useParams } from "next/navigation";
import {
  getAllRoles,
  getSpecifiedRole,
} from "@/services/permissionsAndRoles/permissionsAndRoles";

import { clearAuthInfo } from "@/services/utils";
import Strcuture from "./Strcuture";
import { updateAxiosHeader } from "@/services/axios";
import { useAccessToken } from "@/config/accessToken";
import { useSelector } from "react-redux";
import { useAllowedRoles } from "@/config/useAllowedRoles";
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

  const ProtectedPage = Auth({ allowedRoles })(() => <Strcuture />);

  return <ProtectedPage />;
};

export default PageWithAuth;
