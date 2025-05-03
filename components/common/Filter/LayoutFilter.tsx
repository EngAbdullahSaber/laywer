"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FilterIcon } from "lucide-react";
import BasicSelect from "@/components/common/Select/BasicSelect";

import { useTranslate } from "@/config/useTranslation";
import { useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
interface FilterProps {
  onFilterChange: any;
  filtersConfig: any;
  onFilterSubmit: any;
  setOpen: any;
  open: any;
}

export function LayoutFilter({
  onFilterChange,
  onFilterSubmit,
  setOpen,
  open,
  filtersConfig,
}: FilterProps) {
  const { t } = useTranslate();
  const { lang } = useParams();
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
    setOpen(!open);
  };
  // Conditional rendering logic is handled properly
  console.log(open);
  return filtersConfig.length > 0 ? (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(!open)}
        size="sm"
        className="ltr:ml-2 rtl:mr-2 h-8  dark:border-[#dfc77d] dark:text-[#dfc77d] dark:hover:bg-[#dfc77d] dark:hover:text-[#000]"
      >
        <FilterIcon className="ltr:mr-2 rtl:ml-2 h-4 w-4" /> {t("Filters")}
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          className="max-w-lg p-5 overflow-y-scroll"
          side={lang === "ar" ? "left" : "right"}
          dir={lang === "ar" ? "rtl" : "ltr"}
        >
          <SheetHeader className="py-3 pl-3.5">
            <SheetTitle>{t("Filter")}</SheetTitle>
          </SheetHeader>
          <hr />
          <div className="flex flex-col gap-4">
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
                <Button
                  type="button"
                  className="w-full"
                  onClick={onFilterSubmit}
                >
                  {t("submit")}
                </Button>
              </div>
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>footer content</SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  ) : null; // If no filters, render nothing (null)
}
