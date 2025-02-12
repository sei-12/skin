import { Box, Button, Grid2 } from "@mui/material";
import { useState } from "react";
import ListIcon from "@mui/icons-material/List";
import MenuIcon from "@mui/icons-material/Menu";
import { ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import type { TagInputBoxProps } from "../components/TagInputBox";
import { TagInputBox } from "../components/TagInputBox";
import type { BookmarkListProps } from "../components/BookmarkList";
import { BookmarkList } from "../components/BookmarkList";
import type { ColorTheme } from "../../src-tauri/bindings/export/ColorTheme";


export type SearchBookmarkProps = {
    tagInputBoxProps: TagInputBoxProps;
    bkmkListProps: BookmarkListProps;
    colorTheme: ColorTheme;
    onClickAdd: () => void;
    onClickGoTagList: () => void;
};

export function SearchBookmark(p: SearchBookmarkProps) {
    return (
        <Grid2
            data-testid="search-bookmark"
            container
            spacing={1}
            flexDirection={"column"}
            height={1}
            width={1}
        >
            <Grid2 size="auto">
                <Grid2 container spacing={2}>
                    <Grid2 size="grow">
                        <TagInputBox {...p.tagInputBoxProps}></TagInputBox>
                    </Grid2>
                    <SearchBookmarkMenuButton
                        colorTheme={p.colorTheme}
                        onClickAdd={p.onClickAdd}
                        onClickGoTagList={p.onClickGoTagList}
                    ></SearchBookmarkMenuButton>
                </Grid2>
            </Grid2>

            <Grid2 size="grow" sx={{ overflow: "hidden", display: "flex" }}>
                <BookmarkList {...p.bkmkListProps}></BookmarkList>
            </Grid2>
        </Grid2>
    );
}

type SearchBookmarkMenuButtonProps = {
    colorTheme: ColorTheme;
    onClickAdd: () => void;
    onClickGoTagList: () => void;
};

function SearchBookmarkMenuButton(p: SearchBookmarkMenuButtonProps) {
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
            <Button
                variant="contained"
                id="basic-button"
                data-testid="search-bookmark-menu-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                sx={{
                    marginBlock: "3px",
                    minWidth: "45px",
                    minHeight: "45px",
                    padding: 0,
                    bgcolor: p.colorTheme.addButton.bgColor,

                    borderStyle: "solid",
                    borderWidth: 2,
                    borderColor: p.colorTheme.addButton.borderColor,
                    color: p.colorTheme.addButton.color,

                    borderRadius: 2,
                }}
            >
                <MenuIcon></MenuIcon>
            </Button>

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
                <MenuItem onClick={p.onClickAdd}>
                    <ListItemIcon>
                        <AddIcon
                            sx={{
                                color: "#394b70",
                            }}
                            fontSize="small"
                        />
                    </ListItemIcon>
                    <ListItemText>Create new Bookmark</ListItemText>
                </MenuItem>

                <MenuItem onClick={p.onClickGoTagList}>
                    <ListItemIcon>
                        <ListIcon
                            sx={{
                                color: "#394b70",
                            }}
                            fontSize="small"
                        ></ListIcon>
                    </ListItemIcon>
                    <ListItemText>Tag list</ListItemText>
                </MenuItem>
            </Menu>
        </Box>
    );
}
