"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getSpecifiedRole } from "@/services/permissionsAndRoles/permissionsAndRoles";
import { updateAxiosHeader } from "@/services/axios";
import { useAccessToken } from "@/config/accessToken";
import { useSelector } from "react-redux";

interface RootState {
  user: any;
}

export const useAllowedRoles = () => {
  const { lang } = useParams();
  const [allowedRoles, setAllowedRoles] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const accessToken = useAccessToken();
  const userData = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (accessToken) {
      updateAxiosHeader(accessToken);
    }
  }, [accessToken]);

  const getServicesData = async () => {
    try {
      setLoading(true);
      if (accessToken) {
        updateAxiosHeader(accessToken);
      }

      const res = await getSpecifiedRole(lang, userData.roleId);
      setAllowedRoles(["super_admin", res.body.role.name]);
      setError(null);
    } catch (error: any) {
      setError(error);
      const status = error?.response?.status;

      if (status === 401) {
        // Handle 401 errors if needed
      } else {
        console.error("An unexpected error occurred:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData?.roleId) {
      getServicesData();
    }
  }, [userData?.roleId, lang]);

  return { allowedRoles, loading, error };
};
