import { Box, Button, Stack, Text, Textarea, Title } from "@mantine/core";
import { toSvg } from "html-to-image";
import { createRef, useEffect, useState } from "react";
import {
  batchLines,
  isTextShorterThanSurroundingText,
  longestStringInArray,
  getTextDivRadii,
  getTextDivOuterCurves,
} from "./helpers";

function CaptionCreator() {
  const radius = "9px";

  const [content, setContent] = useState("Text\nTesting");
  const [batchedLines, setBatchedLines] = useState<string[][]>([]);

  const containerRef = createRef<HTMLDivElement>();
  const textRef = createRef<HTMLDivElement>();

  useEffect(() => {
    const contentSplit = content.split("\n");

    if (containerRef.current !== null && textRef.current !== null) {
      setBatchedLines(
        batchLines(contentSplit, containerRef.current!, textRef.current!)
      );
    } else {
      setBatchedLines([]);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

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

          toSvg(node!)
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

      <Stack align="center" spacing={0} id="output" p="2rem 30px">
        <Box
          ref={containerRef}
          sx={{
            padding: "1rem 1.1rem 0.75rem 1.1rem",
            position: "absolute",
            textAlign: "center",
            top: "0px",
            visibility: "hidden",
            opacity: "0%",
          }}
        >
          <Text
            className="tiktok-classic-text"
            size="2rem"
            ref={textRef}
            sx={{
              lineHeight: "1.75rem",
            }}
          >
            For Width Measurements
          </Text>
        </Box>

        {batchedLines.map((batch, i) => (
          <Box key={i} sx={{ zIndex: 100 - i }}>
            {batch.map((line, j) => {
              const isShorter = isTextShorterThanSurroundingText(
                longestStringInArray(batchedLines[i]),
                batchedLines[i - 1] && batchedLines[i - 1].length > 0
                  ? longestStringInArray(batchedLines[i - 1])
                  : undefined,
                batchedLines[i + 1] && batchedLines[i + 1].length > 0
                  ? longestStringInArray(batchedLines[i + 1])
                  : undefined
              );

              const outerCurves = getTextDivOuterCurves(
                i === 0,
                i === batchedLines.length - 1,
                j === 0,
                j === batch.length - 1,
                isShorter,
                radius
              );
              const radii = getTextDivRadii(isShorter, radius);

              return (
                <Box
                  key={j}
                  sx={{
                    backgroundColor: line.length > 0 ? "red" : "transparent",
                    padding: "1rem 1.1rem 1rem 1.1rem",
                    position: "relative",
                    marginTop: line.length === 0 ? "8px" : "-0.9rem",
                    borderTopLeftRadius: radii.topLeft,
                    borderTopRightRadius: radii.topRight,
                    borderBottomLeftRadius: radii.bottomLeft,
                    borderBottomRightRadius: radii.bottomRight,
                    width: "100%",
                    textAlign: "center",
                    zIndex: 100 - j,
                  }}
                >
                  {line.length > 0 && outerCurves}
                  <Text
                    className="tiktok-classic-text"
                    size="2rem"
                    sx={{
                      lineHeight: "1.5rem",
                    }}
                  >
                    {line}
                  </Text>
                </Box>
              );
            })}
          </Box>
        ))}
      </Stack>
    </Stack>
  );
}

export default CaptionCreator;
