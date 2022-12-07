import { Controller } from "@hotwired/stimulus";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "../components/App";

// Connects to data-controller="react"
export default class extends Controller {
  // Example of passing data in stimulus
  initialize() {
    this.title = this.element.dataset.title;
  }

  connect() {
    console.log(
      "Welcome to ColinJSantee.com! This site is made with React and Ruby on Rails."
    );

    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(<App />);
  }
}
