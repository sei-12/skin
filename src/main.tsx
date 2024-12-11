import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { tokyonight } from "./theme";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
  
    <ThemeProvider theme={tokyonight}>
      <CssBaseline></CssBaseline>
      <App />
    </ThemeProvider>


  </React.StrictMode>,
);
