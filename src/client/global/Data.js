import React from "react";
import config from "./../../config.json";
import moment from "moment";
import "moment/locale/en-gb";

//24hours instead of AM/PM + format
moment.locale("en", {
  longDateFormat: {
    LT: "H:mm:ss", //added :ss
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
  const [counter, setCounter] = React.useState(0); //force rerender
  const [microscope, setMicroscope] = React.useState(0);
  const [data, setData] = React.useState({
    dataAll: [],
    dataFiltered: [],
    from: new Date(Date.now() - 3 * 60 * 60 * 1000), //last 3h
    to: undefined,
  });

  //reset microscope
  const switchMicroscope = (val) => {
    setMicroscope(val);
    setData({
      dataAll: [],
      dataFiltered: [],
    });
  };

  //increase Counter +1
  const incCounter = () => {
    setCounter(counter + 1);
  };

  //get last date
  const getLastDate = () => {
    const arr = data.dataFiltered;
    return arr.length === 0
      ? 0
      : arr[arr.length - 1][config["times.star"][0].value];
  };

  //get last key
  const getLastKey = (arr) => {
    return arr.length === 0 ? undefined : arr[arr.length - 1][config.key];
  };

  //set fetched data
  const setFetchedData = async (newData) => {
    const all = [...data.dataAll, ...newData];
    setData({
      ...data,
      dataAll: all,
      dataFiltered: await updateData(all, data.from, data.to),
    });
  };

  //set filter: from - to
  const setFromTo = async (from, to) => {
    setData({
      ...data,
      dataFiltered: await updateData(data.dataAll, from, to),
      from: from,
      to: to,
    });
  };

  //update: data + images
  const updateData = async (arr, from, to) => {
    const filteredData = arr.filter((item) => {
      const date = new Date(item[config["times.star"][0].value]);
      const cond1 = from === undefined ? true : date - from >= 0;
      const cond2 = to === undefined ? true : to - date > 0;
      return date !== 0 && date !== undefined && cond1 && cond2;
    });
    return filteredData;
  };

  console.log("Updated: Data");
  //render
  return (
    <DataContext.Provider
      value={{
        dataAll: data.dataAll,
        data: data.dataFiltered,
        dateFrom: data.from,
        dateTo: data.to,
        counter: data.dataFiltered.length + counter,
        incCounter: incCounter,
        lastDate: getLastDate(),
        setFetchedData: setFetchedData,
        setFromTo: setFromTo,
        switchMicroscope: switchMicroscope,
        microscope: microscope,
        getLastKey: getLastKey,
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
}
