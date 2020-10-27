import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";

export default class App extends Component {
  render() {
    return (
      <Router>
        <h1 className="app">App</h1>
      </Router>
    );
  }
}
