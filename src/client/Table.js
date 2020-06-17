import React, {Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Collapse from '@material-ui/core/Collapse';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Images from "./Images";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";


function descendingComparator(a, b, orderBy) {
  if (a && b){
    a = a.data
    b = b.data
  }
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {

  const stabilizedThis = array.map((el, index) => [el, index]);
  console.log(stabilizedThis)

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function getHeadCells (){
  const config = require("./../config.json")
  const configLength = Object.keys(config["data.star"]).length
  var temp = []
  for (var i=0; i<configLength;i++){
    if (i===0){
      temp.push({ id: config["times.star"][1], numeric: false, disablePadding: true, label: "Time"})
    } else {
      temp.push({ id: config["data.star"][i]["value"], numeric: true, disablePadding: true, label: config["data.star"][(i).toString(10)].name},);
    }
  }
  return temp;
}
const headCells = getHeadCells()

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell />
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > *': {
      borderBottom: 'unset',
    },
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  box: {
    height: 30
  }
}));

function Row(props) {
  const key = props.valueNames[Object.keys(props.valueNames)[0]];
  const nrPlots = Object.keys(props.valueNames).length
  let tableCell = [];
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();

  for (let i = 0; i < nrPlots; i++) {
    if(i===0) {   
      tableCell.push(
      <Fragment key={i}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" id={props.index} scope="row"  key={i}>
          {row[key]}
        </TableCell>
      </Fragment>)
    } else {
      tableCell.push(
      <TableCell align="right" key={i}>
        {row[props.valueNames[Object.keys(props.valueNames)[i]]]}
      </TableCell>
    );
    }
  }
  
  return (
    <Fragment >
      <TableRow
        hover
        role="checkbox"
        tabIndex={-1}
        key={row.key}
        className={classes.root}
      >{tableCell}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
              <Typography variant="h6"  component="div">
                <Grid container spacing={2} justify="flex-end">
                  <Grid item xs={11}>
                  <Box m={1}>
                    <Grid container spacing={2} justify="center">
                        <Images attr={props.img} color="transparent" xs={2} sm={2} md={3}/>
                    </Grid>
                  </Box>
                  </Grid>
                </Grid>
              </Typography>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>

  );
}

export default function EnhancedTable(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState(Object.values(props.valueNames)[0]);
  const [page, setPage] = React.useState(0);
  const [dense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const rows = props.attr;


  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
  
  return (
    <div className={classes.root}>
        {/* <Box className={classes.box} /> */}
           <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const img = props.images
                                  .filter(obj => obj.key === row.key)
                                  .map(obj => obj.images)[0]
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return <Row 
                            key={row.key} 
                            row={row.data} 
                            index={labelId} 
                            valueNames={props.valueNames} 
                            img={img}  
                            />
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 20, 40]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
    </div>
  );
}
