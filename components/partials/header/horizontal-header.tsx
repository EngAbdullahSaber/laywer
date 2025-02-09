"use client";

import React from "react";
import { Search } from "lucide-react";
import Image from "next/image";
import Logo from "@/public/images/auth/LawyerLogo.png";

import Link from "next/link";
import { websiteName } from "@/config/constants";
import { useTranslate } from "@/config/useTranslation";

const horizontalHeader = ({
  handleOpenSearch,
}: {
  handleOpenSearch: () => void;
}) => {
  const { t, loading, error } = useTranslate();

  return (
    <div className="flex items-center lg:gap-12 gap-3 ">
      <div>
        <Link
          href="/dashboard"
          className=" text-primary flex items-center gap-2"
        >
          <Image
            src={Logo}
            height={32}
            width={32}
            alt="logo"
            className="w-8 h-8"
            priority={true}
          />{" "}
          <span className=" text-xl font-semibold lg:inline-block hidden">
            {" "}
            {websiteName}
          </span>
        </Link>
      </div>
      <button
        onClick={handleOpenSearch}
        className=" inline-flex lg:gap-2 lg:mr-0 mr-2 items-center text-default-600 text-sm"
      >
        {/* <span>
          <Search className=" h-4 w-4" />
        </span>
        <span className=" lg:inline-block hidden"> {t("Search")}</span> */}
      </button>
    </div>
  );
};

export default horizontalHeader;
