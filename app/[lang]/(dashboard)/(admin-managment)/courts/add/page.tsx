"use client";

import { Auth } from "@/components/auth/Auth";
import { useParams } from "next/navigation";
import Form from "./Form";

import { useAllowedRoles } from "@/config/useAllowedRoles";

// Zod validation schema

const PageWithAuth = () => {
  const { lang } = useParams();

  const { allowedRoles, loading, error } = useAllowedRoles();

  const ProtectedPage = Auth({ allowedRoles })(() => <Form />);

  return <ProtectedPage />;
};

export default PageWithAuth;
