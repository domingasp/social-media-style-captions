import { Box } from "@mantine/core";

type OptionWrapperProps = { children: React.ReactNode };
export const OptionWrapper = function OptionWrapper({
  children,
}: OptionWrapperProps) {
  return <Box sx={{ position: "relative", cursor: "pointer" }}>{children}</Box>;
};

export const getHighlight = function getHighlight(checkedColor: string) {
  return (
    <Box
      sx={{
        content: '""',
        position: "absolute",
        backgroundColor: checkedColor,
        opacity: "10%",
        width: "24px",
        height: "24px",
        top: 0,
        left: -1,
        borderRadius: 4,
      }}
    />
  );
};
