import React from "react";
import config from "./../../config.json";
import { DataContext } from "./Data";

export const APIContext = React.createContext({});

export default function API(props) {
  const dataContext = React.useContext(DataContext);
  var fetchID = React.useRef(0); //avoiding multiple equal packages
  var intervalTime = React.useRef(500);

  //lower waiting period at start
  intervalTime.current =
    dataContext.dataAll.length === 0 ? 500 : config.app.refreshDataMs;

  //API: pull data + polling
  React.useEffect(() => {
    const key =
      dataContext.dataAll.length === 0
        ? "ALL"
        : dataContext.dataAll[dataContext.dataAll.length - 1][config.key];

    const dataURL =
      "http://" +
      config.app.api_host +
      ":" +
      config.app.api_port +
      "/data?lastKey=" +
      key +
      "&id=" +
      fetchID.current +
      "&microscope=" +
      dataContext.microscope;

    const fetchData = () => {
      fetch(dataURL)
        .then((response) => response.json())
        .then((res) => {
          if (res.data !== null && parseFloat(res.id) === fetchID.current) {
            console.log(res);
            fetchID.current++;
            dataContext.setFetchedData(res.data, res.images);
          }
        });
    };

    const interval = setInterval(() => {
      fetchData();
    }, intervalTime.current);
    return () => clearInterval(interval);
  }, [dataContext]);

  console.log("Updated: API");
  return <APIContext.Provider>{props.children}</APIContext.Provider>;
}
