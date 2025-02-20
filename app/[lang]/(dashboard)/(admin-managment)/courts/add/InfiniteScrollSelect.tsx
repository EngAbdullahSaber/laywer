"use client";

import React, { useState, useEffect } from "react";
import Select, { SingleValue, MultiValue } from "react-select";

interface InfiniteScrollSelectProps {
  fetchData: (page: number) => Promise<any[]>; // Function to fetch data
  formatOption: (item: any) => { value: any; label: string }; // Function to format options
  placeholder?: string; // Placeholder text
  isClearable?: boolean; // Whether the select is clearable
  selectedValue?: any; // Selected value
  setSelectedValue?: (selectedOption: any) => void; // Function to update selected value
}

const InfiniteScrollSelect: React.FC<InfiniteScrollSelectProps> = ({
  fetchData,
  formatOption,
  placeholder = "Search or Select",
  isClearable = true,
  selectedValue,
  setSelectedValue,
}) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // Fetch data from the API
  const loadData = async (page: number) => {
    setLoading(true);
    try {
      const newData = await fetchData(page);

      // Check if there's no more data
      if (newData.length === 0) {
        setHasMore(false);
      } else {
        // Filter out duplicates before appending new data
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

  // Load initial data
  useEffect(() => {
    loadData(page);
  }, [page]);

  // Load more data when scrolling
  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // Handle input change for search
  const handleInputChange = (newValue: string) => {
    if (newValue.length > 2) {
      // Reset items and page when searching
      setItems([]);
      setPage(1);
      setHasMore(true);
    }
  };

  // Get the selected value by ID
  const getValueById = (id: string, list: any[]) => {
    const selectedItem = list.find((item) => item.value == id);
    return selectedItem || null; // Returns the entire object or null if not found
  };

  // Format options for react-select
  const options = items.map(formatOption);

  return (
    <div>
      <Select
        className="react-select"
        classNamePrefix="select"
        options={options}
        onInputChange={handleInputChange}
        onMenuScrollToBottom={loadMore}
        isLoading={loading}
        isClearable={isClearable}
        value={getValueById(selectedValue, options)}
        onChange={(selectedOption) => setSelectedValue?.(selectedOption)}
        placeholder={placeholder}
      />
    </div>
  );
};

export default InfiniteScrollSelect;
