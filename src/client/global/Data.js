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
  const [imagesAll, setImagesAll] = React.useState([]);
  const [imagesFiltered, setImagesFiltered] = React.useState([]);
  const [counter, setCounter] = React.useState(0);
  const [dateFrom, setDateFrom] = React.useState(undefined);
  const [dateTo, setDateTo] = React.useState(undefined);
  const [microscope, setMicroscope] = React.useState(0);

  //reset microscope
  const switchMicroscope = (val) => {
    setDataAll([]);
    setDataFiltered([]);
    setImagesAll([]);
    setImagesFiltered([]);
    setCounter(0);
    setDateFrom(undefined);
    setDateTo(undefined);
    setMicroscope(val);
  };

  //fetch images
  const fetchImages = React.useCallback(
    (key, cb) => {
      const imageURL =
        "http://" +
        config.app.api_host +
        ":" +
        config.app.api_port +
        "/images?key=" +
        key +
        "&microscope=" +
        microscope;

      fetch(imageURL)
        .then((response) => response.json())
        .then((res) => cb(res));
    },
    [microscope]
  );

  //set fetched data
  const setFetchedData = (data, images) => {
    setImagesAll(images);
    setDataAll([...dataAll, ...data]);
  };

  //last date
  const lastDate =
    dataFiltered.length === 0
      ? 0
      : dataFiltered[dataFiltered.length - 1][config["times.star"].main];

  //get last key
  const getLastKey = (arr) => {
    return arr.length === 0 ? undefined : arr[arr.length - 1][config.key];
  };

  //filter
  React.useEffect(() => {
    //filter data
    const filteredData = dataAll.filter((item) => {
      const date = new Date(item[config["times.star"].main]);
      const cond1 = dateFrom === undefined ? true : date - dateFrom > 0;
      const cond2 = dateTo === undefined ? true : dateTo - date > 0;
      return date !== 0 && date !== undefined && cond1 && cond2;
    });
    setDataFiltered(filteredData);

    //filter images
    const imageKey = imagesAll.length === 0 ? undefined : imagesAll[0].key;
    const lastDataKey = getLastKey(filteredData);
    if (filteredData.length === 0) {
      setImagesFiltered([]);
    } else if (lastDataKey !== imageKey) {
      fetchImages(lastDataKey, setImagesFiltered);
    } else {
      setImagesFiltered(imagesAll);
    }
  }, [dateFrom, dateTo, dataAll, imagesAll, fetchImages]);

  //increase Counter +1
  const incCounter = () => {
    setCounter(counter + 1);
  };

  //render
  return (
    <DataContext.Provider
      value={{
        data: dataFiltered,
        images: imagesFiltered,
        counter: dataFiltered.length + counter,
        incCounter: incCounter,
        lastDate: lastDate,
        setFetchedData: setFetchedData,
        fetchImages: fetchImages,
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
