import { Box, Button, Stack, Text, Textarea, Title } from "@mantine/core";
import { toPng, toSvg } from "html-to-image";
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

  const getOuterRadius = function getOuterRadius(
    radiusPos:
      | "full-left"
      | "full-right"
      | "top-left"
      | "top-right"
      | "bottom-left"
      | "bottom-right" = "full-left",
    position: "left" | "right" = "left"
  ) {
    let topLeft, topRight, bottomLeft, bottomRight;
    topLeft = topRight = bottomLeft = bottomRight = "0px";

    if (radiusPos === "full-left") topLeft = bottomLeft = "10px";
    if (radiusPos === "full-right") topRight = bottomRight = "10px";
    if (radiusPos === "top-left") topLeft = "10px";
    if (radiusPos === "top-right") topRight = "10px";
    if (radiusPos === "bottom-left") bottomLeft = "10px";
    if (radiusPos === "bottom-right") bottomRight = "10px";

    return (
      <Box
        sx={{
          backgroundColor: "transparent",
          position: "absolute",
          width: "20px",
          top: "-0px",
          height: "100%",
          outline: "solid 10px red",
          clipPath: position.includes("left")
            ? "polygon(50% 0%, 101% 0%, 101% 100%, 50% 100%)"
            : "polygon(-1% 0%, 50% 0%, 50% 100%, -1% 100%)",
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
              padding: `10px 12px ${
                i === lines.length - 1 ? "10px" : "0px"
              } 12px`,
              position: "relative",
              marginTop: "-1px",
            }}
          >
            {getOuterRadius("full-left", "right")}
            <Text>{line}</Text>
          </Box>
        ))}
      </Stack>
    </Stack>
  );
}

export default CaptionCreator;
