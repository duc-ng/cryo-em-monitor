import React from "react";
import Table from "./Table";
import config from "./../../../config.json";
import { DataContext } from "./../../global/Data";
import Card from "@material-ui/core/Card";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import SmallDivider from "./../../utils/SmallDivider";

export default function TableContainer() {
  const dataContext = React.useContext(DataContext);

  //clean data for table
  const getCleanedData = () => {
    return dataContext.data.map((item) => {
      return {
        data: item,
        key: item[config.key],
      };
    });
  };

  //render
  return (
    <React.Fragment>
      <div id="section_data" />
      <Card>
        <Box py={2}>
          <Table rows={getCleanedData()} />
        </Box>
      </Card>
      <SmallDivider />
    </React.Fragment>
  );
}
