import { Alert, Snackbar, SnackbarCloseReason } from "@mui/material";
import React, { createContext, useCallback, useContext, useState } from "react";

export type Severity = "info" | "warning" | "error" | "success";

export interface Notice {
    serverity: Severity;
    message: string;

    /**
     * default: 6000
     */
    timeout_ms?: number;
}

type NoticeContext = {
    addNotice: (notice: Notice) => void;
};

const noticeContext = createContext<NoticeContext>({
    addNotice: () => {},
});

export function useNotice() {
    const n = useContext(noticeContext);
    return n;
}

export function NoticeProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState<Severity>("success");
    const [autoHideDuration, setAutoHideDuration] = useState(6000);

    const handleClose = (
        _?: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason
    ) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

    const addNotice = useCallback((notice: Notice) => {
        setMessage(notice.message);
        setOpen(true);
        setSeverity(notice.serverity);
        setAutoHideDuration(notice.timeout_ms ?? 6000);
    }, []);

    const [notice] = useState<NoticeContext>({
        addNotice,
    });

    return (
        <noticeContext.Provider value={notice}>
            <Snackbar
                open={open}
                autoHideDuration={autoHideDuration}
                onClose={handleClose}
            >
                <Alert
                    onClose={handleClose}
                    severity={severity}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {message}
                </Alert>
            </Snackbar>
            {children}
        </noticeContext.Provider>
    );
}
