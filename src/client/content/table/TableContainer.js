import React from "react";
import Table from "./Table";
import config from "./../../../config.json";
import { DataContext } from "./../../global/Data";
import Card from "@material-ui/core/Card";
import Box from "@material-ui/core/Box";
import SmallDivider from "./../../utils/SmallDivider";

export default function TableContainer() {
  const dataContext = React.useContext(DataContext);

  //get table header values
  const headerValues = () => {
    let part1 = [config["times.star"].main];
    let part2 = Object.keys(config["data.star"]).map(
      (x) => config["data.star"][x].value
    );
    return [...part1, ...part2];
  };

  //clean data for table
  const getCleanedData = () => {
    let cleanedData = JSON.parse(JSON.stringify(dataContext.data)); //deep copy
    cleanedData = cleanedData.map((item) => {
      return {
        data: item,
        key: item[config.key],
      };
    });

    cleanedData.forEach((elem) => {
      for (let prop in elem.data) {
        if (headerValues().indexOf(prop) === -1) {
          delete elem.data[prop];
        }
      }
    });

    return cleanedData;
  };

  //render
  return (
    <React.Fragment>
      <Card id="section_2">
        <Box py={2}>
          <Table
            rows={getCleanedData()}
          />
        </Box>
      </Card>
      <SmallDivider />
    </React.Fragment>
  );
}
