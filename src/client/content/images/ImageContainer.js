import React from "react";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import config from "./../../../config.json";
import ImageDisplay from "../../utils/ImageDisplay";
import { DataContext } from "./../../global/Data";
import ContentContainer from "./../../utils/ContentContainer";

//main
export default function ImageContainer(props) {
  const { data } = React.useContext(DataContext);
  const item = data[data.length - 1];

  return (
    <ContentContainer
      id="section_images"
      title="Images"
      subtitle="Most recent images recorded"
      noData={false}
    >
      <Box m={2}>
        <Grid container spacing={2} justify="center">
          {config["images.star"].map((x, i) => (
            <Grid item xs={4} sm={3} key={i}>
              <ImageDisplay i={i} item={item} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </ContentContainer>
  );
}
