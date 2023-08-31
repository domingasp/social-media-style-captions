import { RadioGroup } from "@headlessui/react";
import { Box, Card, Group, Stack, Text, ThemeIcon } from "@mantine/core";
import {
  IconAlignCenter,
  IconAlignLeft,
  IconAlignRight,
} from "@tabler/icons-react";
import { SetStateAction } from "react";
import { OptionWrapper } from "./CommonSelectorComponents";

type AlignmentSelectorOptionProps = {
  value: string;
  icon: JSX.Element;
};
const AlignmentSelectorOption = function AlignmentSelectorOption({
  value,
  icon,
}: AlignmentSelectorOptionProps) {
  const fontSize = "1.25rem";

  return (
    <RadioGroup.Option value={value}>
      {({ checked }) => (
        <OptionWrapper>
          <Box sx={{ lineHeight: "1rem" }}>
            <ThemeIcon
              color={checked ? "blue" : "black"}
              variant={checked ? "light" : "default"}
              size={fontSize}
              sx={{ border: 0 }}
            >
              {icon}
            </ThemeIcon>
          </Box>
        </OptionWrapper>
      )}
    </RadioGroup.Option>
  );
};

type AlignmentSelectorProps = {
  value: string;
  setValue: React.Dispatch<SetStateAction<string>>;
};
const AlignmentSelector = function AlignmentSelector({
  value,
  setValue,
}: AlignmentSelectorProps) {
  return (
    <Card shadow="lg" radius="md" withBorder>
      <Stack spacing="sm">
        <RadioGroup value={value} onChange={setValue}>
          <RadioGroup.Label>
            <Text align="center" weight="bold">
              Alignment
            </Text>
          </RadioGroup.Label>

          <Group mt="xs">
            <AlignmentSelectorOption value="left" icon={<IconAlignLeft />} />
            <AlignmentSelectorOption
              value="center"
              icon={<IconAlignCenter />}
            />
            <AlignmentSelectorOption value="right" icon={<IconAlignRight />} />
          </Group>
        </RadioGroup>
      </Stack>
    </Card>
  );
};

export default AlignmentSelector;
