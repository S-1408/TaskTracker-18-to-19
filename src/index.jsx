import React, { StrictMode } from "react";
import * as ReactDOM from 'react-dom'
import App from "./App";
import "./styles.css";

const root = document.getElementById("root");
ReactDOM.render(
    <StrictMode><App /></StrictMode>
  , root)
