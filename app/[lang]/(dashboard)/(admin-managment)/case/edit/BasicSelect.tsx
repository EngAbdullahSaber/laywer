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
}
const SelectCase: React.FC<BasicSelectProps> = ({ menu }) => {
  // State to store the selected value

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

export default SelectCase;
