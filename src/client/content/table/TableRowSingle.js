import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Checkbox from "@material-ui/core/Checkbox";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import IconButton from "@material-ui/core/IconButton";
import Collapse from "@material-ui/core/Collapse";
import config from "./../../../config.json";
import moment from "moment";
import { DataContext } from "./../../global/Data";
import GridList from "@material-ui/core/GridList";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import GridListTile from "@material-ui/core/GridListTile";

const useStyles = makeStyles((theme) => ({
  img: {
    width: "100%",
    height: "auto",
    "&:hover": {
      opacity: 0.7,
    },
  },
}));

export default function TableRowSingle(props) {
  const { row, isSelected, handleClick } = props;
  const isItemSelected = isSelected(row.key);
  const [images, setImages] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const dataContext = React.useContext(DataContext);

  const handleCollapse = () => {
    setOpen(!open);
    dataContext.fetchImages(row.key, setImages);
  };

  const RowValues = () => {
    const nrPlots = Object.keys(config["data.star"]).length;
    let tableCell = [];

    //format date
    tableCell.push(
      <TableCell component="th" scope="row" key={row.key}>
        {moment(row.data[config["times.star"].main]).calendar()}
      </TableCell>
    );

    //round values
    for (let i = 0; i < nrPlots; i++) {
      const value = row.data[config["data.star"][i].value];
      value !== undefined && Number(value) === value && value % 1 !== 0
        ? tableCell.push(
            <TableCell align="right" key={i}>
              {value.toFixed(4)}
            </TableCell>
          )
        : tableCell.push(<TableCell key={i} />);
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
              <Grid container justify="center">
                <GridList
                  className={classes.gridList}
                  cols={images.length}
                  cellHeight="auto"
                  spacing={10}
                >
                  {images.map((item, i) => (
                    <GridListTile key={i}>
                      <img
                        className={classes.img}
                        alt={item.label}
                        src={item.data}
                      />
                    </GridListTile>
                  ))}
                </GridList>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
