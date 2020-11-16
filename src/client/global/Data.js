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
  const [microscope, setMicroscope] = React.useState(0);
  const [data, setData] = React.useState({
    dataAll: [],
    from: new Date(Date.now() - 3 * 60 * 60 * 1000), //last 3h
    to: undefined,
  });

  //reset microscope
  const switchMicroscope = (val) => {
    setMicroscope(val);
    setData({
      dataAll: [],
      from: data.from,
      to: data.to,
    });
  };

  //get last date
  const getLastDate = () => {
    const arr = data.dataAll;
    return arr.length === 0
      ? undefined
      : arr[arr.length - 1][config["times.star"][0].value];
  };

  //get last key
  const getLastKey = () => {
    const arr = data.dataAll;
    return arr.length === 0 ? 0 : arr[arr.length - 1][config.key];
  };

  //set filter: from - to
  const setFromTo = (from, to) => {
    setData({
      dataAll: [],
      from: from,
      to: to,
    });
  };

  //render
  return (
    <DataContext.Provider
      value={{
        data: data.dataAll,
        dateFrom: data.from,
        dateTo: data.to,
        lastDate: getLastDate(),
        setFromTo: setFromTo,
        switchMicroscope: switchMicroscope,
        microscope: microscope,
        getLastKey: getLastKey,
        setData: setData,
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
}
