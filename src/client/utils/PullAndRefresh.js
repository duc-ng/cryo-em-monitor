import React from "react";
import PullToRefresh from "rmc-pull-to-refresh";
import CircularProgress from "@material-ui/core/CircularProgress";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";

export default function PullAndRefresh(props) {
  const arrowUp = <ArrowUpwardIcon />;
  const loading = <CircularProgress />;

  return (
    <PullToRefresh
      style={{
        width: "100%",
        marginTop: -30,
        textAlign: "center",
      }}
      direction="down"
      onRefresh={() => {
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }}
      indicator={{
        deactivate: arrowUp,
        activate: arrowUp,
        release: loading,
        finish: "",
      }}
      damping={100}
    >
      {props.children}
    </PullToRefresh>
  );
}
