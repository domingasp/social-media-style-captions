import { Box, Button, Stack, Text, Textarea, Title } from "@mantine/core";
import { toSvg } from "html-to-image";
import { useEffect, useState } from "react";

const getTextWidth = function getTextWidth(text: string) {
  const canvas: HTMLCanvasElement = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context!.font = "600 Nunito Sans sans-serif";
  const metrics = context!.measureText(text);
  return metrics.width;
};

const isSimilarLength = function isSimilarLength(
  text: string,
  nextText: string
) {
  return Math.abs(getTextWidth(text) - getTextWidth(nextText)) < 7.5;
};

const isShorter = function isShorter(text: string, textToCompare: string) {
  return getTextWidth(text) < getTextWidth(textToCompare);
};

function CaptionCreator() {
  const radius = "9px";

  const [content, setContent] = useState("Text\nTesting");
  const [batchedLines, setBatchedLines] = useState<string[][]>([]);

  useEffect(() => {
    const contentSplit = content.split("\n");

    const batched: string[][] = [[contentSplit[0]]];
    let batch = 0;
    for (let i = 0; i < contentSplit.length - 1; i += 1) {
      const next = contentSplit[i + 1];

      if (batched[batch].some((x) => !isSimilarLength(next, x))) {
        batch += 1;
        if (batched.length === batch) batched.push([]);
      }

      batched[batch].push(next);
    }

    setBatchedLines(batched);
  }, [content]);

  const getOuterRadius = function getOuterRadius(
    radiusPos: string = "full-left",
    position: "left" | "right" = "left"
  ) {
    let topLeft, topRight, bottomLeft, bottomRight;
    topLeft = topRight = bottomLeft = bottomRight = "0px";

    let clipPath = "polygon(50% 0%, 101% 0%, 101% 100%, 50% 100%)";

    if (radiusPos === "full-left") {
      topLeft = bottomLeft = radius;
      clipPath = "polygon(-1% 0%, 50% 0%, 50% 100%, -1% 100%)";
    }
    if (radiusPos === "full-right") {
      topRight = bottomRight = radius;
      clipPath = "polygon(50% 0%, 101% 0%, 101% 100%, 50% 100%)";
    }
    if (radiusPos === "top-left") {
      topLeft = radius;
      clipPath = "polygon(-1% 0%, 50% 0%, 50% 25%, -1% 25%)";
    }
    if (radiusPos === "top-right") {
      topRight = radius;
      clipPath = "polygon(50% 0%, 101% 0%, 101% 25%, 50% 25%)";
    }
    if (radiusPos === "bottom-left") {
      bottomLeft = radius;
      clipPath = "polygon(-1% 75%, 50% 75%, 50% 100%, -1% 100%)";
    }
    if (radiusPos === "bottom-right") {
      bottomRight = radius;
      clipPath = "polygon(50% 100%, 101% 100%, 101% 75%, 50% 75%)";
    }

    return (
      <Box
        sx={{
          backgroundColor: "transparent",
          position: "absolute",
          width: "20px",
          top: "-0px",
          height: "100%",
          outline: "solid 10px red",
          clipPath: clipPath,
          left: position.includes("left") ? "-20px" : "unset",
          right: position.includes("right") ? "-20px" : "unset",
          borderRadius: `${topLeft} ${topRight} ${bottomRight} ${bottomLeft}`,
        }}
      />
    );
  };

  const getFullOuterRadius = function getFullOuterRadius(
    position: "top" | "bottom" | "full"
  ) {
    return (
      <>
        {getOuterRadius(`${position}-right`, "left")}
        {getOuterRadius(`${position}-left`, "right")}
      </>
    );
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
        {batchedLines.map((batch, i) => {
          const isOnlyBatch = batchedLines.length === 1;
          const isFirstBatch = i === 0;
          const isLastBatch = i === batchedLines.length - 1;

          return (
            <Box key={i}>
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

                if (isOnlyBatch) {
                  if (isFirst) topLeftRadius = topRightRadius = radius;
                  if (isLast) bottomLeftRadius = bottomRightRadius = radius;
                } else if (isFirstBatch) {
                  if (isFirst) topLeftRadius = topRightRadius = radius;
                  if (isLast) {
                    const shorter = isShorter(line, batchedLines[i + 1][0]);
                    bottomLeftRadius = bottomRightRadius = shorter
                      ? "0px"
                      : radius;

                    if (shorter) outerCurves = getFullOuterRadius("bottom");
                  }
                } else if (isLastBatch) {
                  if (isLast) bottomLeftRadius = bottomRightRadius = radius;
                  if (isFirst) {
                    const shorter = isShorter(
                      line,
                      batchedLines[i - 1].at(-1)!
                    );
                    topLeftRadius = topRightRadius = shorter ? "0px" : radius;

                    if (shorter) outerCurves = getFullOuterRadius("top");
                  }
                } else {
                  if (isOnly) {
                    const shorterThanAbove = isShorter(
                      line,
                      batchedLines[i - 1].at(-1)!
                    );
                    const shorterThanBelow = isShorter(
                      line,
                      batchedLines[i + 1][0]
                    );

                    if (!shorterThanAbove && !shorterThanBelow) {
                      topLeftRadius =
                        topRightRadius =
                        bottomLeftRadius =
                        bottomRightRadius =
                          radius;
                    } else if (shorterThanAbove && !shorterThanBelow) {
                      bottomLeftRadius = bottomRightRadius = radius;
                      outerCurves = getFullOuterRadius("top");
                    } else if (!shorterThanAbove && shorterThanBelow) {
                      topLeftRadius = topRightRadius = radius;
                      outerCurves = getFullOuterRadius("bottom");
                    } else if (shorterThanAbove && shorterThanBelow) {
                      outerCurves = getFullOuterRadius("full");
                    }
                  } else if (isFirst) {
                    const shorter = isShorter(
                      line,
                      batchedLines[i - 1].at(-1)!
                    );
                    topLeftRadius = topRightRadius = shorter ? "0px" : radius;

                    if (shorter) outerCurves = getFullOuterRadius("top");
                  } else if (isLast) {
                    const shorter = isShorter(line, batchedLines[i + 1][0]);
                    bottomLeftRadius = bottomRightRadius = shorter
                      ? "0px"
                      : radius;

                    if (shorter) outerCurves = getFullOuterRadius("bottom");
                  }
                }

                return (
                  <Box
                    key={j}
                    sx={{
                      backgroundColor: "red",
                      padding: "1rem 1.1rem 0.75rem 1.1rem",
                      position: "relative",
                      marginTop: "-1px",
                      borderTopLeftRadius: topLeftRadius,
                      borderTopRightRadius: topRightRadius,
                      borderBottomLeftRadius: bottomLeftRadius,
                      borderBottomRightRadius: bottomRightRadius,
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    {outerCurves}
                    <Text
                      className="tiktok-classic-text"
                      size="2rem"
                      sx={{
                        lineHeight: "1.75rem",
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
