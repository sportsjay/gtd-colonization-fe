import React, { useState } from "react";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

export function Loading(props) {
  return (
    <Backdrop open={props.open}>
      <CircularProgress color="inherit"></CircularProgress>
    </Backdrop>
  );
}
