import React from "react";
import Box from "@material-ui/core/Box";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import { useTheme } from "@material-ui/core/styles";

export default function SmallDivider() {
  const theme = useTheme();

  return (
    <Grid container justify="center">
      <Grid item xs={3}>
        <Box py={theme.spacing(0.5)}>
          <Divider light={false} variant={"middle"} />
        </Box>
      </Grid>
    </Grid>
  );
}
