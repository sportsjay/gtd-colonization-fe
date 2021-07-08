import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import axios from "axios";
import { config } from "./utils/config";

axios.defaults.baseURL = config.MIDDLEWARE_URL;

ReactDOM.render(<App />, document.getElementById("root"));
