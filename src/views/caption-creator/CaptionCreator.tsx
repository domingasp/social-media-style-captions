import {
  Box,
  Button,
  Card,
  Group,
  NumberInput,
  Stack,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { toPng, toSvg } from "html-to-image";
import { createRef, useEffect, useState } from "react";
import { batchLines } from "./helpers";
import FileSaver from "file-saver";
import { IconPhoto, IconPhotoCode } from "@tabler/icons-react";
import FormattedText from "../../components/FormattedContent";
import VariantSelector from "../../components/VariantSelector";
import AlignmentSelector from "../../components/AlignmentSelector";
import { LabelWidth } from "./types/LabelWidth";

function CaptionCreator() {
  const [content, setContent] = useState("Text\nTesting");
  const [batchedLines, setBatchedLines] = useState<LabelWidth[][]>([]);

  const [lineLimit, setLineLimit] = useState<number | "">(20);
  const [variantValue, setVariantValue] = useState("opaque-bg");
  const [alignmentValue, setAlignmentValue] = useState("center");

  const containerRef = createRef<HTMLDivElement>();
  const textRef = createRef<HTMLDivElement>();

  useEffect(() => {
    const contentSplit = content.split("\n");

    if (containerRef.current !== null && textRef.current !== null) {
      setBatchedLines(
        batchLines(
          contentSplit,
          containerRef.current!,
          textRef.current!,
          lineLimit !== "" ? lineLimit : 1
        )
      );
    } else {
      setBatchedLines([]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, lineLimit]);

  const saveToFile = async function saveToFile(type: "png" | "svg") {
    const node = document.getElementById("output");

    const dataUrl = type === "png" ? await toPng(node!) : await toSvg(node!);
    FileSaver.saveAs(dataUrl, batchedLines.flat(1).join("-"));
  };

  return (
    <Stack p="md" align="center">
      <Title>TikTok Style Text Generator</Title>

      <Textarea
        label="Your Content"
        miw={500}
        autosize
        value={content}
        onChange={(event) => setContent(event.currentTarget.value)}
      />

      <Group w="100%" position="apart">
        <Text size="lg" weight="bold">
          Result
        </Text>

        <Group>
          <Text>Save:</Text>
          <Button.Group>
            <Button
              variant="default"
              leftIcon={<IconPhoto size="1.25rem" />}
              onClick={() => saveToFile("png")}
            >
              PNG
            </Button>
            <Button
              variant="default"
              leftIcon={<IconPhotoCode size="1.25rem" />}
              onClick={() => saveToFile("svg")}
            >
              SVG
            </Button>
          </Button.Group>
        </Group>
      </Group>

      <Group>
        <Card mah="92px" shadow="md" radius="md" withBorder maw="175px">
          <NumberInput
            value={lineLimit}
            onChange={setLineLimit}
            label="Line Char Limit"
            styles={{
              label: {
                fontSize: "1rem",
                fontWeight: "bold",
                display: "block",
                textAlign: "center",
              },
            }}
            size="sm"
            min={1}
            max={50}
          />
        </Card>

        <AlignmentSelector
          value={alignmentValue}
          setValue={setAlignmentValue}
        />

        <VariantSelector value={variantValue} setValue={setVariantValue} />
      </Group>

      <Box bg="gray" w="100%" sx={{ overflow: "hidden" }}>
        <FormattedText
          containerRef={containerRef}
          textRef={textRef}
          batchedLines={batchedLines}
          alignment={alignmentValue}
          variant={variantValue}
        />
      </Box>
    </Stack>
  );
}

export default CaptionCreator;
