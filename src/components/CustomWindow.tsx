import { Box } from "@mui/material";
import type { FunctionComponent, ReactNode } from "react";
import { useConfig } from "../providers/configProvider";

export type CustomWindowProps = {
    children: ReactNode;
};

export const CustomWindow: FunctionComponent<CustomWindowProps> = (p) => {
    const { colorTheme } = useConfig();
    return (
        <Box
            data-testid="custom-window"
            sx={{
                margin: "15px",
                bgcolor: colorTheme.bg,
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
