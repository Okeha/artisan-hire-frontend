import React from "react";
import "./App.css";
import Navbar from "./components/Navbar.tsx";
import GridLayout from "./components/GridLayout.tsx";

function App() {
  return (
    <div className="App">
      <Navbar></Navbar>
      <div style={{ height: `2rem` }}></div>
      <div style={{ padding: "1rem" }}>
        <GridLayout></GridLayout>
      </div>
    </div>
  );
}

export default App;
