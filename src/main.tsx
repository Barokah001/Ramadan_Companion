// src/main.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { UsernameProvider } from "./contexts/UsernameContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <UsernameProvider>
      <FavoritesProvider>
        <App />
      </FavoritesProvider>
    </UsernameProvider>
  </React.StrictMode>,
);
