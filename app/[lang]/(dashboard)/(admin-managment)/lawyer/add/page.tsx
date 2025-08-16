"use client";

import { Auth } from "@/components/auth/Auth";
import { getAllRoles } from "@/services/permissionsAndRoles/permissionsAndRoles";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Form from "./Form";

import { useAllowedRoles } from "@/config/useAllowedRoles";

// Zod validation schema

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
