import { Box, Stack, StackProps, Sx, Text } from "@mantine/core";
import SVGText from "./SVGText";
import React, { forwardRef } from "react";
import ColorInformation from "../views/caption-creator/types/ColorInformation";
import Batch from "../views/caption-creator/types/Batch";
import BackgroundSVGForText from "./BackgroundSVGForText";

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
    <Stack align="center" spacing={0} {...props}>
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

type MeasurementBoxProps = {
  containerRef: React.RefObject<HTMLDivElement>;
  textRef: React.RefObject<HTMLDivElement>;
};
const MeasurementBox = function MeasurementBox({
  containerRef,
  textRef,
}: MeasurementBoxProps) {
  return (
    <FormattedWrapper pos="absolute" sx={{ visibility: "hidden" }}>
      <TextWrapper ref={containerRef}>
        <FormattedTextAsDiv content={"For Measurements"} ref={textRef} />
      </TextWrapper>
    </FormattedWrapper>
  );
};

type FormattedTextProps = {
  batches: Batch[];
  alignment: string;
  variant: string;
  colorInfo: ColorInformation;
};
const FormattedText = function FormattedText({
  batches,
  alignment,
  variant,
  colorInfo,
}: FormattedTextProps) {
  return (
    <FormattedWrapper pos="relative" align={alignmentToAlign(alignment)}>
      {batches.map((batch, i) => (
        <Box
          key={i}
          sx={{
            zIndex: 100 - i,
            marginTop: batch.width === 0 ? "2rem" : "unset",
          }}
        >
          {batch.labels.map((line, j) => (
            <Box pos="relative" key={j}>
              <TextWrapper
                sx={{
                  position: "relative",
                  width: "100%",
                  zIndex: 100 - j,
                  marginTop: i > 0 || j !== 0 ? "-0.88rem" : "unset",
                  backgroundColor: "red",
                }}
              >
                <FormattedTextAsDiv content={line.label} />

                <SVGText
                  content={line.label}
                  className="tiktok-classic-text"
                  color={
                    variant === "plain" || variant === "outline"
                      ? colorInfo.color
                      : colorInfo.color === "#FFFFFF" && variant === "opaque-bg"
                      ? "#000000"
                      : "#FFFFFF"
                  }
                  alignmentSetting={alignment}
                  batchContainerWidth={batch.width}
                  lineWidth={line.width}
                  yPos="70%"
                  svgParentStyle={{
                    position: "absolute",
                    top: "-1px",
                    left: "0",
                    height: "100%",
                    width: "100%",
                  }}
                  style={{
                    fontSize: "2rem",
                    lineHeight: "1.5rem",
                    stroke: colorInfo.outlineColor,
                    strokeWidth: variant === "outline" ? 6 : 0,
                  }}
                />
              </TextWrapper>
            </Box>
          ))}
        </Box>
      ))}
    </FormattedWrapper>
  );
};

type FormattedContentProps = {
  containerRef: React.RefObject<HTMLDivElement>;
  textRef: React.RefObject<HTMLDivElement>;
  batches: Batch[];
  alignment: string;
  variant: string;
  colorInfo: ColorInformation;
  outputContainerId?: string;
};

const FormattedContent = function FormattedContent({
  containerRef,
  textRef,
  batches,
  alignment,
  variant,
  colorInfo,
  outputContainerId = "output",
}: FormattedContentProps) {
  return (
    <Box mt={8} p="2rem 30px">
      <Box
        pos="relative"
        display="inline-block"
        id={outputContainerId}
        bg="purple"
      >
        <MeasurementBox containerRef={containerRef} textRef={textRef} />

        <BackgroundSVGForText />

        <FormattedText
          batches={batches}
          alignment={alignment}
          variant={variant}
          colorInfo={colorInfo}
        />
      </Box>
    </Box>
  );
};

export default FormattedContent;
