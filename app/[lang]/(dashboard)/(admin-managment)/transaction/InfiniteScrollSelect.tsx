"use client";
import React, { useState, useEffect } from "react";
import Select, { SingleValue, createFilter } from "react-select";
import { Input } from "@/components/ui/input";

interface InfiniteScrollSelectProps {
  fetchData: (page: number) => Promise<any[]>;
  formatOption: (item: any) => { value: any; label: string };
  placeholder?: string;
  isClearable?: boolean;
  selectedValue?: string;
  setSelectedValue: (value: string) => void;
  allowFreeText?: boolean;
  className?: string;
}

const InfiniteScrollSelect: React.FC<InfiniteScrollSelectProps> = ({
  fetchData,
  formatOption,
  placeholder = "Search or Select",
  isClearable = true,
  selectedValue,
  setSelectedValue,
  allowFreeText = true,
  className,
}) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const loadData = async (page: number) => {
    setLoading(true);
    try {
      const newData = await fetchData(page);
      if (newData.length === 0) {
        setHasMore(false);
      } else {
        setItems((prevItems) => {
          const uniqueNewData = newData.filter(
            (newItem) =>
              !prevItems.some((prevItem) => prevItem.id === newItem.id)
          );
          return [...prevItems, ...uniqueNewData];
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(page);
  }, [page]);

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    if (allowFreeText) {
      setSelectedValue(newValue);
    }
  };

  const handleChange = (
    selectedOption: SingleValue<{ value: any; label: string }>
  ) => {
    if (selectedOption) {
      setSelectedValue(selectedOption.label);
      setInputValue(selectedOption.label);
    } else {
      setSelectedValue("");
      setInputValue("");
    }
  };

  const handleMenuOpen = () => {
    setMenuIsOpen(true);
    if (inputValue.length > 0) {
      setItems([]);
      setPage(1);
      setHasMore(true);
    }
  };

  const handleMenuClose = () => {
    setMenuIsOpen(false);
    if (allowFreeText && inputValue) {
      setSelectedValue(inputValue);
    }
  };

  const handleBlur = () => {
    if (allowFreeText && inputValue) {
      setSelectedValue(inputValue);
    }
  };

  const options = items.map(formatOption);

  if (
    allowFreeText &&
    inputValue &&
    !options.some((option) => option.label === inputValue)
  ) {
    options.unshift({
      value: inputValue,
      label: inputValue,
    });
  }

  const getDisplayValue = () => {
    if (!selectedValue) return null;
    return (
      options.find((option) => option.label === selectedValue) || {
        value: selectedValue,
        label: selectedValue,
      }
    );
  };

  return (
    <div className={`w-full ${className}`}>
      <Select
        className="react-select-container"
        classNamePrefix="react-select"
        options={options}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onChange={handleChange}
        onMenuScrollToBottom={loadMore}
        isLoading={loading}
        value={getDisplayValue()}
        placeholder={placeholder}
        onMenuOpen={handleMenuOpen}
        onMenuClose={handleMenuClose}
        onBlur={handleBlur}
        filterOption={createFilter({ ignoreAccents: false })}
        menuIsOpen={menuIsOpen}
        components={{
          DropdownIndicator: null,
        }}
        styles={{
          control: (base, state) => ({
            ...base,
            minHeight: "40px",
            backgroundColor: "hsl(var(--background))",
            borderColor: state.isFocused
              ? "hsl(var(--primary))"
              : "hsl(var(--input))",
            boxShadow: state.isFocused
              ? "0 0 0 1px hsl(var(--primary))"
              : "none",
            "&:hover": {
              borderColor: "hsl(var(--primary))",
            },
          }),
          input: (base) => ({
            ...base,
            color: "hsl(var(--foreground)) !important",
          }),
          placeholder: (base) => ({
            ...base,
            color: "hsl(var(--muted-foreground))",
          }),
          singleValue: (base, state) => ({
            ...base,
            color: "hsl(var(--foreground))",
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: "hsl(var(--popover))",
            borderColor: "hsl(var(--border))",
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isSelected
              ? "hsl(var(--primary))"
              : state.isFocused
              ? "hsl(var(--accent))"
              : "transparent",
            color: state.isSelected
              ? "hsl(var(--primary-foreground))"
              : "hsl(var(--foreground))",
            "&:active": {
              backgroundColor: "hsl(var(--primary))",
              color: "hsl(var(--primary-foreground))",
            },
          }),
          clearIndicator: (base) => ({
            ...base,
            color: "hsl(var(--muted-foreground))",
            "&:hover": {
              color: "hsl(var(--foreground))",
            },
          }),
          indicatorSeparator: (base) => ({
            ...base,
            backgroundColor: "hsl(var(--border))",
          }),
        }}
      />
    </div>
  );
};

export default InfiniteScrollSelect;
