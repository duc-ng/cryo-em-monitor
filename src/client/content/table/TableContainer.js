import React from "react";
import { useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Table from "./Table";
import config from "./../../../config.json";
import { DataContext } from "./../../global/Data";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import SmallDivider from "./../../utils/SmallDivider";

export default function TableContainer() {
  const dataContext = React.useContext(DataContext);
  const theme = useTheme();

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
    //format 
    let tableData = JSON.parse(JSON.stringify(dataContext.data)); //deep copy
    tableData = tableData.map((item) => {
      return {
        data: item,
        key: item[config.key],
      };
    });

    //remove data, that is not displayed
    tableData.forEach((elem) => {
      for (let prop in elem.data) {
        if (headerValues().indexOf(prop) === -1) {
          delete elem.data[prop];
        }
      }
    });

    //round data
    tableData.forEach((elem) => {
      for (let key in elem.data) {
        let obj = elem.data[key];
        if (Number(obj) === obj && obj % 1 !== 0) {
          elem.data[key] = obj.toFixed(2);
        }
      }
    });

    return tableData;
  };

  //render
  return (
    <React.Fragment>
      <Card>
        <CardContent>
          <Typography
            variant="body1"
            style={{ color: theme.palette.warning.main }}
          >
            Data
          </Typography>
          <Typography
            variant="body2"
            gutterBottom
            color="textSecondary"
            paragraph={true}
          >
            Cras mattis consectetur purus sit amet fermentum.
          </Typography>
          <Table attr={getCleanedData()} valueNames={headerValues()} />
        </CardContent>
      </Card>
      <SmallDivider />
    </React.Fragment>
  );
}
