import { Box, Stack, Text } from "@mantine/core";
import {
  getTextDivOuterCurves,
  getTextDivRadii,
  isTextShorterThanSurroundingText,
  longestStringInArray,
} from "../views/caption-creator/helpers";

type FormattedTextProps = {
  containerRef: React.RefObject<HTMLDivElement>;
  textRef: React.RefObject<HTMLDivElement>;
  batchedLines: string[][];
  outputContainerId?: string;
};
const FormattedText = function FormattedText({
  containerRef,
  textRef,
  batchedLines,
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
  );
};

export default FormattedText;
