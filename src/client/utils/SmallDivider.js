import React from "react";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import { useTheme } from "@material-ui/core/styles";

export default function SmallDivider() {
  const theme = useTheme();

  return (
    <Box py={theme.spacing(0.5)} px={theme.spacing(8)}>
      <Divider light={false} variant={"middle"} />
    </Box>
  );
}
