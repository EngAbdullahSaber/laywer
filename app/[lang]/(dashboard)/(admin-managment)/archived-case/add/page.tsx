"use client";

import { Auth } from "@/components/auth/Auth";

import { useParams } from "next/navigation";
import Form from "./Form";

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
