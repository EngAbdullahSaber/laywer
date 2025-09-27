"use client";

import React, { useState, useEffect, useCallback } from "react";
import Select, { SingleValue, MultiValue } from "react-select";

interface InfiniteScrollSelectProps {
  fetchData: (page: number) => Promise<any[]>; // Function to fetch data
  formatOption: (item: any) => { value: any; label: string }; // Function to format options
  placeholder?: string; // Placeholder text
  isClearable?: boolean; // Whether the select is clearable
  selectedValue?: any; // Selected value
  setSelectedValue?: (selectedOption: any) => void; // Function to update selected value
  refreshTrigger?: number; // Trigger to refresh the data
}

const InfiniteScrollSelect: React.FC<InfiniteScrollSelectProps> = ({
  fetchData,
  formatOption,
  placeholder = "Search or Select",
  isClearable = true,
  selectedValue,
  refreshTrigger = 0,
  setSelectedValue,
}) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch data from the API
  const loadData = useCallback(
    async (pageNum: number, reset: boolean = false) => {
      setLoading(true);
      try {
        const newData = await fetchData(pageNum);

        // Check if there's no more data
        if (newData.length === 0) {
          setHasMore(false);
        } else {
          if (reset) {
            // Reset items when doing a new search or refresh
            setItems(newData);
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
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    },
    [fetchData]
  );

  // Load initial data or refresh when refreshTrigger changes
  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    loadData(1, true);
  }, [refreshTrigger, loadData]);

  // Load more data when scrolling
  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadData(nextPage);
    }
  };

  // Handle input change for search
  const handleInputChange = (newValue: string) => {
    setSearchTerm(newValue);
    if (newValue.length > 2) {
      // Reset items and page when searching
      setItems([]);
      setPage(1);
      setHasMore(true);
      loadData(1, true);
    } else if (newValue.length === 0) {
      // Reset when search is cleared
      setItems([]);
      setPage(1);
      setHasMore(true);
      loadData(1, true);
    }
  };

  // Get the selected value by ID
  const getValueById = (id: string, list: any[]) => {
    const selectedItem = list.find((item) => item.value == id);
    return selectedItem || null;
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
        menuShouldScrollIntoView={false}
      />
    </div>
  );
};

export default InfiniteScrollSelect;
