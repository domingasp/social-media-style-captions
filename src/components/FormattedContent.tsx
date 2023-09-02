import { Box, Stack, StackProps, Sx, Text } from "@mantine/core";
import SVGText from "../services/SVGText";
import React, { forwardRef } from "react";
import {
  getTextDivOuterCurves,
  getTextDivRadii,
  isTextShorterThanSurroundingText,
  longestStringInArray,
} from "../views/caption-creator/helpers";
import { LabelWidth } from "../views/caption-creator/types/LabelWidth";
import ColorInformation from "../views/caption-creator/types/ColorInformation";

const alignmentToAlign = function alignmentToAlign(alignment: string) {
  if (alignment === "left") return "flex-start";
  if (alignment === "right") return "flex-end";
  return "center";
};

type FormattedWrapperProps = {
  children?: React.ReactNode;
} & StackProps;
const FormattedWrapper = function FormattedWrapper({
  children,
  ...props
}: FormattedWrapperProps) {
  return (
    <Stack align="center" spacing={0} p="2rem 30px" {...props}>
      {children}
    </Stack>
  );
};

type TextWrapperProps = {
  children?: React.ReactNode;
  sx?: Sx | (Sx | undefined)[] | undefined;
};
const TextWrapper = React.forwardRef<HTMLDivElement, TextWrapperProps>(
  function TextWrapper({ children, sx }, ref) {
    return (
      <Box
        ref={ref}
        sx={{
          padding: "1rem 1.1rem 1rem 1.1rem",
          ...sx,
        }}
      >
        {children}
      </Box>
    );
  }
);

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

type BackgroundProps = {
  containerRef: React.RefObject<HTMLDivElement>;
  textRef: React.RefObject<HTMLDivElement>;
  batchedLines: LabelWidth[][];
  alignment: string;
  variant: string;
  colorInfo: ColorInformation;
};
const Background = function Background({
  containerRef,
  textRef,
  batchedLines,
  alignment,
  variant,
  colorInfo,
}: BackgroundProps) {
  const radius = "9px";

  const getBackgroundColor = function getBackgroundColor(line: string) {
    if (line.length === 0) return "transparent";
    if (variant === "plain" || variant === "outline") {
      return "transparent";
    }

    return colorInfo.color;
  };

  return (
    <FormattedWrapper
      opacity={variant === "transparent-bg" ? "50%" : "100%"}
      align={alignmentToAlign(alignment)}
    >
      <TextWrapper
        ref={containerRef}
        sx={{ position: "absolute", top: 0, visibility: "hidden" }}
      >
        <FormattedTextAsDiv content={"For Measurements"} ref={textRef} />
      </TextWrapper>

      {batchedLines.map((batch, i) => (
        <Box key={i} sx={{ zIndex: 100 - i }}>
          {batch.map((line, j) => {
            const isShorter = isTextShorterThanSurroundingText(
              longestStringInArray(batchedLines[i]).label,
              batchedLines[i - 1] && batchedLines[i - 1].length > 0
                ? longestStringInArray(batchedLines[i - 1]).label
                : undefined,
              batchedLines[i + 1] && batchedLines[i + 1].length > 0
                ? longestStringInArray(batchedLines[i + 1]).label
                : undefined
            );

            const outerCurves = getTextDivOuterCurves(
              i === 0,
              i === batchedLines.length - 1,
              j === 0,
              j === batch.length - 1,
              batch.length === 1,
              isShorter,
              radius,
              getBackgroundColor(line.label),
              alignment
            );
            const radii = getTextDivRadii(isShorter, radius);

            return (
              <TextWrapper
                key={j}
                sx={{
                  position: "relative",
                  backgroundColor: getBackgroundColor(line.label),
                  marginTop: line.label.length === 0 ? "8px" : "-0.88rem",
                  borderRadius: `${radii.topLeft} ${radii.topRight} ${radii.bottomRight} ${radii.bottomLeft}`,
                  width: "100%",
                  zIndex: 100 - j,
                }}
              >
                {line.label.length > 0 && outerCurves}

                <FormattedTextAsDiv content={line.label} />
              </TextWrapper>
              //
            );
          })}
        </Box>
      ))}
    </FormattedWrapper>
  );
};

type FormattedTextProps = {
  batchedLines: LabelWidth[][];
  alignment: string;
  variant: string;
  colorInfo: ColorInformation;
};
const FormattedText = function FormattedText({
  batchedLines,
  alignment,
  variant,
  colorInfo,
}: FormattedTextProps) {
  return (
    <FormattedWrapper
      pos="absolute"
      top={0}
      sx={{
        left: 0,
        right: 0,
        margin: "auto",
      }}
      align={alignmentToAlign(alignment)}
    >
      {batchedLines.map((batch, i) => (
        <Box key={i} sx={{ zIndex: 100 - i }}>
          {batch.map((line, j) => {
            return (
              <Box pos="relative" key={j}>
                <TextWrapper
                  sx={{
                    position: "relative",
                    width: "100%",
                    zIndex: 100 - j,
                    marginTop: line.label.length === 0 ? "8px" : "-0.88rem",
                  }}
                >
                  <FormattedTextAsDiv content={line.label} />

                  <Box pos="absolute" top="-1px" left="0px" h="100%" w="100%">
                    <SVGText
                      content={line.label}
                      className="tiktok-classic-text"
                      color={
                        variant === "plain" || variant === "outline"
                          ? colorInfo.color
                          : colorInfo.color === "#FFFFFF" &&
                            variant === "opaque-bg"
                          ? "#000000"
                          : "#FFFFFF"
                      }
                      alignmentSetting={alignment}
                      batchContainerWidth={Math.max(
                        ...batch.map((b) => b.width)
                      )}
                      lineWidth={line.width}
                      style={{
                        fontSize: "2rem",
                        lineHeight: "1.5rem",
                        stroke: colorInfo.outlineColor,
                        strokeWidth: variant === "outline" ? 6 : 0,
                      }}
                    />
                  </Box>
                </TextWrapper>
              </Box>
            );
          })}
        </Box>
      ))}
    </FormattedWrapper>
  );
};

type FormattedContentProps = {
  containerRef: React.RefObject<HTMLDivElement>;
  textRef: React.RefObject<HTMLDivElement>;
  batchedLines: LabelWidth[][];
  alignment: string;
  variant: string;
  colorInfo: ColorInformation;
  outputContainerId?: string;
};

const FormattedContent = function FormattedContent({
  containerRef,
  textRef,
  batchedLines,
  alignment,
  variant,
  colorInfo,
  outputContainerId = "output",
}: FormattedContentProps) {
  return (
    <Box mt={8}>
      <Box pos="relative" display="inline-block" id={outputContainerId}>
        <Background
          containerRef={containerRef}
          textRef={textRef}
          batchedLines={batchedLines}
          alignment={alignment}
          variant={variant}
          colorInfo={colorInfo}
        />

        <FormattedText
          batchedLines={batchedLines}
          alignment={alignment}
          variant={variant}
          colorInfo={colorInfo}
        />
      </Box>
    </Box>
  );
};

export default FormattedContent;
