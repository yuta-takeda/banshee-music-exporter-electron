import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import "./core/ICore";
import "semantic-ui-css/semantic.min.css";

const container = document.getElementById("contents");

ReactDOM.render(<App />, container);
