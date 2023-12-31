import {
  BackgroundImage,
  Box,
  Button,
  Card,
  Group,
  NumberInput,
  Radio,
  Stack,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { toPng, toSvg } from "html-to-image";
import { createRef, useEffect, useState } from "react";
import { batchIntoContentAndEmpty, batchLines } from "./helpers";
import FileSaver from "file-saver";
import { IconPhoto, IconPhotoCode, IconX } from "@tabler/icons-react";
import FormattedText from "../../components/FormattedContent";
import VariantSelector from "../../components/VariantSelector";
import AlignmentSelector from "../../components/AlignmentSelector";
import ColorSwatchSelector from "../../components/ColorSwatchSelector";
import ColorInformation from "../../types/ColorInformation";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import Batch from "../../classes/Batch";

function CaptionCreator() {
  const [content, setContent] = useState("");
  const [batches, setBatches] = useState<Batch[]>([]);

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

  const [saveTypeValue, setSaveTypeValue] = useState("single");

  const containerRef = createRef<HTMLDivElement>();
  const textRef = createRef<HTMLDivElement>();

  useEffect(() => {
    const contentSplit = content.split("\n");

    if (containerRef.current !== null && textRef.current !== null) {
      setBatches(
        batchLines(
          contentSplit,
          containerRef.current!,
          textRef.current!,
          lineLimit !== "" ? lineLimit : 1
        )
      );
    } else {
      setBatches([]);
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
    if (saveTypeValue === "single") {
      const node = document.getElementById("output");

      const dataUrl = type === "png" ? await toPng(node!) : await toSvg(node!);
      const fileName = batches
        .map((x) => x._labels.map((y) => y.label))
        .flat(1)
        .join("-");
      FileSaver.saveAs(dataUrl, fileName);
    } else {
      const rebatched = batchIntoContentAndEmpty(batches).filter(
        (x) => x !== undefined
      ) as Batch[][];

      rebatched.forEach(async (batch) => {
        const node = document.getElementById(
          "formatted-" + batch.at(0)!._id.toString()
        );
        const dataUrl =
          type === "png" ? await toPng(node!) : await toSvg(node!);
        const fileName = batch
          .map((x) => x._labels.map((y) => y.label))
          .flat(1)
          .join("-");

        const { _id } = batch.at(0)!;
        FileSaver.saveAs(dataUrl, `${_id}-` + fileName);
      });
    }
  };

  return (
    <Group p="md" align="flex-start" w="100%">
      <Stack sx={{ flexGrow: 1 }} mr="md">
        <Title>Social Media Style Caption Generator</Title>

        <Textarea
          id="content-input"
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

            <Radio.Group
              value={saveTypeValue}
              onChange={setSaveTypeValue}
              size="xs"
            >
              <Stack spacing={2}>
                <Radio value="single" label="Single" />
                <Radio value="multiple" label="Multiple" />
              </Stack>
            </Radio.Group>

            <Button.Group>
              <Button
                variant="default"
                leftIcon={<IconPhoto size="1.25rem" />}
                onClick={() => saveToFile("png")}
                disabled={content.length === 0}
              >
                PNG
              </Button>
              <Button
                variant="default"
                leftIcon={<IconPhotoCode size="1.25rem" />}
                onClick={() => saveToFile("svg")}
                disabled={content.length === 0}
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
                batches={batches}
                alignment={alignmentValue}
                variant={variantValue}
                colorInfo={colorValue}
              />
            </BackgroundImage>
          </Dropzone>
          {customImageFile === null && (
            <Text
              pos="absolute"
              top={4}
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
