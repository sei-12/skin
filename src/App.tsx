import { Box } from "@mui/material";
import { globalColorTheme } from "./lib/theme";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SearchBookmarkPage } from "./SearchBookmarkPage";
import { CreateNewBookmarkPage } from "./CreateNewBookmarkPage";

function App2() {
    return (
        <Box
            sx={{
                margin: "15px",
                bgcolor: globalColorTheme.bg,
                width: "calc(100vw - 30px)",
                height: "calc(100vh - 30px)",
                boxShadow: "0px 0px 20px 0px rgba(0,0,0,0.3)",
                borderRadius: "15px",
                border: "none",
                overflow: "hidden",
                padding: 2,
                paddingTop: 2,
            }}
        >
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={<SearchBookmarkPage></SearchBookmarkPage>}
                    ></Route>
                    <Route
                        path="/c"
                        element={
                            <CreateNewBookmarkPage></CreateNewBookmarkPage>
                        }
                    ></Route>
                </Routes>
            </BrowserRouter>
        </Box>
    );
}

export default App2;