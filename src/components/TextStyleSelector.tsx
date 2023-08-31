import { Box, Card, Group, Stack, Sx, Text } from "@mantine/core";
import SVGText from "../services/SVGText";
import React, { FC, SetStateAction } from "react";
import { RadioGroup } from "@headlessui/react";

type OptionWrapperProps = { children: React.ReactNode };
const OptionWrapper = function OptionWrapper({ children }: OptionWrapperProps) {
  return <Box sx={{ position: "relative", cursor: "pointer" }}>{children}</Box>;
};

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

type TextStyleSelectorProps = {
  value: string;
  setValue: React.Dispatch<SetStateAction<string>>;
};
const TextStyleSelector = function TextStyleSelector({
  value,
  setValue,
}: TextStyleSelectorProps) {
  const checkedColor = "#228BE6";

  const getHighlight = function getHighlight() {
    return (
      <Box
        sx={{
          content: '""',
          position: "absolute",
          backgroundColor: checkedColor,
          opacity: "10%",
          width: "24px",
          height: "24px",
          top: 0,
          left: -1,
          borderRadius: 4,
        }}
      />
    );
  };

  return (
    <Card shadow="lg" radius="md" withBorder>
      <Stack spacing="sm">
        <RadioGroup value={value} onChange={setValue}>
          <RadioGroup.Label>
            <Text align="center" weight="bold">
              Style
            </Text>
          </RadioGroup.Label>

          <Group mt="xs">
            <RadioGroup.Option value="plain">
              {({ checked }) => (
                <OptionWrapper>
                  {checked && getHighlight()}
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
                  {checked && getHighlight()}
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
                  {checked && getHighlight()}
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

export default TextStyleSelector;
