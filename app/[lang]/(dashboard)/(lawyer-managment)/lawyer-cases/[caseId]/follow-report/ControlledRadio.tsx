"use client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
const ControlledRadio = ({ setSelected, selected, text1, text2 }) => {
  const handleSelect = (value) => {
    setSelected(value);
  };
  return (
    <>
      <RadioGroup defaultValue={selected} onValueChange={handleSelect}>
        <RadioGroupItem value={text1} id={text1} className="dark:text-white">
          {text1}{" "}
        </RadioGroupItem>
        <RadioGroupItem value={text2} id={text2} className="dark:text-white">
          {text2}{" "}
        </RadioGroupItem>
      </RadioGroup>
    </>
  );
};
export default ControlledRadio;
