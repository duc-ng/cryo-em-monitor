import React from "react";
import socketIOClient from "socket.io-client";
import config from "../../config.json";

const socket = socketIOClient(
  "ws://" + config.app.api_host + ":" + config.app.api_port
);

export const DataContext = React.createContext({});

export default function Data(props) {
  const [data, setData] = React.useState([]);
  const [counter, setCounter] = React.useState(0);
  const dateName = config["times.star"].main;

  //API: store data
  React.useEffect(() => {
    socket.on("initLastDate", () => {
      const lastDate =
        Date.now() - config.app.rootDirDaysOld * 24 * 60 * 60 * 1000;
      socket.emit("lastDate", lastDate);
    });

    socket.on("data", (item) => {
      const lastDate = item[item.length - 1][dateName];
      socket.emit("lastDate", lastDate);
      setData((items) => [...items, ...item]);
      setCounter(counter + 1);
      console.log("Items received: " + item.length);
    });
  }, []);

  //get date of last item
  const getLastDate = () => {
    return data.length === 0 ? 0 : data[data.length - 1][dateName];
  };

  //render
  return (
    <DataContext.Provider
      value={{
        data: data,
        lastItemDate: getLastDate(),
        counter: counter,
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
}
