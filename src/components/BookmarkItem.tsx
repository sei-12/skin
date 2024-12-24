import { forwardRef } from "react";
import { IData } from "../dts/data";
import {
    Box,
    Button,
    Card,
    CardContent,
    Stack,
    Typography,
} from "@mui/material";
import { globalColorTheme as GCT } from "../lib/theme";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export type BookmarkItemProps = {
    data: IData.Bookmark;

    onClickRemove: (key: number) => void;
    onClickEdit: (key: number) => void;
    focus: boolean;
};

export const BookmarkItem = forwardRef<HTMLDivElement, BookmarkItemProps>(
    (props, ref) => {
        return (
            <div ref={ref}>
                <Card
                    variant="elevation"
                    sx={{
                        bgcolor: props.focus
                            ? GCT.bookmarkItem.focusBg
                            : GCT.bookmarkItem.bg,
                        borderRadius: 2.5,
                    }}
                >
                    <CardContent sx={{ position: "relative" }}>
                        <Typography
                            variant="h5"
                            sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                WebkitLineClamp: 1,
                                color: GCT.bookmarkItem.title,
                                fontWeight: "bold",
                            }}
                        >
                            {props.data.title}
                        </Typography>
                        <Stack
                            spacing={0.7}
                            direction={"row"}
                            sx={{ overflow: "hidden" }}
                        >
                            {props.data.tags.map((t, i) => (
                                <TagItem key={i} text={t}></TagItem>
                            ))}
                        </Stack>
                        <Typography
                            sx={{
                                color: GCT.bookmarkItem.desc,
                                fontWeight: 100,
                                overflow: "hidden",
                                display: "-webkit-box",
                                wordBreak: "break-all",
                                lineClamp: 3,
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                            }}
                        >
                            {props.data.desc}
                        </Typography>

                        <Box
                            sx={{
                                position: "absolute",
                                // opacity: props.focus ? 1 : 0,
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
                                        props.onClickRemove(props.data.id)
                                    }
                                >
                                    <DeleteIcon></DeleteIcon>
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() =>
                                        props.onClickEdit(props.data.id)
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

function TagItem(props: { text: string }) {
    return (
        <Typography
            sx={{
                color: GCT.bookmarkItem.tag,
            }}
        >
            #{props.text}
        </Typography>
    );
}
