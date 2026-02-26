"use client";
import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslate } from "@/config/useTranslation";

const countries = [
  { id: "+966", value: "+966", label: "KSA", labelAr: "المملكة العربية السعودية" },
  { id: "+20", value: "+20", label: "Egypt", labelAr: "مصر" },
  { id: "+971", value: "+971", label: "UAE", labelAr: "الإمارات" },
  { id: "+965", value: "+965", label: "Kuwait", labelAr: "الكويت" },
  { id: "+968", value: "+968", label: "Oman", labelAr: "عمان" },
  { id: "+973", value: "+973", label: "Bahrain", labelAr: "البحرين" },
  { id: "+974", value: "+974", label: "Qatar", labelAr: "قطر" },
  { id: "+962", value: "+962", label: "Jordan", labelAr: "الأردن" },
  { id: "+961", value: "+961", label: "Lebanon", labelAr: "لبنان" },
  { id: "+212", value: "+212", label: "Morocco", labelAr: "المغرب" },
];

const arabicDigitsMap: { [key: string]: string } = {
  "0": "٠", "1": "١", "2": "٢", "3": "٣", "4": "٤",
  "5": "٥", "6": "٦", "7": "٧", "8": "٨", "9": "٩",
};

const toArabicDigits = (numStr: string) =>
  numStr.replace(/\d/g, (d) => arabicDigitsMap[d]);

export interface PhoneInputProps {
  value: string;
  onChange: (e: any) => void;
  name: string;
  placeholder?: string;
  id?: string;
  countryCode: string;
  onCountryCodeChange: (code: string) => void;
  className?: string;
  disabled?: boolean;
}

export const PhoneInput = ({
  value,
  onChange,
  name,
  placeholder,
  id,
  countryCode,
  onCountryCodeChange,
  className,
  disabled = false,
}: PhoneInputProps) => {
  const { t, lang } = useTranslate();
  const isRtl = lang === "ar";

  // Strip country code prefix from value to get raw number digits only
  const rawNumber = React.useMemo(() => {
    if (!value) return "";
    const stripped = value.startsWith(countryCode) ? value.slice(countryCode.length) : value;
    return stripped.replace(/\D/g, "");
  }, [value, countryCode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
    
    // Emit a synthetic event so parent handlers can destructure e.target
    onChange({
      target: {
        name,
        value: countryCode + digits,
      },
    });
  };

  const handleCountryChange = (newCode: string) => {
    onCountryCodeChange(newCode);

    // Also update parent value with new country code immediately
    onChange({
      target: {
        name,
        value: newCode + rawNumber,
      },
    });
  };

  return (
    <div
      className={cn(
        "group flex items-stretch h-10 w-full rounded-lg border border-default-300 bg-background transition duration-300 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 overflow-hidden",
        disabled && "opacity-50 cursor-not-allowed bg-default-50",
        isRtl ? "flex-row-reverse" : "flex-row",
        className
      )}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={disabled}>
          <Button
            variant="ghost"
            type="button"
            className={cn(
              "flex items-center gap-1 px-3 h-full rounded-none hover:bg-default-100 transition-colors border-default-300",
              isRtl ? "border-s" : "border-e"
            )}
            disabled={disabled}
          >
            <span className="text-xs font-semibold text-default-700" dir="ltr">
              {countryCode}
            </span>
            <ChevronDown className="h-3 w-3 text-default-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-64 max-h-[300px] overflow-y-auto"
          align={isRtl ? "end" : "start"}
          sideOffset={4}
        >
          {countries.map((country) => (
            <DropdownMenuItem
              key={country.id}
              className="flex justify-between items-center cursor-pointer py-2 px-3"
              onClick={() => handleCountryChange(country.id)}
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {isRtl ? country.labelAr : country.label}
                </span>
                <span className="text-xs text-default-500 font-mono" dir="ltr">
                  {isRtl ? toArabicDigits(country.value) : country.value}
                </span>
              </div>
              {country.id === countryCode && (
                <div className="w-2 h-2 rounded-full bg-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="flex-1" dir="ltr">
        <input
          id={id}
          name={name}
          type="text"
          inputMode="numeric"
          dir="ltr"
          value={rawNumber}
          onChange={handleInputChange}
          disabled={disabled}
          className="w-full h-full border-none focus:outline-none focus:ring-0 bg-transparent px-3 text-sm placeholder:text-default-400 text-left"
          placeholder={placeholder || (isRtl ? "أدخل رقم الهاتف" : "Enter phone number")}
        />
      </div>
    </div>
  );
};