import React from "react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Checkbox from "@material-ui/core/Checkbox";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";
import config from "./../../../config.json";
import ImageDisplay from "../../utils/ImageDisplay";
import moment from "moment";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";

export default function TableRowSingle(props) {
  const { row, isSelected, handleClick } = props;
  const isItemSelected = isSelected(row.key);
  const [open, setOpen] = React.useState(false);

  const handleCollapse = async () => {
    setOpen(!open);
  };

  React.useEffect(() => {
    setOpen(false);
  }, [props.closeCollapse]);

  const RowValues = () => {
    const nrPlots = config["data.star"].length;
    let tableCell = [];

    //format date
    tableCell.push(
      <TableCell component="th" scope="row" key={row.key}>
        {moment(row.data[config["times.star"][0].value]).calendar()}
      </TableCell>
    );

    //round values
    for (let i = 0; i < nrPlots; i++) {
      let value = row.data[config["data.star"][i].value];
      if (value !== undefined && Number(value) === value) {
        if (value % 1 !== 0) {
          value = value.toFixed(4);
        }
        tableCell.push(
          <TableCell align="right" key={i}>
            {value}
          </TableCell>
        );
      } else {
        tableCell.push(<TableCell key={i} />);
      }
    }
    return tableCell;
  };

  return (
    <React.Fragment>
      {/* Main row */}
      <TableRow
        hover
        role="checkbox"
        tabIndex={-1}
        key={row.name}
        selected={isItemSelected}
      >
        <TableCell padding="checkbox">
          <Checkbox
            checked={isItemSelected}
            onClick={(event) => handleClick(event, row.key)}
            size="small"
          />
        </TableCell>
        <RowValues />
        <TableCell>
          <IconButton size="small" onClick={handleCollapse}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>

      {/* Collapsed image preview */}
      <TableRow>
        <TableCell padding="none" colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box py={2} px={8}>
              <Grid container spacing={2} justify="center">
                {config["images.star"].map((x, i) => (
                  <Grid item xs={4} sm={3} key={i}>
                    <ImageDisplay i={i} item={row.data} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
