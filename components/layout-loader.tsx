"use client";
import React from "react";
import Logo from "@/public/images/auth/LawyerLogo.png";
import Image from "next/image";

import { Loader2 } from "lucide-react";
import { useTranslate } from "@/config/useTranslation";
const LayoutLoader = () => {
  const { t } = useTranslate();

  return (
    <div
      className=" h-screen flex items-center justify-center  flex-col space-y-2"
      style={{
        backgroundImage: "linear-gradient(180deg, #31291E 0%, #000080 100%)",
      }}
    >
      <Image
        src={Logo}
        height={112}
        width={128}
        alt="logo"
        className="w-32 h-28"
        priority={true}
      />{" "}
      <span className=" inline-flex gap-1 text-white text-xl">
        <Loader2 className="mr-2 h-4 w-4 animate-spin  " />
        جارى التحميل...
      </span>
    </div>
  );
};

export default LayoutLoader;
