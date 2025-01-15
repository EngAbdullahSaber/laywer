import React, { useState } from "react";
import Select, { SingleValue, MultiValue } from "react-select";

const styles = {
  option: (provided: any, state: any) => ({
    ...provided,
    fontSize: "14px",
  }),
};
interface BasicSelectProps {
  menu: any[]; // Array of options passed to the select
  setSelectedValue: (selectedOption: any) => void; // Function to update selected options
  selectedValue: MultiValue<any>; // Array of selected options
}
const BasicSelect: React.FC<BasicSelectProps> = ({
  menu,
  setSelectedValue,
  selectedValue,
}) => {
  return (
    <div>
      <Select
        className="react-select"
        classNamePrefix="select"
        styles={styles}
        name="clear"
        options={menu}
        isClearable
      />
    </div>
  );
};

export default BasicSelect;
