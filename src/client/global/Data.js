import React from "react";
import socketIOClient from "socket.io-client";
import config from "./../../config.json";
import moment from "moment";
import "moment/locale/en-gb";

const socket = socketIOClient(
  "ws://" + config.app.api_host + ":" + config.app.api_port
);

const imageAPI = "http://localhost:5000/imagesAPI?key=";

var dataAll = []
var fetchID = 0

const getDataAPI = (key,id) => {
  return "http://localhost:5000/data?lastKey="+key+"&id="+id
}

//24hours instead of AM/PM + format
moment.locale("en", {
  longDateFormat: {
    LT: "h:mm:ss", //add :ss
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
  const [dataFiltered, setDataFiltered] = React.useState([]);
  const [dataLastImages, setLastImages] = React.useState([]);
  const [counter, setCounter] = React.useState(0);
  const [datesLast4, setDatesLast4] = React.useState([]);
  const [dateFrom, setDateFrom] = React.useState(undefined);
  const [dateTo, setDateTo] = React.useState(undefined);

  const filterData = (data) => {
    const filteredData = data.filter((item) => {
      const date = new Date(item[config["times.star"].main]);
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
  };

  //API: store data
  React.useEffect(() => {
    const key =
      dataAll.length === 0 ? "ALL" : dataAll[dataAll.length - 1][config.key];

    const interval = setInterval(() => {
      fetch(getDataAPI(key,fetchID))
        .then((response) => response.json())
        .then((res) => {
          if (res.data === "RESTART") {
            window.location.reload(false);
          } else if (res.data !== null && res.id==fetchID) {
            console.log(res);
            fetchID++;
            dataAll = dataAll.concat(res.data);
            setDataFiltered(filterData(dataAll));
          }
        });
    }, config.app.refreshDataMs);

    return () => clearInterval(interval);
  }, [filterData]);

  //set last 4 dates
  const setDates = (val) => {
    var dates = [];
    for (var i = 0; i < 4; i++) {
      if (val.length - i > 0) {
        const date = val[val.length - i - 1][config["times.star"].main];
        dates.push(moment(date).calendar());
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
