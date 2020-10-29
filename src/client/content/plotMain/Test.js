// import React from "react";
// import Chartjs from "chart.js";
// import Grid from "@material-ui/core/Grid";
// import Paper from "@material-ui/core/Paper";
// import IconButton from "@material-ui/core/IconButton";
// import ListIcon from "@material-ui/icons/List";
// import Menu from "@material-ui/core/Menu";
// import MenuItem from "@material-ui/core/MenuItem";
// import Typography from "@material-ui/core/Typography";
// import Box from "@material-ui/core/Box";
// import SmallDivider from "./../../utils/SmallDivider";
// import { useTheme } from "@material-ui/core/styles";
// import { DataContext } from "./../../global/Data";
// import config from "./../../../config.json";
// import moment from "moment";

// //x axis: calc scale
// // delta<=3h => show 18*10m
// // delta<=12h => show 12*1h
// // delta<=1d => show 12*2h
// // delta<=3d => show 3*1d
// // delta<=7d => show 7*1d
// // delta<=14d => show 14*1d
// // else => do not show
// const getScale = (delta) => {
//   let min10 = 10 * 60 * 1000;
//   let hrs1 = 1 * 60 * 60 * 1000;
//   let hrs3 = 3 * 60 * 60 * 1000;
//   let hrs12 = 12 * 60 * 60 * 1000;
//   let day1 = 1 * 24 * 60 * 60 * 1000;
//   let day3 = 3 * 24 * 60 * 60 * 1000;
//   let day7 = 7 * 24 * 60 * 60 * 1000;
//   let day14 = 14 * 24 * 60 * 60 * 1000;

//   if (delta <= hrs3) {
//     return {
//       count: 18,
//       scale: min10,
//       time: {
//         displayFormats: {
//           minute: "HH:mm",
//         },
//         unit: "minute",
//         unitStepSize: 10,
//       },
//     };
//   } else if (delta <= hrs12) {
//     return {
//       count: 12,
//       scale: hrs1,
//       time: {
//         displayFormats: {
//           hour: "HH:mm",
//         },
//         unit: "hour",
//         unitStepSize: 1,
//       },
//     };
//   } else if (delta <= day1) {
//     return {
//       count: 24,
//       scale: hrs1,
//       time: {
//         displayFormats: {
//           hour: "HH:mm",
//         },
//         unit: "hour",
//         unitStepSize: 1,
//       },
//     };
//   } else if (delta <= day3) {
//     return {
//       count: 3,
//       scale: day1,
//       time: {
//         unit: "day",
//         unitStepSize: 1,
//       },
//     };
//   } else if (delta <= day7) {
//     return {
//       count: 7,
//       scale: day1,
//       time: {
//         unit: "day",
//         unitStepSize: 1,
//       },
//     };
//   } else if (delta <= day14) {
//     return {
//       count: 14,
//       scale: day1,
//       time: {
//         unit: "day",
//         unitStepSize: 1,
//       },
//     };
//   } else {
//     return {
//       count: -1,
//       scale: day1,
//       time: {
//         unit: "day",
//         unitStepSize: 1,
//       },
//     };
//   }
// };

// export default function PlotMain() {
//   const theme = useTheme();
//   const chartContainer = React.useRef(null);
//   const [chartInstance, setChartInstance] = React.useState(null);
//   const [plotType, setPlotType] = React.useState(0);
//   const dataContext = React.useContext(DataContext);
//   const yLabels = React.useRef(Object.values(config["times.star"]));

//   //calc data
//   //-> for-loops more efficient than filter()+map()
//   React.useEffect(() => {
//     //if empty
//     if (dataContext.data.length === 0) {
//       return;
//     }

//     //x axis: calc min and max Date
//     let minDate = new Date();
//     let maxDate = new Date(0);
//     for (let i = 0; i < dataContext.data.length; i++) {
//       let dateString = dataContext.data[i][yLabels.current[plotType]];
//       if (dateString !== 0) {
//         let dateObj = new Date(dateString);
//         if (dateObj <= minDate) {
//           minDate = dateObj;
//         }
//         if (dateObj >= maxDate) {
//           maxDate = dateObj;
//         }
//       }
//     }
//     let scale = getScale(maxDate - minDate);

//     //x axis: calc data
//     let xData = [];
//     if (scale.time.unit === "minute") {
//       maxDate.setMinutes(Math.floor(maxDate.getMinutes() / 10) * 10, 0, 0);
//     } else if (scale.time.unit === "hour") {
//       maxDate.setHours(maxDate.getHours(), 0, 0);
//     } else if (scale.time.unit === "day") {
//       maxDate.setHours(0, 0, 0);
//     }
//     for (let i = 0; i < scale.count + 1; i++) {
//       xData.unshift(new Date(maxDate - i * scale.scale));
//     }

//     //y axis: calc data
//     let yData = new Array(xData.length).fill(0);
//     for (let i = 0; i < dataContext.data.length; i++) {
//       for (let u = 0; u < xData.length; u++) {
//         let dateObj = new Date(dataContext.data[i][yLabels.current[plotType]]);
//         let datePrev = xData[u];
//         let dateNext = u === xData.length - 1 ? new Date() : xData[u + 1];
//         if (dateObj >= datePrev && dateNext > dateObj) {
//           yData[u] += 1;
//           break;
//         }
//       }
//     }

//     //update
//     if (chartInstance != null) {
//       chartInstance.data.labels = xData;
//       chartInstance.data.datasets[0].data = yData;
//       chartInstance.options.scales.xAxes[0].time = scale.time;
//       chartInstance.update();
//     }
//   }, [dataContext.data, chartInstance, plotType]);

//   //configuration
//   React.useEffect(() => {
//     const chartConfig = {
//       type: "bar",
//       data: {
//         labels: [],
//         datasets: [
//           {
//             data: [],
//             backgroundColor: "rgba(54, 162, 235, 0.2)",
//             borderColor: "rgba(54, 162, 235, 1)",
//             borderWidth: 1,
//             categoryPercentage: 1.0,
//             barPercentage: 1.0,
//           },
//         ],
//       },
//       options: {
//         scales: {
//           yAxes: [
//             {
//               ticks: {
//                 beginAtZero: true,
//                 fontColor: theme.palette.text.primary,
//                 stepSize: 5,
//               },
//             },
//           ],
//           xAxes: [
//             {
//               type: "time",
//               bounds: "ticks",
//               time: {
//                 displayFormats: {
//                   minute: "HH:mm",
//                 },
//                 unit: "minute",
//                 unitStepSize: 10,
//               },
//               gridLines: {
//                 display: false,
//               },
//               ticks: {
//                 fontColor: theme.palette.text.primary,
//                 major: {
//                   enabled: true,
//                   fontStyle: "bold",
//                   fontSize: 14,
//                   displayFormats: {
//                     minute: "HH:mm",
//                   },
//                 },
//               },
//             },
//           ],
//         },
//         tooltips: {
//           callbacks: {
//             title: () => "",
//           },
//           // displayColors: false,
//         },
//         legend: {
//           display: false,
//         },
//         maintainAspectRatio: false, //adjust height
//       },
//     };

//     if (chartContainer && chartContainer.current) {
//       const newChartInstance = new Chartjs(chartContainer.current, chartConfig);
//       setChartInstance(newChartInstance);
//     }
//   }, [chartContainer, theme.palette.text.primary]);

//   //Title
//   const Title = () => (
//     <div>
//       <Typography
//         variant="body1"
//         style={{ color: theme.palette.warning.main }}
//         id="section_2"
//       >
//         Volume
//       </Typography>
//       <Typography
//         variant="body2"
//         gutterBottom
//         color="textSecondary"
//         paragraph={true}
//       >
//         Number of images recorded
//       </Typography>
//     </div>
//   );

//   //Menu
//   function SimpleMenu() {
//     const [anchorEl, setAnchorEl] = React.useState(null);

//     const handleClick = (event) => {
//       setAnchorEl(event.currentTarget);
//     };

//     const handleClose = () => {
//       setAnchorEl(null);
//     };

//     return (
//       <div>
//         <IconButton onClick={handleClick}>
//           <ListIcon />
//         </IconButton>
//         <Menu
//           id="simple-menu"
//           anchorEl={anchorEl}
//           keepMounted
//           open={Boolean(anchorEl)}
//           onClose={handleClose}
//         >
//           {yLabels.current.map((x, i) => (
//             <MenuItem
//               onClick={() => {
//                 setPlotType(i);
//                 setAnchorEl(null);
//               }}
//               key={i}
//             >
//               {x}
//             </MenuItem>
//           ))}
//         </Menu>
//       </div>
//     );
//   }

//   //render
//   console.log("Updated: Plot Main");
//   return (
//     <Grid container>
//       <Grid item xs={12}>
//         <div id="section_volume" />
//         <Paper>
//           <Box p={2}>
//             <Grid container justify="space-between">
//               <Grid item>
//                 <Title />
//               </Grid>
//               <Grid item>
//                 <SimpleMenu />
//               </Grid>
//             </Grid>

//             <Grid item xs={12}>
//               <div style={{ height: 320 }}>
//                 <canvas ref={chartContainer} />
//               </div>
//             </Grid>
//           </Box>
//         </Paper>
//         <SmallDivider />
//       </Grid>
//     </Grid>
//   );
// }
