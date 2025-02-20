import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTranslate } from "@/config/useTranslation";

interface RadioRightProps {
  text1: string;
  text2: string;
  keyData?: (value: string) => void; // Ensuring keyData is a function
}

export const Radio: React.FC<RadioRightProps> = ({ text1, text2, keyData }) => {
  const { t } = useTranslate();

  // Ensure that keyData is a function and call it on value change
  return (
    <>
      <RadioGroup
        onValueChange={(value) => keyData && keyData(value)} // Correctly call keyData function
        className="!gap-[10px] max-md:grid max-md:grid-cols-2"
      >
        <div className="items-center gap-1 cursor-pointer grid grid-cols-[25px,1fr]">
          <RadioGroupItem value={text1} id={text1}></RadioGroupItem>
          <Label className="capitalize-first cursor-pointer" htmlFor={text1}>
            {t(text1)}
          </Label>
        </div>

        <div className="items-center gap-1 cursor-pointer grid grid-cols-[25px,1fr]">
          <RadioGroupItem value={text2} id={text2}></RadioGroupItem>
          <Label className="capitalize-first cursor-pointer" htmlFor={text2}>
            {t(text2)}
          </Label>
        </div>
      </RadioGroup>
    </>
  );
};
