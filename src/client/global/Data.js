import React from "react";
import config from "./../../config.json";

export const DataContext = React.createContext({});

export default function Data(props) {
  const [microscope, setMicroscope] = React.useState(0);
  const [filter, setFilter] = React.useState(3);
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

  //refresh
  const refresh = () => {
    setData({
      dataAll: data.dataAll,
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
        refresh: refresh,
        setFilter: setFilter,
        filter: filter
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
}
