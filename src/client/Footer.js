import React from "react";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";

export default function Footer() {
  //onst preventDefault = (event) => event.preventDefault();

  return (
    <Box pt={5} pb={5}>
      <Grid container spacing={2} justify="center">
        <Typography variant="body2" color="textSecondary" component="p">
          @
          <Link href="https://github.com/duc-ng/web-monitoring" color="inherit">
            Duc Nguyen
          </Link>
           {" 2020, Max Planck Institute of Biochemistry"}
        </Typography>
      </Grid>
    </Box>
  );
}