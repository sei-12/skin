import { CssBaseline, ThemeProvider } from "@mui/material";
import { HotkeysProvider } from "react-hotkeys-hook";
import { HOTKEY_SCOPES } from "./hooks/hotkey";
import { CustomWindow } from "./components/CustomWindow";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
    CreateNewBookmarkPage,
    EditBookmarkPage,
    SearchBookmarkPage,
    TagListPage,
} from "./pages/pages";
import { ConfigProvider } from "./providers/configProvider";
import { muiTheme } from "./vanilla/theme";
import { GlobalHotkeySetter } from "./providers/globalHotkeySetter";
import { NoticeProvider } from "./providers/NoticeProvider";

export function App() {
    return (
        <HotkeysProvider
            initiallyActiveScopes={[HOTKEY_SCOPES.SEARCH_BOOKMARK]}
        >
            <ThemeProvider theme={muiTheme}>
                <ConfigProvider>
                    <GlobalHotkeySetter></GlobalHotkeySetter>
                    <CssBaseline></CssBaseline>
                    <CustomWindow>
                        <NoticeProvider>
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
                                    <Route
                                        path="/edit-bookmark"
                                        element={
                                            <EditBookmarkPage></EditBookmarkPage>
                                        }
                                    ></Route>
                                    <Route
                                        path="/tag-list"
                                        element={<TagListPage></TagListPage>}
                                    ></Route>
                                </Routes>
                            </BrowserRouter>
                        </NoticeProvider>
                    </CustomWindow>
                </ConfigProvider>
            </ThemeProvider>
        </HotkeysProvider>
    );
}
