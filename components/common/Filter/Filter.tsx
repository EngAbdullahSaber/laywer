import React from "react";
import BasicSelect from "@/components/common/Select/BasicSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslate } from "@/config/useTranslation";

interface FilterConfig {
  label: string;
  placeholder?: string;
  type: "input" | "select";
  value?: string;
  values?: { label: string; value: string }[]; // Ensure values is an array of objects with label and value
}

interface FilterProps {
  filtersConfig: FilterConfig[];
  onFilterChange: (filters: Record<string, string>) => void;
  onFilterSubmit: () => void;
}
console.log(open);
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

  const handleSelectChange = (value: string, field: string) => {
    onFilterChange({ [field]: value?.id });
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
          {filter.type === "input" ? (
            <div className="w-full flex flex-col gap-2">
              <Label className="capitalize">{t(filter.label)}</Label>
              <Input
                type="text"
                placeholder={t(filter.placeholder || "")}
                value={filter.value || ""}
                onChange={(e) => handleInputChange(e, filter.label)}
                minLength={1}
              />
            </div>
          ) : filter.type === "select" ? (
            <div className="w-full flex flex-col gap-2">
              <Label className="capitalize">{t(filter.label)}</Label>
              <BasicSelect
                menu={filter.values || []} // Ensure values is an array
                setSelectedValue={(value) =>
                  handleSelectChange(value, filter.label)
                }
                selectedValue={filter.value || ""} // Use filter.value instead of contactList
              />
            </div>
          ) : null}
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
