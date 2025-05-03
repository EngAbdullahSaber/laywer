"use client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
const ControlledRadio = ({
  setSelected,
  selected,
  text1,
  text2,
}: {
  setSelected: any;
  selected: any;
  text1: string;
  text2: string;
}) => {
  const handleSelect = (value: any) => {
    setSelected(value);
  };
  return (
    <>
      <RadioGroup
        defaultValue={selected}
        onValueChange={handleSelect}
        className="dark:text-white"
      >
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
