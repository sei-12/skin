import React from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { HotkeysProvider } from "react-hotkeys-hook";
import { HOTKEY_SCOPES } from "./lib/hotkey";
import { CustomWindow } from "./components/CustomWindow";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CreateNewBookmarkPage, SearchBookmarkPage } from "./pages/pages";
import { ConfigProvider } from "./providers/configProvider";
import { muiTheme } from "./lib/theme";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <HotkeysProvider
            initiallyActiveScopes={[HOTKEY_SCOPES.SEARCH_BOOKMARK]}
        >
            <ThemeProvider theme={muiTheme}>
                <ConfigProvider>
                    <CssBaseline></CssBaseline>
                    <CustomWindow>
                        <BrowserRouter>
                            <Routes>
                                <Route
                                    path="/"
                                    element={
                                        <SearchBookmarkPage></SearchBookmarkPage>
                                    }
                                ></Route>
                                <Route
                                    path="/create-new-bookmark"
                                    element={
                                        <CreateNewBookmarkPage></CreateNewBookmarkPage>
                                    }
                                ></Route>
                            </Routes>
                        </BrowserRouter>
                    </CustomWindow>
                </ConfigProvider>
            </ThemeProvider>
        </HotkeysProvider>
    </React.StrictMode>
);
