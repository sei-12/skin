import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { tokyonight } from "./lib/theme";
import { HotkeysProvider } from "react-hotkeys-hook";
import { HOTKEY_SCOPES } from "./lib/hotkey";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
  
    <HotkeysProvider initiallyActiveScopes={[HOTKEY_SCOPES.SEARCH_BOOKMARK]}>
      <ThemeProvider theme={tokyonight}>
        <CssBaseline></CssBaseline>
        <App />
      </ThemeProvider>
    </HotkeysProvider>


  </React.StrictMode>,
);
