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
  // Track the selected option object to ensure it's displayed even if not in the current items list
  const [selectedOptionObj, setSelectedOptionObj] = useState<any>(null);
  
  // Use a ref to track the latest search term that was actually loaded
  const lastLoadedSearchTerm = useRef<string | null>(null);
  const loadCount = useRef(0);

  // Fetch data from the API
  const loadData = useCallback(
    async (pageNum: number, reset: boolean = false, term: string = "") => {
      setLoading(true);
      const currentLoadId = ++loadCount.current;
      
      try {
        const newData = await fetchData(pageNum, term);

        // Avoid race conditions: only update if this is still the latest request
        if (currentLoadId !== loadCount.current) return;

        if (newData.length === 0) {
          if (reset) setItems([]);
          setHasMore(false);
        } else {
          if (reset) {
            setItems(newData);
          } else {
            // Filter out duplicates before appending new data
            setItems((prevItems) => {
              const uniqueNewData = newData.filter(
                (newItem) =>
                  !prevItems.some((prevItem) => prevItem.id === newItem.id),
              );
              return [...prevItems, ...uniqueNewData];
            });
          }
          // If we got fewer than 10 items, there's likely no more data (assuming per_page=10)
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
    },
    [fetchData],
  );

  // Handle initial load and refreshTrigger
  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    setSearchTerm("");
    lastLoadedSearchTerm.current = null;
    loadData(1, true, "");
  }, [refreshTrigger, loadData]);

  // Debounced search effect
  useEffect(() => {
    // Don't trigger search on the first render (already handled by refreshTrigger effect)
    if (lastLoadedSearchTerm.current === null && searchTerm === "") return;

    const delayDebounceFn = setTimeout(() => {
      // Only trigger if searchTerm changed and is either empty or >= 3 chars
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

  // Format options for react-select
  const options = items.map(formatOption);

  // Sync selectedOptionObj with selectedValue and current options
  useEffect(() => {
    if (selectedValue) {
      if (!selectedOptionObj || selectedOptionObj.value !== selectedValue) {
        const found = options.find((opt) => opt.value == selectedValue);
        if (found) {
          setSelectedOptionObj(found);
        }
      }
    } else {
      setSelectedOptionObj(null);
    }
  }, [selectedValue, options, selectedOptionObj]);

  // Handle input change for search
  const handleInputChange = (newValue: string, actionMeta: any) => {
    // Only update search term if the user actually typed
    if (actionMeta.action === "input-change") {
      setSearchTerm(newValue);
    } else if (actionMeta.action === "clear") {
      // When clicking the clear (close) icon in the input
      setSearchTerm("");
      setPage(1);
      setHasMore(true);
      loadData(1, true, "");
    }
  };

  const handleChange = (selectedOption: any) => {
    setSelectedOptionObj(selectedOption);
    setSelectedValue?.(selectedOption);
    
    // If clearing the selection, also reset the list to default
    if (!selectedOption) {
      setSearchTerm("");
      setPage(1);
      setHasMore(true);
      loadData(1, true, "");
    }
  };

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
        value={selectedOptionObj}
        onChange={handleChange}
        placeholder={placeholder}
        menuShouldScrollIntoView={false}
        filterOption={() => true} // Disable client-side filtering to let server-side results show
      />
    </div>
  );
};

export default InfiniteScrollSelect;
