import React from "react";
import socketIOClient from "socket.io-client";
import config from "./../../config.json";
import moment from "moment";

const socket = socketIOClient(
  "ws://" + config.app.api_host + ":" + config.app.api_port
);

const imageAPI = "http://localhost:5000/imagesAPI?key=";

export const DataContext = React.createContext({});

export default function Data(props) {
  const [dataAll, setDataAll] = React.useState([]);
  const [dataFiltered, setDataFiltered] = React.useState([]);
  const [dataLastImages, setLastImages] = React.useState([]);
  const [counter, setCounter] = React.useState(0);
  const [datesLast4, setDatesLast4] = React.useState([]);
  const dateName = config["times.star"].main;
  const [dateFrom, setDateFrom] = React.useState(undefined);
  const [dateTo, setDateTo] = React.useState(undefined);

  //API: store data
  React.useEffect(() => {
    socket.on("initLastDate", () => {
      const lastDate =
        Date.now() - config.app.rootDirDaysOld * 24 * 60 * 60 * 1000;
      socket.emit("lastDate", lastDate);
    });

    socket.on("data", (item) => {
      if (item !== undefined && item.length > 0) {
        const lastItem = item[item.length - 1];
        socket.emit("lastDate", lastItem[dateName]);
        setDataAll(dataAll.concat(item));
        console.log("Items received: " + item.length);
      }
    });

    setDataFiltered(() => {
      const filteredData = dataAll.filter((item) => {
        const date = new Date(item[dateName]);
        const cond1 = dateFrom === undefined ? true : date - dateFrom > 0;
        const cond2 = dateTo === undefined ? true : dateTo - date > 0;
        return date !== 0 && date !== undefined && cond1 && cond2;
      });

      if (filteredData.length === 0) {
        setLastImages([]);
        setDatesLast4([]);
      } else {
        fetchImages(
          filteredData[filteredData.length - 1][config.key],
          setLastImages
        );
        setDates(filteredData);
      }
      return filteredData;
    });
  }, [dateFrom, dateTo, dataAll, dateName]);

  //set last 4 dates
  const setDates = (val) => {
    var dates = [];
    for (var i = 0; i < 4; i++) {
      if (val.length - i > 0) {
        const date = val[val.length - i - 1][config["times.star"].main];
        dates.push(moment(date).fromNow());
      }
    }
    setDatesLast4(dates);
  };

  //API: fetch images by key
  const fetchImages = (key, cb) => {
    fetch(imageAPI + key)
      .then((response) => response.json())
      .then((res) => cb(res));
  };

  //increase Counter +1
  const incCounter = () => {
    setCounter(counter + 1);
  };

  //get date of last item
  const getLastDate = () => {
    return dataFiltered.length === 0
      ? 0
      : dataFiltered[dataFiltered.length - 1][dateName];
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
        setDateFrom: setDateFrom,
        dateFrom: dateFrom,
        setDateTo: setDateTo,
        dateTo: dateTo,
        datesLast4: datesLast4,
        fetchImages: fetchImages,
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
}
