import React from "react";
import Select, { StylesConfig } from "react-select";
import { Controller } from "react-hook-form";
import { useTranslate } from "@/config/useTranslation";

// Define the shape of the option items
interface OptionType {
  value: string;
  label: string;
}

// Define the props for the BasicSelect component
interface BasicSelectProps {
  menu: OptionType[];
  control: any;
  name: string;
  errors: any;
}

const styles: StylesConfig<OptionType> = {
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
};

const BasicSelect: React.FC<BasicSelectProps> = ({
  menu,
  control,
  name,
  errors,
}) => {
  const { t, loading, error } = useTranslate();

  return (
    <div>
      <Controller
        name={name}
        control={control}
        rules={{ required: "Role is required" }} // Add validation rule for role
        render={({ field }) => (
          <Select
            {...field}
            className="react-select"
            classNamePrefix="select"
            options={menu}
            isClearable
            styles={styles}
            placeholder={t("select")} // Translate the placeholder
          />
        )}
      />
      {/* {errors[name] && <p className="text-xs text-destructive">{errors[name]?.message}</p>} */}
    </div>
  );
};

export default BasicSelect;
