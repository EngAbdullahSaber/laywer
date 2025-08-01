"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import flag1 from "@/public/images/all-img/flag-1.png";
import flag2 from "@/public/images/all-img/flag-2.png";
import flag3 from "@/public/images/all-img/flag-3.png";
import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";
import { useThemeStore } from "@/store";
import { useTranslate } from "@/config/useTranslation";
const languages = [
  {
    name: "en",
    flag: flag1,
  },

  {
    name: "ar",
    flag: flag3,
  },
];
const Language = () => {
  type Language = {
    name: string;
    flag: any;
    language?: string;
  };

  const router = useRouter();
  const pathname = usePathname();
  const { isRtl, setRtl } = useThemeStore();
  const found = pathname
    ? languages.find((lang) => pathname.includes(lang.name))
    : null;
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    found ?? languages[1]
  );

  useEffect(() => {
    setSelectedLanguage;
  }, []);

  const handleSelected = async (lang: string) => {
    await setSelectedLanguage({
      ...selectedLanguage,
      name: lang,
      language: lang === "en" ? "En" : "Ar",
    });
    setRtl(lang === "ar");
    if (pathname) {
      router.push(`/${lang}/${pathname.split("/")[2]}`);
    }
  };

  const { t, lang } = useTranslate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button type="button" className="bg-transparent hover:bg-transparent">
          <span className="w-6 h-6 text-black dark:text-white rounded-full me-1.5">
            {selectedLanguage.name.toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2">
        {languages.map((item, index) => (
          <DropdownMenuItem
            key={`flag-${index}`}
            className={cn(
              ` gap-[10px] justify-end  text-black dark:text-white dropdown-${item.name} py-1.5 px-2 cursor-pointer dark:hover:bg-background mb-[2px] last:mb-0`,
              {
                "bg-primary-100 ":
                  selectedLanguage && selectedLanguage.name === item.name,
              }
            )}
            onClick={() => handleSelected(item.name)}
          >
            <span className="text-sm  text-black dark:text-white  capitalize  ">
              {" "}
              {item.name == "en" ? "English" : "العربية"}{" "}
            </span>
            <div className="w-6 h-6 rounded-full me-1.5"></div>
            {/* {lang  == item.name && (<Check className="w-4 h-4 flex-none ltr:ml-auto rtl:mr-auto text-default-700" />)} */}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Language;
