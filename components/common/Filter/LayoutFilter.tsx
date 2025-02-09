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
import { Icon } from "@iconify/react";
import { FilterIcon } from "lucide-react";
import { useTranslate } from "@/config/useTranslation";
import { Filter } from "./Filter";
import { useParams } from "next/navigation";

interface FilterProps {
  onFilterChange: any;
  filtersConfig: any;
  onFilterSubmit: any;
}

export function LayoutFilter({
  onFilterChange,
  onFilterSubmit,
  filtersConfig,
}: FilterProps) {
  const { t } = useTranslate();
  const { lang } = useParams();

  // Conditional rendering logic is handled properly
  return filtersConfig.length > 0 ? (
    <Sheet>
      <SheetTrigger>
        <Button variant="outline" size="sm" className="ltr:ml-2 rtl:mr-2 h-8">
          <FilterIcon className="ltr:mr-2 rtl:ml-2 h-4 w-4" /> {t("Filters")}
        </Button>
      </SheetTrigger>

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
          <Filter
            filtersConfig={filtersConfig}
            onFilterChange={onFilterChange}
            onFilterSubmit={onFilterSubmit}
          />
        </div>
        <SheetFooter>
          <SheetClose asChild>footer content</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ) : null; // If no filters, render nothing (null)
}
