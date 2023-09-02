import {
  BackgroundImage,
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
import { IconPhoto, IconPhotoCode, IconX } from "@tabler/icons-react";
import FormattedText from "../../components/FormattedContent";
import VariantSelector from "../../components/VariantSelector";
import AlignmentSelector from "../../components/AlignmentSelector";
import { LabelWidth } from "./types/LabelWidth";
import ColorSwatchSelector from "../../components/ColorSwatchSelector";
import ColorInformation from "./types/ColorInformation";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";

function CaptionCreator() {
  const [content, setContent] = useState("Text\nTesting");
  const [batchedLines, setBatchedLines] = useState<LabelWidth[][]>([]);

  const [customImageFile, setCustomImageFile] = useState<File | null>(null);
  const [customImageDataUrl, setCustomImageDataUrl] = useState<string | null>(
    ""
  );

  const [lineLimit, setLineLimit] = useState<number | "">(25);
  const [variantValue, setVariantValue] = useState("opaque-bg");
  const [alignmentValue, setAlignmentValue] = useState("center");
  const [colorValue, setColorValue] = useState<ColorInformation>({
    color: "#FFFFFF",
    outlineColor: "#000000",
  });

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

  useEffect(() => {
    const fileReader = new FileReader();

    fileReader.addEventListener("load", () => {
      setCustomImageDataUrl(fileReader.result as string | null);
    });

    if (customImageFile !== null) {
      fileReader.readAsDataURL(customImageFile);
    } else {
      setCustomImageDataUrl(null);
    }
  }, [customImageFile]);

  const saveToFile = async function saveToFile(type: "png" | "svg") {
    const node = document.getElementById("output");

    const dataUrl = type === "png" ? await toPng(node!) : await toSvg(node!);
    FileSaver.saveAs(
      dataUrl,
      batchedLines
        .flat(1)
        .map((x) => x.label)
        .join("-")
    );
  };

  return (
    <Group p="md" align="flex-start" w="100%">
      <Stack sx={{ flexGrow: 1 }} mr="md">
        <Title>TikTok Style Text Generator</Title>

        <Textarea
          label="Your Content"
          miw={500}
          autosize
          value={content}
          onChange={(event) => setContent(event.currentTarget.value)}
        />

        <Stack align="center">
          <Group position="center">
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

          <ColorSwatchSelector value={colorValue} setValue={setColorValue} />
        </Stack>
      </Stack>

      <Stack align="flex-start" miw="50%" sx={{ flexGrow: 1 }}>
        <Group w="100%" position="apart">
          <Group>
            <Text size="lg" weight="bold">
              Result
            </Text>
            <Text size="xs" color="grey">
              Background image for preview only
            </Text>
          </Group>

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

        <Box w="100%" pos="relative">
          <Dropzone
            onDrop={(files) => {
              if (files.length > 0) {
                setCustomImageFile(files[0]);
              }
            }}
            accept={IMAGE_MIME_TYPE}
            maxSize={3 * 1024 ** 2}
            w="100%"
            padding={0}
            radius="md"
            bg={colorValue.color === "#FFFFFF" ? "#DEE2E6" : "transparent"}
            sx={{
              borderColor: customImageDataUrl !== null ? "transparent" : "",
            }}
          >
            <BackgroundImage
              radius="md"
              src={customImageDataUrl !== null ? customImageDataUrl : ""}
              sx={{ textAlign: "center", overflow: "hidden" }}
            >
              <FormattedText
                containerRef={containerRef}
                textRef={textRef}
                batchedLines={batchedLines}
                alignment={alignmentValue}
                variant={variantValue}
                colorInfo={colorValue}
              />
            </BackgroundImage>
          </Dropzone>
          {customImageFile === null && (
            <Text
              pos="absolute"
              top={2}
              left={12}
              size="xs"
              color="grey"
              sx={{ pointerEvents: "none" }}
            >
              Drag image here or click for file picker
            </Text>
          )}

          {customImageFile !== null && (
            <Button
              onClick={() => setCustomImageFile(null)}
              size="xs"
              variant="white"
              color="red"
              leftIcon={<IconX />}
              pos="absolute"
              bottom={3}
              right={6}
            >
              Clear Image
            </Button>
          )}
        </Box>
      </Stack>
    </Group>
  );
}

export default CaptionCreator;
