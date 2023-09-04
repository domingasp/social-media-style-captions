type SVGTextProps = {
  content: string;
  color?: string;
  strokeColor?: string;
  svgParentStyle?: React.CSSProperties;
  style?: React.CSSProperties | undefined;
  className?: string;
  alignmentSetting?: string;
  batchContainerWidth?: number;
  lineWidth?: number;
  yPos?: string;
};

const SVGText = function SVGText({
  content,
  color = "white",
  strokeColor = "black",
  svgParentStyle,
  style,
  className,
  alignmentSetting = "center",
  batchContainerWidth,
  lineWidth,
  yPos = "80%",
}: SVGTextProps) {
  const getXPosFromAlignment = function getXPosFromAlignment() {
    if (alignmentSetting === "left") return "0%";
    if (alignmentSetting === "right")
      return batchContainerWidth && lineWidth
        ? batchContainerWidth - lineWidth
        : "0%";
    return "50%";
  };

  const getTranslateFromAlignment = function getTranslateFromAlignment() {
    if (alignmentSetting === "left" || alignmentSetting === "right") {
      return "translateX(1.1rem)";
    }
    return "translateX(0)";
  };

  const getTextAnchorFromAlignment = function getTextAnchorFromAlignment() {
    if (alignmentSetting === "left" || alignmentSetting === "right") {
      return "start"; // using end for 'right' gave inconsistent alignment
    }
    return "middle";
  };

  return (
    <svg
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      style={{ ...svgParentStyle }}
    >
      <text
        className={className}
        x={getXPosFromAlignment()}
        y={yPos}
        style={{
          fill: color,
          stroke: strokeColor,
          strokeWidth: "5px",
          strokeLinejoin: "round",
          paintOrder: "stroke fill",
          textAnchor: getTextAnchorFromAlignment(),
          alignmentBaseline: "middle",
          transform: getTranslateFromAlignment(),
          ...style,
        }}
      >
        {content}
      </text>
    </svg>
  );
};

export default SVGText;
