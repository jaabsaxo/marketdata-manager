import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoggedIn from "./components/LoggedIn";
import NotLoggedIn from "./components/NotLoggedIn";

ReactDOM.render(
  <Router>
    <Routes>
    <Route path="/" element={<NotLoggedIn />} />
      <Route path="/authorized" element={<LoggedIn />} />
    </Routes>
  </Router>,

  document.getElementById("root")
);

