import React, { StrictMode } from "react";
// import * as ReactDOM from 'react-dom'
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

// const root = document.getElementById("root");
// ReactDOM.render(
//     <StrictMode><App /></StrictMode>
//   , root)

const root = createRoot(document.getElementById("root"));
root.render(<StrictMode><App/></StrictMode>)