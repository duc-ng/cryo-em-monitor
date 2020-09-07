import React from "react";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import GetAppIcon from "@material-ui/icons/GetApp";
import XLSX from "xlsx";

export default function TableExport(props) {
  const downloadCSV = () => {
    const data = props.rows
      .filter((item) => props.selected.includes(item.key))
      .map((item) => item.data);
    const ws = XLSX.utils.json_to_sheet(data);
    const filename = "cryoEMdata.xlsx";
    const ws_name = "Cryo-EM Data";
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, ws_name);
    XLSX.writeFile(wb, filename);
  };

  return (
    <Tooltip title={"Download " + props.selected.length + " files"}>
      <IconButton onClick={downloadCSV}>
        <GetAppIcon />
      </IconButton>
    </Tooltip>
  );
}
