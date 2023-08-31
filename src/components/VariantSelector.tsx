import { Box, Card, Group, Stack, Sx, Text } from "@mantine/core";
import SVGText from "../services/SVGText";
import React, { SetStateAction } from "react";
import { RadioGroup } from "@headlessui/react";
import { OptionWrapper, getHighlight } from "./CommonSelectorComponents";

type OptionTextProps = {
  sx?: Sx | (Sx | undefined)[] | undefined;
};
const OptionText = function OptionText({ sx }: OptionTextProps) {
  const borderRadius = "0.25rem";
  const padding = "0.25rem";

  return (
    <Text
      weight="bold"
      size="1.25rem"
      sx={{
        position: "relative",
        lineHeight: "1rem",
        padding,
        borderRadius,
        ...sx,
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
                <OptionWrapper>
                  {checked && getHighlight(checkedColor)}
                  <OptionText
                    sx={{
                      boxShadow: `0px 0px 0px 3px ${
                        checked ? checkedColor : "black"
                      }`,
                      color: checked ? checkedColor : "black",
                    }}
                  />
                </OptionWrapper>
              )}
            </RadioGroup.Option>

            <RadioGroup.Option value="outline">
              {({ checked }) => (
                <OptionWrapper>
                  {checked && getHighlight(checkedColor)}
                  <Box h="24px" w="22px" pos="relative">
                    <SVGText
                      content="A"
                      color="white"
                      strokeColor={checked ? checkedColor : "black"}
                    />
                  </Box>
                </OptionWrapper>
              )}
            </RadioGroup.Option>

            <RadioGroup.Option value="opaque-bg">
              {({ checked }) => (
                <OptionWrapper>
                  {checked && getHighlight(checkedColor)}
                  <OptionText
                    sx={{
                      boxShadow: `0px 0px 0px 3px ${
                        checked ? checkedColor : "black"
                      }`,
                      backgroundColor: checked ? checkedColor : "black",
                      color: "white",
                    }}
                  />
                </OptionWrapper>
              )}
            </RadioGroup.Option>

            <RadioGroup.Option value="transparent-bg">
              {({ checked }) => (
                <OptionWrapper>
                  <OptionText
                    sx={{
                      boxShadow: `0px 0px 0px 3px ${
                        checked ? checkedColor : "#000000"
                      }1F`,
                      backgroundColor:
                        (checked ? checkedColor : "#000000") + "1F",
                      color: checked ? checkedColor : "black",
                    }}
                  />
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
