import { Box, Button, Stack, Text, Textarea, Title } from "@mantine/core";
import { toPng, toSvg } from "html-to-image";
import { useEffect, useState } from "react";

function CaptionCreator() {
  const radius = "7px";

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

  const getOuterRadius = function getOuterRadius(
    radiusPos: string = "full-left",
    position: "left" | "right" = "left"
  ) {
    let topLeft, topRight, bottomLeft, bottomRight;
    topLeft = topRight = bottomLeft = bottomRight = "0px";

    let clipPath = "polygon(50% 0%, 101% 0%, 101% 100%, 50% 100%)";

    if (radiusPos === "full-left") {
      topLeft = bottomLeft = "10px";
      clipPath = "polygon(50% 0%, 101% 0%, 101% 100%, 50% 100%)";
    }
    if (radiusPos === "full-right") {
      topRight = bottomRight = radius;
      clipPath = "polygon(-1% 0%, 50% 0%, 50% 100%, -1% 100%)";
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
        {lines.map((line, i) => (
          <Box
            key={i}
            sx={{
              backgroundColor: "red",
              padding: "0.9rem 0.85rem 1rem 0.85rem",
              position: "relative",
              marginTop: "-1px",
              borderTopLeftRadius: radius,
              borderTopRightRadius: radius,
              borderBottomLeftRadius: radius,
              borderBottomRightRadius: radius,
            }}
          >
            {getOuterRadius(`top-left`, "right")}
            {getOuterRadius(`bottom-right`, "left")}
            <Text
              className="tiktok-classic-text"
              size="2rem"
              sx={{
                lineHeight: "1.2rem",
              }}
            >
              {line}
            </Text>
          </Box>
        ))}
      </Stack>
    </Stack>
  );
}

export default CaptionCreator;
