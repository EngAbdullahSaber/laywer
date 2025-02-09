"use client";
import React from "react";
import { usePathname } from "next/navigation";
const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  const location = usePathname();

  return <React.Fragment>{children}</React.Fragment>;
};

export default ProfileLayout;
