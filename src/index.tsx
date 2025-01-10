import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

const UserContext = createContext(undefined);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserContext.Provider value={undefined}>
      <App />
    </UserContext.Provider>
  </React.StrictMode>
);
