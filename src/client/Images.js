import React, { Fragment } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const MyComponent = () => (
  <Fragment>
    <Zoom>
      <img alt="that wanaka tree" src="./example.png" width="200" />
    </Zoom>
  </Fragment>
);

export default MyComponent;
