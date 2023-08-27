import { Box, Button, Stack, Text, Textarea, Title } from "@mantine/core";
import { toPng } from "html-to-image";
import { useEffect, useState } from "react";

function CaptionCreator() {
  const [content, setContent] = useState("Text\nTesting");
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    setLines(content.split("\n"));
  }, [content]);

  const getTextWidth = function getTextWidth(text: string) {
    const canvas: HTMLCanvasElement = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const metrics = context!.measureText(text);
    return metrics.width;
  };

  const getBorderRadius = function getBorderRadius(
    line: string,
    lineToCompare: string | undefined,
    radius: string
  ) {
    if (!lineToCompare || getTextWidth(line) > getTextWidth(lineToCompare)) {
      return radius;
    }
    return "unset";
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

      <Text size="lg" weight="bold">
        Result:
      </Text>

      <Button
        onClick={() => {
          var node = document.getElementById("output");

          toPng(node!)
            .then(function (dataUrl) {
              var img = new Image();
              img.src = dataUrl;
              document.body.appendChild(img);
            })
            .catch(function (error) {
              console.error("oops, something went wrong!", error);
            });
        }}
      >
        lol
      </Button>

      <Stack align="center" spacing={0} id="output">
        {lines.map((line, i) => (
          <Box
            key={i}
            sx={{
              borderRadius: "4px",
              borderBottomLeftRadius: getBorderRadius(
                line,
                lines[i + 1],
                "4px"
              ),
              borderBottomRightRadius: getBorderRadius(
                line,
                lines[i + 1],
                "4px"
              ),
              borderTopLeftRadius: getBorderRadius(line, lines[i - 1], "4px"),
              borderTopRightRadius: getBorderRadius(line, lines[i - 1], "4px"),
              backgroundColor: "red",
              padding: "10px",
            }}
          >
            <Text>{line}</Text>
          </Box>
        ))}
      </Stack>
    </Stack>
  );
}

export default CaptionCreator;
