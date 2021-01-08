import React from "react";
import config from "./../../config.json";
import { DataContext } from "./../global/Data";

function API(props) {
  var fetchID = React.useRef(0); //avoid equal packages
  const {
    data,
    dateFrom,
    dateTo,
    microscope,
    setData,
    getLastKey,
    filter,
  } = React.useContext(DataContext);

  const getDateString = (date) => {
    return date === undefined ? undefined : date.toJSON();
  };

  const fetchData = (replace) => {
    props.setIsLoading(true);

    const fetchURL =
      "http://" +
      process.env.REACT_APP_HOST +
      ":" +
      process.env.REACT_APP_PORT +
      "/data?from=" +
      getDateString(dateFrom) +
      "&to=" +
      getDateString(dateTo) +
      "&lastKey=" +
      getLastKey() +
      "&id=" +
      fetchID.current +
      "&microscope=" +
      microscope;

    fetch(fetchURL)
      .then((response) => response.json())
      .then((res) => {
        if (parseFloat(res.id) === fetchID.current) {
          if (replace) {
            if (res.data !== null && res.data.length !== 0) {
              fetchID.current++;
              setData(
                {
                  dataAll: res.data,
                  from: dateFrom,
                  to: dateTo,
                },
                props.setIsLoading(false)
              );
            } else {
              props.setIsLoading(false);
            }
          } else {
            fetchID.current++;
            let dateFromNew = new Date(Date.now() - filter * 60 * 60 * 1000);
            let newData = data.filter(
              (x) => new Date(x[config["times.star"][0].value]) > dateFromNew
            );
            setData(
              {
                dataAll:
                  res.data === null ? newData : [...newData, ...res.data],
                from: dateFromNew,
                to: dateTo,
              },
              props.setIsLoading(false)
            );
          }
        } else {
          props.setIsLoading(false);
        }
      })
      .catch(() => {
        return;
      });
  };

  //API: polling
  React.useEffect(() => {
    if (dateTo === undefined) {
      if (data.length === 0) {
        fetchData(true);
        var interval = setInterval(() => {
          fetchData(false);
        }, config.app.pollClientMs);
      } else {
        interval = setInterval(() => {
          fetchData(false);
        }, config.app.pollClientMs);
      }
    } else {
      fetchData(true);
    }
    return () => clearInterval(interval);
  });

  return <div />;
}

export default React.memo(API);
