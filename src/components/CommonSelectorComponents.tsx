import { Box, Sx } from "@mantine/core";

type OptionWrapperProps = {
  children: React.ReactNode;
  sx?: Sx | (Sx | undefined)[] | undefined;
};
export const OptionWrapper = function OptionWrapper({
  children,
  sx,
}: OptionWrapperProps) {
  return (
    <Box
      sx={{
        position: "relative",
        cursor: "pointer",
        width: "1.2rem",
        height: "1.2rem",
        borderRadius: "0.125rem",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export const getHighlight = function getHighlight(checkedColor: string) {
  return (
    <Box
      sx={{
        content: '""',
        position: "absolute",
        backgroundColor: checkedColor,
        opacity: "10%",
        width: "1.2rem",
        height: "1.2rem",
        top: 0,
        left: 0,
        borderRadius: "0.125rem",
      }}
    />
  );
};
