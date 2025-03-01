import React from "react";
import Select, { SingleValue } from "react-select";

const styles = {
  option: (provided: any, state: any) => ({
    ...provided,
    fontSize: "14px",
  }),
};

interface BasicSelectProps {
  menu: { value: string; label: string }[];
  selectedValue: { value: string; label: string } | null;
  setSelectedValue: (
    selectedOption: SingleValue<{ value: string; label: string }>
  ) => void;
}

const BasicSelect: React.FC<BasicSelectProps> = ({
  menu,
  selectedValue,
  setSelectedValue,
}) => {
  const handleChange = (
    selectedOption: SingleValue<{ value: string; label: string }>
  ) => {
    setSelectedValue(selectedOption);
  };

  return (
    <Select
      className="react-select"
      classNamePrefix="select"
      styles={styles}
      value={selectedValue}
      options={menu}
      isClearable
      onChange={handleChange}
    />
  );
};

export default BasicSelect;
