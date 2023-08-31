type SVGTextProps = {
  content: string;
  color?: string;
  strokeColor?: string;
  style?: React.CSSProperties | undefined;
  className?: string;
  alignmentSetting?: string;
};

const SVGText = function SVGText({
  content,
  color = "white",
  strokeColor = "black",
  style,
  className,
  alignmentSetting = "center",
}: SVGTextProps) {
  const getXPosFromAlignment = function getXPosFromAlignment() {
    if (alignmentSetting === "left") return "0%";
    if (alignmentSetting === "right") return "100%";
    return "50%";
  };

  const getTranslateFromAlignment = function getTranslateFromAlignment() {
    if (alignmentSetting === "left") return "translateX(1rem)";
    if (alignmentSetting === "right") return "translateX(-1rem)";
    return "translateX(0)";
  };

  const getTextAnchorFromAlignment = function getTextAnchorFromAlignment() {
    if (alignmentSetting === "left") return "start";
    if (alignmentSetting === "right") return "end";
    return "middle";
  };

  return (
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <text
        className={className}
        x={getXPosFromAlignment()}
        y="55%"
        style={{
          fontSize: "1.25rem",
          fontWeight: "bold",
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
