import React from "react";
import ReactDOM from "react-dom/client";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { tokyonight } from "./lib/theme";
import { HotkeysProvider } from "react-hotkeys-hook";
import { HOTKEY_SCOPES } from "./lib/hotkey";
import { CustomWindow } from "./components/CustomWindow";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CreateNewBookmarkPage, SearchBookmarkPage } from "./pages/pages";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <HotkeysProvider
            initiallyActiveScopes={[HOTKEY_SCOPES.SEARCH_BOOKMARK]}
        >
            <ThemeProvider theme={tokyonight}>
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
            </ThemeProvider>
        </HotkeysProvider>
    </React.StrictMode>
);
