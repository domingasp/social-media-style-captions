import { Box, Stack, Text } from "@mantine/core";
import {
  getTextDivOuterCurves,
  getTextDivRadii,
  isTextShorterThanSurroundingText,
  longestStringInArray,
} from "../views/caption-creator/helpers";
import SVGText from "../services/SVGText";
import { forwardRef } from "react";

type FormattedTextAsDivProps = {
  content: string;
};
const FormattedTextAsDiv = forwardRef<HTMLDivElement, FormattedTextAsDivProps>(
  function FormattedTextAsDiv(props, ref) {
    return (
      <Text
        className="tiktok-classic-text"
        size="2rem"
        sx={{
          lineHeight: "1.5rem",
          visibility: "hidden",
        }}
        ref={ref}
      >
        {props.content}
      </Text>
    );
  }
);

type FormattedTextProps = {
  containerRef: React.RefObject<HTMLDivElement>;
  textRef: React.RefObject<HTMLDivElement>;
  batchedLines: string[][];
  variant: string;
  outputContainerId?: string;
};
const FormattedText = function FormattedText({
  containerRef,
  textRef,
  batchedLines,
  variant = "plain",
  outputContainerId = "output",
}: FormattedTextProps) {
  const radius = "9px";

  return (
    <Stack align="center" spacing={0} id={outputContainerId} p="2rem 30px">
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
        <FormattedTextAsDiv content={"For Measurements"} ref={textRef} />
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

                <FormattedTextAsDiv content={line} />

                <Box pos="absolute" top="-1px" left="0px" h="100%">
                  <SVGText
                    content={line}
                    className="tiktok-classic-text"
                    color="black"
                    style={{
                      fontSize: "2rem",
                      lineHeight: "1.5rem",
                      fontWeight: "unset",
                      strokeWidth: 0,
                    }}
                  />
                </Box>
              </Box>
            );
          })}
        </Box>
      ))}
    </Stack>
  );
};

export default FormattedText;
