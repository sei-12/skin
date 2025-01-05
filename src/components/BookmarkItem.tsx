import { forwardRef } from "react";
import type { IData } from "../dts/data";
import {
    Box,
    Button,
    Card,
    CardContent,
    Stack,
    Typography,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import type { ColorTheme } from "../../src-tauri/bindings/export/ColorTheme";

export type BookmarkItemProps = {
    data: IData.Bookmark;

    onClickRemove: (key: number) => void;
    onClickEdit: (key: number) => void;
    focus: boolean;
    colorTheme: ColorTheme
};

export const BookmarkItem = forwardRef<HTMLDivElement, BookmarkItemProps>(
    (p, ref) => {
        return (
            <div ref={ref} data-testid="bkmkitem">
                <Card
                    variant="elevation"
                    sx={{
                        bgcolor: p.focus
                            ? p.colorTheme.bookmarkItem.focusBg
                            : p.colorTheme.bookmarkItem.bg,
                        borderRadius: 2.5,
                        boxShadow: "1px 1px 5px 0 rgba(0,0,0,0.1)",
                        height: 135, // このやり方は良くないかもだけど、一旦問題はないし、他の方法が見当たらなかった
                    }}
                >
                    <CardContent sx={{ position: "relative" }}>
                        <Typography
                            variant="h5"
                            sx={{
                                color: p.colorTheme.bookmarkItem.title,
                                fontWeight: "bold",

                                overflow: "hidden",
                                display: "-webkit-box",
                                wordBreak: "break-all",
                                lineClamp: 1,
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: "vertical",
                            }}
                        >
                            {p.data.title}
                        </Typography>
                        <Stack
                            spacing={0.7}
                            direction={"row"}
                            sx={{ overflow: "hidden" }}
                        >
                            {p.data.tags.map((t, i) => (
                                <TagItem key={i} text={t} colorTheme={p.colorTheme}></TagItem>
                            ))}
                        </Stack>
                        <Typography
                            sx={{
                                color: p.colorTheme.bookmarkItem.desc,
                                fontWeight: 100,

                                overflow: "hidden",
                                display: "-webkit-box",
                                wordBreak: "break-all",
                                lineClamp: 2,
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                            }}
                        >
                            {p.data.desc}
                        </Typography>

                        <Box
                            sx={{
                                position: "absolute",
                                opacity: 0,
                                ":hover": {
                                    opacity: 1,
                                },
                                transition: "opacity 0.5s",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                            }}
                        >
                            <Stack
                                direction={"row"}
                                spacing={1}
                                sx={{
                                    position: "absolute",
                                    bottom: 10,
                                    right: 10,
                                }}
                            >
                                <Button
                                    variant="contained"
                                    onClick={() =>
                                        p.onClickRemove(p.data.id)
                                    }
                                >
                                    <DeleteIcon></DeleteIcon>
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() =>
                                        p.onClickEdit(p.data.id)
                                    }
                                >
                                    <EditIcon></EditIcon>
                                </Button>
                            </Stack>
                        </Box>
                    </CardContent>
                </Card>
            </div>
        );
    }
);

function TagItem(p: { text: string , colorTheme: ColorTheme}) {
    return (
        <Typography
            sx={{
                color: p.colorTheme.bookmarkItem.tag,
                textWrap: "nowrap",
            }}
        >
            #{p.text}
        </Typography>
    );
}
