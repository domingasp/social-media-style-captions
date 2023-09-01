import { ColorSwatch, Group } from "@mantine/core";
import ColorInformation from "../views/caption-creator/types/ColorInformation";
import { IconCheck } from "@tabler/icons-react";
import { RadioGroup } from "@headlessui/react";

type ColorSwatchSelectorProps = {
  value: ColorInformation;
  setValue: React.Dispatch<React.SetStateAction<ColorInformation>>;
};
const ColorSwatchSelector = function ColorSwatchSelector({
  value,
  setValue,
}: ColorSwatchSelectorProps) {
  const colorOptions: ColorInformation[] = [
    { color: "#FFFFFF", outlineColor: "#000000" },
    { color: "#000000", outlineColor: "#FFFFFF" },
    { color: "#EA4040", outlineColor: "#FFFFFF" },
    { color: "#FF933D", outlineColor: "#42190B" },
    { color: "#F2CD46", outlineColor: "#000000" },
    { color: "#78C25E", outlineColor: "#FFFFFF" },
    { color: "#78C8A6", outlineColor: "#FFFFFF" },
    { color: "#3598FA", outlineColor: "#FFFFFF" },
    { color: "#2443B3", outlineColor: "#ECCD5F" },
    { color: "#5656D5", outlineColor: "#FFFFFF" },
    { color: "#F8D7E9", outlineColor: "#C46D93" },
    { color: "#A4895B", outlineColor: "#FFFFFF" },
    { color: "#32523C", outlineColor: "#FFFFFF" },
    { color: "#2F698D", outlineColor: "#FFFFFF" },
    { color: "#92979E", outlineColor: "#FFFFFF" },
    { color: "#333333", outlineColor: "#FFFFFF" },
  ];

  const compareColors = function compareColors(
    a: ColorInformation,
    b: ColorInformation
  ) {
    return a.color === b.color;
  };

  return (
    <RadioGroup value={value} by={compareColors} onChange={setValue}>
      <Group>
        {colorOptions.map((x, i) => (
          <RadioGroup.Option key={i} value={x}>
            {({ checked }) => (
              <ColorSwatch
                size={checked ? "2rem" : "1.5rem"}
                color={x.color}
                sx={{
                  color: x.color !== "#FFFFFF" ? "#fff" : "#000",
                  boxShadow: checked
                    ? "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px"
                    : "",
                  ".mantine-ColorSwatch-children": { top: 1, right: 1 },
                }}
              >
                {checked && <IconCheck stroke={4} />}
              </ColorSwatch>
            )}
          </RadioGroup.Option>
        ))}
      </Group>
    </RadioGroup>
  );
};

export default ColorSwatchSelector;
