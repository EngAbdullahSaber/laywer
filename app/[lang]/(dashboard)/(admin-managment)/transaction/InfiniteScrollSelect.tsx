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
}

const InfiniteScrollSelect: React.FC<InfiniteScrollSelectProps> = ({
  fetchData,
  formatOption,
  placeholder = "Search or Select",
  isClearable = true,
  selectedValue,
  setSelectedValue,
  allowFreeText = true,
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
    // If allowFreeText, update the selected value as user types
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
    // If allowFreeText and input has value, ensure it's set as the selected value
    if (allowFreeText && inputValue) {
      setSelectedValue(inputValue);
    }
  };

  const handleBlur = () => {
    // On blur, ensure the current input value is set as the selected value
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
    <div className="w-full">
      <Select
        className="react-select-container"
        classNamePrefix="react-select"
        options={options}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onChange={handleChange}
        onMenuScrollToBottom={loadMore}
        isLoading={loading}
        isClearable={isClearable}
        value={getDisplayValue()}
        placeholder={placeholder}
        onMenuOpen={handleMenuOpen}
        onMenuClose={handleMenuClose}
        onBlur={handleBlur} // Added blur handler
        filterOption={createFilter({ ignoreAccents: false })}
        menuIsOpen={menuIsOpen}
        components={{
          DropdownIndicator: null,
        }}
        styles={{
          control: (base) => ({
            ...base,
            minHeight: "40px",
            borderColor: "#e2e8f0",
            "&:hover": {
              borderColor: "#cbd5e0",
            },
          }),
          input: (base) => ({
            ...base,
            color: "#000",
          }),
        }}
      />
    </div>
  );
};

export default InfiniteScrollSelect;
