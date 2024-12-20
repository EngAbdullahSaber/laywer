import React from "react";
import Select, { StylesConfig } from "react-select";

// Define the shape of the option items
interface OptionType {
  value: string;
  label: string;
}

// Define the props for the BasicSelect component
interface BasicSelectProps {
  menu: OptionType[];
}

const styles: StylesConfig<OptionType> = {
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
};

const BasicSelect: React.FC<BasicSelectProps> = ({ menu }) => {
  return (
    <div>
      <Select
        className="react-select"
        classNamePrefix="select"
        defaultValue={menu.length > 0 ? menu[0] : null} // Ensure defaultValue is safe
        styles={styles}
        name="clear"
        options={menu}
        isClearable
      />
    </div>
  );
};

export default BasicSelect;
