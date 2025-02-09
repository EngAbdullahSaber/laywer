import React, { useState } from "react";
import BasicSelect from "@/app/[lang]/(dashboard)/(store-mangement)/shared/basic-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslate } from "@/config/useTranslation";

interface FilterConfig {
  label: string;
  placeholder?: string;
  type: "input" | "select";
  value?: string;
  options?: { label: string; value: string }[];
}

interface FilterProps {
  filtersConfig: FilterConfig[];
  onFilterChange: (filters: Record<string, string>) => void;
  onFilterSubmit: () => void;
}

export const Filter: React.FC<FilterProps> = ({
  filtersConfig,
  onFilterChange,
  onFilterSubmit,
}) => {
  const { t } = useTranslate();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const value = e.target.value;
    onFilterChange({ [field]: value });
  };

  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    field: string
  ) => {
    onFilterChange({ [field]: e.target.value });
  };

  const handleReset = () => {
    const resetFilters = filtersConfig.reduce((acc, filter) => {
      acc[filter.label] = "";
      return acc;
    }, {} as Record<string, string>);
    onFilterChange(resetFilters);
  };

  return (
    <div className="mt-[20px] flex flex-col gap-[10px]">
      {filtersConfig.map((filter, i) => (
        <div key={i} className="flex items-center gap-[10px]">
          {filter.type === "input" && (
            <div className="w-full flex flex-col gap-2">
              <Label className="capitalize">{t(filter.label)}</Label>
              <Input
                type="text"
                placeholder={t(filter.placeholder)}
                value={filter.value || ""}
                onChange={(e) => handleInputChange(e, filter.label)}
                minLength={1}
              />
            </div>
          )}
        </div>
      ))}

      <div className="flex justify-center gap-3 mt-4">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleReset}
        >
          {t("reset")}
        </Button>
        <Button type="button" className="w-full" onClick={onFilterSubmit}>
          {t("submit")}
        </Button>
      </div>
    </div>
  );
};
