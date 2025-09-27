"use client";
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTranslate } from "@/config/useTranslation";

interface RadioRightProps {
  text1: string;
  text2: string;
  setValue: any;
  claim_status: string;
}

const RadioRight: React.FC<RadioRightProps> = ({
  text1,
  text2,
  setValue,
  claim_status,
}) => {
  const handleChange = (value: string) => {
    setValue((prevData) => ({
      ...prevData,
      claim_status: value,
    }));
  };
  const { t } = useTranslate();

  return (
    <RadioGroup
      value={claim_status}
      onValueChange={handleChange}
      className="!gap-x-2"
    >
      <div className="flex items-center gap-1">
        <RadioGroupItem value={text1} id={text1} />
        <label htmlFor={text1}>{t(text1)}</label>
      </div>
      <div className="flex items-center gap-1">
        <RadioGroupItem value={text2} id={text2} />
        <label htmlFor={text2}>{t(text2)}</label>
      </div>
    </RadioGroup>
  );
};

export default RadioRight; // Ensure default export
