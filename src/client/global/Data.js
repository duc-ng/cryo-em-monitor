import React from "react";
import config from "./../../config.json";
import moment from "moment";
import "moment/locale/en-gb";

//24hours instead of AM/PM + format
moment.locale("en", {
  longDateFormat: {
    LT: "h:mm:ss", //added :ss
    L: "MM/DD/YYYY",
    l: "M/D/YYYY",
    LL: "MMMM Do YYYY",
    ll: "MMM D YYYY",
    LLL: "MMMM Do YYYY LT",
    lll: "MMM D YYYY LT",
    LLLL: "dddd, MMMM Do YYYY LT",
    llll: "ddd, MMM D YYYY LT",
  },
});

export const DataContext = React.createContext({});

export default function Data(props) {
  const [dataAll, setDataAll] = React.useState([]);
  const [dataFiltered, setDataFiltered] = React.useState([]);
  const [dataLastImages, setLastImages] = React.useState([]);
  const [counter, setCounter] = React.useState(0);
  const [dateFrom, setDateFrom] = React.useState(undefined);
  const [dateTo, setDateTo] = React.useState(undefined);
  const [microscope, setMicroscope] = React.useState(0);

  //image url
  const getImageAPI = (key) => {
    return (
      "http://" +
      config.app.api_host +
      ":" +
      config.app.api_port +
      "/imagesAPI?key=" +
      key +
      "&microscope=" +
      microscope
    );
  };

  //reset microscope
  const switchMicroscope = (val) => {
    setDataAll([]);
    setDataFiltered([]);
    setLastImages([]);
    setCounter(0);
    setDateFrom(undefined);
    setDateTo(undefined);
    setMicroscope(val);
  };

  //set fetched data
  const setFetchedData = (data,images) => {
    setLastImages(images);
    setDataAll(...dataAll, data);
  }

  //calc filtered Data
  React.useEffect(() => {
    const filteredData = dataAll.filter((item) => {
      const date = new Date(item[config["times.star"].main]);
      const cond1 = dateFrom === undefined ? true : date - dateFrom > 0;
      const cond2 = dateTo === undefined ? true : dateTo - date > 0;
      return date !== 0 && date !== undefined && cond1 && cond2;
    });
    // if (filteredData.length === 0) {
    //   setLastImages([]);
    // }
    setDataFiltered(filteredData);
  }, [dateFrom, dateTo, dataAll]);

  //increase Counter +1
  const incCounter = () => {
    setCounter(counter + 1);
  };

  //get date of last item
  const getLastDate = () => {
    return dataFiltered.length === 0
      ? 0
      : dataFiltered[dataFiltered.length - 1][config["times.star"].main];
  };

  //render
  return (
    <DataContext.Provider
      value={{
        data: dataFiltered,
        lastItemDate: getLastDate(),
        counter: dataFiltered.length + counter,
        incCounter: incCounter,
        dataLastImages: dataLastImages,
        setFetchedData: setFetchedData,
        setDateFrom: setDateFrom,
        dateFrom: dateFrom,
        setDateTo: setDateTo,
        setDataFiltered: setDataFiltered,
        dateTo: dateTo,
        dataAll: dataAll,
        switchMicroscope: switchMicroscope,
        microscope: microscope,
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
}
