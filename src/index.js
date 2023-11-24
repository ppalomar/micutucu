// src/index.js
import React from "react";
import ReactDOM from "react-dom";
import "./styles.css";
import Container from "./Container";
import { AppProvider } from "./context";

ReactDOM.render(
  <React.StrictMode>
    <AppProvider>
      <Container />
    </AppProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
