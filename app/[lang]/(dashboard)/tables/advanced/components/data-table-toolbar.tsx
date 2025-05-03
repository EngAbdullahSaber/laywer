"use client";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";

import { priorities, statuses } from "../data/data";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { getDictionary } from "@/app/dictionaries";
import { translate } from "@/lib/utils";
import { LayoutFilter } from "@/components/common/Filter/LayoutFilter";
import { useTranslate } from "@/config/useTranslation";

interface DataTableToolbarProps {
  table: Table<any>;
  onFilterChange?: any;
  filtersConfig?: any[];
  setSearch?: (data: any) => void;
  setOpen?: any;
  open: any;
  search: string;
  searchPalsceholder: string;
}

export function DataTableToolbar({
  table,
  filtersConfig,
  onFilterChange,
  onFilterSubmit,
  setOpen,
  open,
  search,
  searchPalsceholder,
  setSearch,
}: DataTableToolbarProps) {
  const { t } = useTranslate();
  console.log(open);

  return (
    <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
      {searchPalsceholder ? (
        <Input
          placeholder={t(searchPalsceholder)}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 min-w-[200px] max-w-sm  text-[#fff]"
        />
      ) : (
        <div></div>
      )}
      <DataTableViewOptions table={table} />
      <LayoutFilter
        setOpen={setOpen}
        open={open}
        onFilterChange={onFilterChange}
        filtersConfig={filtersConfig}
        onFilterSubmit={onFilterSubmit}
      />
    </div>
  );
}
