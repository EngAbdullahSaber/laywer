"use client";
import Image from "next/image";
import lightImage from "@/public/images/error/light-403.png";
import darkImage from "@/public/images/error/dark-403.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useTranslate } from "@/config/useTranslation";
const ErrorPage = () => {
  const { theme } = useTheme();
  const { t } = useTranslate();

  return (
    <div className="min-h-screen  overflow-y-auto flex justify-center items-center p-10">
      <div className="w-full flex flex-col items-center">
        <div className="max-w-[542px]">
          <Image
            src={theme === "dark" ? darkImage : lightImage}
            alt="error image"
            className="w-full h-full object-cover"
            priority={true}
          />
        </div>
        <div className="mt-16 text-center">
          <div className="text-2xl md:text-4xl lg:text-5xl font-semibold text-default-900">
            {t("Ops! Access Denied")}
          </div>
          <div className="mt-3 text-default-600 text-sm md:text-base">
            {t(
              "The page you are looking for might have been removed had its name changed or is temporarily unavailable"
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
