import {
  BackgroundImage,
  Button,
  Card,
  Divider,
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
import ColorSwatchSelector from "../../components/ColorSwatchSelector";
import ColorInformation from "./types/ColorInformation";
import ImageDropzone from "../../components/ImageDropzone";

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

          <Divider w="100%" my="md" />

          <ImageDropzone
            hasImage={customImageFile !== null}
            setCustomImageFile={setCustomImageFile}
          />
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

        <BackgroundImage
          radius="md"
          src={
            customImageDataUrl !== null && customImageDataUrl.length > 0
              ? customImageDataUrl
              : "https://images.unsplash.com/photo-1693057205719-e439be478b33?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2158&q=80"
          }
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
      </Stack>
    </Group>
  );
}

export default CaptionCreator;
