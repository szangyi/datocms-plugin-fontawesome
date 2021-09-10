import React from "react";
import ReactDOM from "react-dom";
import "datocms-plugins-sdk/dist/sdk.css";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import DatoCmsPlugin from "datocms-plugins-sdk";

const renderUI = (plugin) => {
  ReactDOM.render(
    <React.StrictMode>
      <App plugin={plugin} />
    </React.StrictMode>,
    document.getElementById("root")
  );
};

if (process.env.NODE_ENV === "development") {
  renderUI();
} else if (process.env.NODE_ENV === "production") {
  DatoCmsPlugin.init(function (plugin) {
    // place your custom plugin code here
    plugin.startAutoResizer();
    renderUI(plugin);
  });
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
