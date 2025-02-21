import React from "react";
import Select, { MultiValue } from "react-select";

const styles = {
  option: (provided: any, state: any) => ({
    ...provided,
    fontSize: "14px",
  }),
};

interface BasicSelectProps {
  menu: { value: string; label: string }[]; // Array of options
  setSelectedValue: (
    selectedOptions: MultiValue<{ value: string; label: string }>
  ) => void; // Function to update selected options
  selectedValue: MultiValue<{ value: string; label: string }>; // Array of selected options
}

const SelectCase: React.FC<{
  menu: { value: string; label: string }[];
  setSelectedValue: (
    value: MultiValue<{ value: string; label: string }>
  ) => void;
  selectedValue: MultiValue<{ value: string; label: string }>;
  index: number; // Pass index to handle the selection for each case
}> = ({ menu, setSelectedValue, selectedValue, index }) => {
  const handleChange = (
    selectedOptions: MultiValue<{ value: string; label: string }>
  ) => {
    setSelectedValue(selectedOptions);
  };

  return (
    <div>
      <Select
        className="react-select"
        classNamePrefix="select"
        value={selectedValue}
        options={menu}
        onChange={handleChange}
        name="clear"
      />
    </div>
  );
};
export default SelectCase;
