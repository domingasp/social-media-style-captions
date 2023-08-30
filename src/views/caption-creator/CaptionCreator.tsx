import { Box, Button, Stack, Text, Textarea, Title } from "@mantine/core";
import { toSvg } from "html-to-image";
import { createRef, useEffect, useState } from "react";
import { isShorter, getFullOuterRadius, batchLines } from "./helpers";

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

      <Stack align="center" spacing={0} id="output" p="10px 30px">
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

        {batchedLines.map((batch, i) => {
          const isOnlyBatch = batchedLines.length === 1;
          const isFirstBatch = i === 0;
          const isLastBatch = i === batchedLines.length - 1;
          return (
            <Box key={i} sx={{ zIndex: 100 - i }}>
              {batch.map((line, j) => {
                const isOnly = batch.length === 1;
                const isFirst = j === 0;
                const isLast = j === batch.length - 1;

                let topLeftRadius,
                  topRightRadius,
                  bottomLeftRadius,
                  bottomRightRadius;
                topLeftRadius =
                  topRightRadius =
                  bottomLeftRadius =
                  bottomRightRadius =
                    "0px";

                let outerCurves = <></>;

                let shorterThanAbove = false; // isShorter(line, batchedLines[i - 1].at(-1)!)
                let shorterThanBelow = false; // isShorter(line, batchedLines[i + 1][0])
                const longestLineInBatch = batchedLines[i].reduce((a, b) =>
                  a.length > b.length ? a : b
                );
                if (!isOnlyBatch) {
                  if (isFirstBatch || !isLastBatch) {
                    shorterThanBelow = isShorter(
                      longestLineInBatch,
                      batchedLines[i + 1][0]
                    );
                  }
                  if (isLastBatch || !isFirstBatch) {
                    shorterThanAbove = isShorter(
                      longestLineInBatch,
                      batchedLines[i - 1].at(-1)!
                    );
                  }
                }

                // Radius and Curves
                if (isOnlyBatch) {
                  if (isFirst) topLeftRadius = topRightRadius = radius;
                  if (isLast) bottomLeftRadius = bottomRightRadius = radius;
                } else if (isFirstBatch) {
                  if (isFirst) {
                    topLeftRadius = topRightRadius = radius;
                  }
                  if (isLast && shorterThanBelow) {
                    bottomLeftRadius = bottomRightRadius = radius;
                    outerCurves = getFullOuterRadius("bottom", radius);
                  }
                } else if (isLastBatch) {
                  if (isLast) {
                    bottomLeftRadius = bottomRightRadius = radius;
                  }
                  if (isFirst) {
                    if (shorterThanAbove) {
                      outerCurves = getFullOuterRadius("top", radius);
                    } else {
                      topLeftRadius = topRightRadius = radius;
                    }
                  }
                } else {
                  if (isOnly) {
                    if (!shorterThanAbove && !shorterThanBelow) {
                      topLeftRadius =
                        topRightRadius =
                        bottomLeftRadius =
                        bottomRightRadius =
                          radius;
                    } else if (shorterThanAbove && !shorterThanBelow) {
                      bottomLeftRadius = bottomRightRadius = radius;
                      outerCurves = getFullOuterRadius("top", radius);
                    } else if (!shorterThanAbove && shorterThanBelow) {
                      topLeftRadius = topRightRadius = radius;
                      outerCurves = getFullOuterRadius("bottom", radius);
                    } else if (shorterThanAbove && shorterThanBelow) {
                      outerCurves = getFullOuterRadius("full", radius);
                    }
                  } else if (isFirst) {
                    if (shorterThanAbove) {
                      outerCurves = getFullOuterRadius("top", radius);
                    } else {
                      topLeftRadius = topRightRadius = radius;
                    }
                  } else if (isLast) {
                    if (shorterThanBelow) {
                      outerCurves = getFullOuterRadius("bottom", radius);
                    } else {
                      bottomLeftRadius = bottomRightRadius = radius;
                    }
                  }
                }

                return (
                  <Box
                    key={j}
                    sx={{
                      backgroundColor: line.length > 0 ? "red" : "transparent",
                      padding: "1rem 1.1rem 1rem 1.1rem",
                      position: "relative",
                      marginTop: line.length === 0 ? "8px" : "-0.9rem",
                      borderTopLeftRadius: topLeftRadius,
                      borderTopRightRadius: topRightRadius,
                      borderBottomLeftRadius: bottomLeftRadius,
                      borderBottomRightRadius: bottomRightRadius,
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
          );
        })}
      </Stack>
    </Stack>
  );
}

export default CaptionCreator;
