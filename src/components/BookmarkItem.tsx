import { forwardRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
    Box,
    Card,
    CardContent,
    Grid2,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Stack,
    Typography,
} from "@mui/material";

import type { ColorTheme } from "../../src-tauri/bindings/export/ColorTheme";
import type { Bookmark } from "../../src-tauri/bindings/export/DbModels";

export type BookmarkItemProps = {
    data: Bookmark;

    onClickRemove: (key: number) => void;
    onClickEdit: (key: number) => void;
    focus: boolean;
    colorTheme: ColorTheme;
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
                        <Grid2 container>
                            <Grid2 size="grow">
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
                            </Grid2>
                            <Grid2 size="auto">
                                <BookmarkItemMenu
                                    colorTheme={p.colorTheme}
                                    onClickRemove={() =>
                                        p.onClickRemove(p.data.id)
                                    }
                                    onClickEdit={() => p.onClickEdit(p.data.id)}
                                ></BookmarkItemMenu>
                            </Grid2>
                        </Grid2>

                        <Stack
                            spacing={0.7}
                            direction={"row"}
                            sx={{ overflow: "hidden" }}
                        >
                            {p.data.tags.map((t, i) => (
                                <TagItem
                                    key={i}
                                    text={t}
                                    colorTheme={p.colorTheme}
                                ></TagItem>
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
                    </CardContent>
                </Card>
            </div>
        );
    }
);

function TagItem(p: { text: string; colorTheme: ColorTheme }) {
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


// TODO: ColorTheme
type BookmarkItemMenuProps = {
    colorTheme: ColorTheme;
    onClickRemove: () => void;
    onClickEdit: () => void;
};
function BookmarkItemMenu(p: BookmarkItemMenuProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box
            sx={{
                position: "relative",
            }}
        >
            <Box
                id="basic-button"
                data-testid="open-bookmark-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
            >
                <MoreVertIcon
                    sx={{
                        color: "#394b70",
                        ":hover": {
                            color: "white",
                        },
                        ":active": {
                            color: "#394b70",
                        },
                    }}
                ></MoreVertIcon>
            </Box>

            <Menu
                id="basic-menu"
                data-testid="bookmarkitem-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    "aria-labelledby": "basic-button",
                }}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                slotProps={{
                    paper: {
                        style: {
                            backgroundColor: "#1f2335",
                            border: "solid 2px",
                            borderColor: "#3b4261",
                            color: "#c0caf5",
                        },
                    },
                }}
            >
                <MenuItem onClick={p.onClickRemove}>
                    <ListItemIcon>
                        <DeleteIcon
                            sx={{
                                color: "#394b70",
                            }}
                            fontSize="small"
                        />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
                <MenuItem onClick={p.onClickEdit}>
                    <ListItemIcon>
                        <EditIcon
                            sx={{
                                color: "#394b70",
                            }}
                            fontSize="small"
                        ></EditIcon>
                    </ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                </MenuItem>
            </Menu>
        </Box>
    );
}
