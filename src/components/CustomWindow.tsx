import { Box } from "@mui/material";
import type { FunctionComponent, ReactNode } from "react";
import { globalColorTheme } from "../lib/theme";

export type CustomWindowProps = {
    children: ReactNode;
};

export const CustomWindow: FunctionComponent<CustomWindowProps> = (p) => {
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
            {p.children}
        </Box>
    );
};