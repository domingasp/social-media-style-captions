import { Card, Group, Stack, Text } from "@mantine/core";
import SVGText from "../services/SVGText";
import React, { SetStateAction } from "react";
import { RadioGroup } from "@headlessui/react";
import { OptionWrapper, getHighlight } from "./CommonSelectorComponents";

const OptionText = function OptionText() {
  return (
    <Text
      weight="bold"
      size="1.2rem"
      align="center"
      sx={{
        position: "absolute",
        width: "100%",
        height: "100%",
        top: 2,
        left: 0.25,
        lineHeight: "1rem",
      }}
    >
      A
    </Text>
  );
};

type VariantSelectorProps = {
  value: string;
  setValue: React.Dispatch<SetStateAction<string>>;
};
const VariantSelector = function VariantSelector({
  value,
  setValue,
}: VariantSelectorProps) {
  const checkedColor = "#228BE6";

  return (
    <Card shadow="lg" radius="md" withBorder>
      <Stack spacing="sm">
        <RadioGroup value={value} onChange={setValue}>
          <RadioGroup.Label>
            <Text align="center" weight="bold">
              Variant
            </Text>
          </RadioGroup.Label>

          <Group mt="xs">
            <RadioGroup.Option value="plain">
              {({ checked }) => (
                <OptionWrapper
                  sx={{
                    boxShadow: `0px 0px 0px 3px ${
                      checked ? checkedColor : "black"
                    }`,
                    color: checked ? checkedColor : "black",
                  }}
                >
                  {checked && getHighlight(checkedColor)}
                  <OptionText />
                </OptionWrapper>
              )}
            </RadioGroup.Option>

            <RadioGroup.Option value="outline">
              {({ checked }) => (
                <OptionWrapper>
                  {checked && getHighlight(checkedColor)}
                  <SVGText
                    content="A"
                    color="white"
                    strokeColor={checked ? checkedColor : "black"}
                    svgParentStyle={{
                      position: "absolute",
                      top: 1,
                      left: 0.25,
                    }}
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                    }}
                  />
                </OptionWrapper>
              )}
            </RadioGroup.Option>

            <RadioGroup.Option value="opaque-bg">
              {({ checked }) => (
                <OptionWrapper
                  sx={{
                    boxShadow: `0px 0px 0px 3px ${
                      checked ? checkedColor : "black"
                    }`,
                    backgroundColor: checked ? checkedColor : "black",
                    color: "white",
                  }}
                >
                  {checked && getHighlight(checkedColor)}
                  <OptionText />
                </OptionWrapper>
              )}
            </RadioGroup.Option>

            <RadioGroup.Option value="transparent-bg">
              {({ checked }) => (
                <OptionWrapper
                  sx={{
                    boxShadow: `0px 0px 0px 3px ${
                      checked ? checkedColor : "#000000"
                    }1F`,
                    backgroundColor:
                      (checked ? checkedColor : "#000000") + "1F",
                    color: checked ? checkedColor : "black",
                  }}
                >
                  <OptionText />
                </OptionWrapper>
              )}
            </RadioGroup.Option>
          </Group>
        </RadioGroup>
      </Stack>
    </Card>
  );
};

export default VariantSelector;
