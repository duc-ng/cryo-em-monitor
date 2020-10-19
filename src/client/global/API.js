import React from "react";
import config from "./../../config.json";
import { DataContext } from "./Data";

export const APIContext = React.createContext({});

export default function API(props) {
  const dataContext = React.useContext(DataContext);
  var fetchID = React.useRef(0); //avoiding multiple equal packages
  var intervalTime = React.useRef(300);

  //set intervalTime (lower waiting period at start)
  intervalTime.current =
    dataContext.dataAll.length === 0 ? 300 : config.app.refreshDataMs;

  React.useEffect(() => {
    //get data url
    const getDataAPI = () => {
      const data = dataContext.dataAll;
      const key = data.length === 0 ? "ALL" : data[data.length - 1][config.key];
      return (
        "http://" +
        config.app.api_host +
        ":" +
        config.app.api_port +
        "/data?lastKey=" +
        key +
        "&id=" +
        fetchID.current +
        "&microscope=" +
        dataContext.microscope
      );
    };

    //API: pull data
    const fetchData = () => {
      fetch(getDataAPI())
        .then((response) => response.json())
        .then((res) => {
          if (res.data !== null && parseFloat(res.id) === fetchID.current) {
            console.log(res);
            fetchID.current++;
            dataContext.setFetchedData(res.data, res.images);
          }
        });
    };

    //polling
    const interval = setInterval(() => {
      fetchData();
    }, intervalTime.current);
    return () => clearInterval(interval);
  }, [dataContext]);

  console.log("API updated");
  return <APIContext.Provider value={{}}>{props.children}</APIContext.Provider>;
}
