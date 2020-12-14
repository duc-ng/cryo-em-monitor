import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function DetectWebGL() {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  const webgl_support = () => {
    try {
      let canvas = document.createElement("canvas");
      return (
        !!window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
      );
    } catch (e) {
      return false;
    }
  };

  return webgl_support() ? (
    <div />
  ) : (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{"WebGl is not supported"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your web browser is out of date. Please update to the latest version
            for the best viewing experience.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
