"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Select from "react-select";

interface InfiniteScrollSelectProps {
  fetchData: (page: number, searchTerm: string) => Promise<any[]>; // Updated: now accepts searchTerm
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
  const [searchTerm, setSearchTerm] = useState("");
  
  const lastLoadedSearchTerm = useRef<string | null>(null);
  const loadCount = useRef(0);

  // Filter function to remove items with dashboard_name === "client"
  const filterClientItems = (data: any[]) => {
    return data.filter(item => 
      item.role_with_permission?.dashboard_name !== "client"
    );
  };

  // Fetch data from the API
  const loadData = useCallback(async (pageNum: number, reset: boolean = false, term: string = "") => {
    setLoading(true);
    const currentLoadId = ++loadCount.current;

    try {
      const newData = await fetchData(pageNum, term);
      
      if (currentLoadId !== loadCount.current) return;

      const filteredData = filterClientItems(newData);

      if (filteredData.length === 0 && newData.length === 0) {
        if (reset) setItems([]);
        setHasMore(false);
      } else {
        if (reset) {
          setItems(filteredData);
        } else {
          setItems((prevItems) => {
            const uniqueNewData = filteredData.filter(
              (newItem) => !prevItems.some((prevItem) => prevItem.id === newItem.id)
            );
            return [...prevItems, ...uniqueNewData];
          });
        }
        setHasMore(newData.length >= 10);
      }
      lastLoadedSearchTerm.current = term;
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      if (currentLoadId === loadCount.current) {
        setLoading(false);
      }
    }
  }, [fetchData]);

  // Handle initial load
  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    setSearchTerm("");
    lastLoadedSearchTerm.current = null;
    loadData(1, true, "");
  }, [loadData]);

  // Debounced search effect
  useEffect(() => {
    if (lastLoadedSearchTerm.current === null && searchTerm === "") return;

    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== lastLoadedSearchTerm.current) {
        if (searchTerm.length >= 3 || searchTerm.length === 0) {
          setPage(1);
          setHasMore(true);
          loadData(1, true, searchTerm);
        }
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, loadData]);

  // Load more data when scrolling
  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadData(nextPage, false, searchTerm);
    }
  };

  // Handle input change for search
  const handleInputChange = (newValue: string) => {
    setSearchTerm(newValue);
  };

  // Get the selected value by ID
  const getValueById = (id: string, list: any[]) => {
    if (!id) return null;
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
        filterOption={() => true}
      />
    </div>
  );
};

export default InfiniteScrollSelect;
