import { Box, Card, Group, Stack, Text } from "@mantine/core";
import SVGText from "../services/SVGText";

const TextStyleSelector = function TextStyleSelector() {
  const borderRadius = "0.25rem";
  const padding = "0.25rem";

  return (
    <Card shadow="lg" radius="md" withBorder>
      <Stack spacing="sm">
        <Text weight="bold" align="center" size="lg">
          Style
        </Text>
        <Group>
          <Text
            weight="bold"
            size="1.25rem"
            color="black"
            sx={{
              lineHeight: "1rem",
              padding,
              borderRadius,
              boxShadow: "0px 0px 0px 3px rgba(0, 0, 0)",
            }}
          >
            A
          </Text>

          <Box h="24px" w="22px">
            <SVGText content="A" />
          </Box>

          <Text
            weight="bold"
            size="1.25rem"
            color="white"
            sx={{
              lineHeight: "1rem",
              padding,
              borderRadius,
              boxShadow: "0px 0px 0px 3px rgba(0, 0, 0)",
              backgroundColor: "rgba(0, 0, 0)",
            }}
          >
            A
          </Text>

          <Text
            weight="bold"
            size="1.25rem"
            color="black"
            sx={{
              lineHeight: "1rem",
              padding,
              borderRadius,
              boxShadow: "0px 0px 0px 3px rgba(0, 0, 0, 0.12)",
              backgroundColor: "rgba(0, 0, 0, 0.12)",
            }}
          >
            A
          </Text>
        </Group>
      </Stack>
    </Card>
  );
};

export default TextStyleSelector;
