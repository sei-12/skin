import { Box, Button, Grid2, Stack, styled, TextField } from "@mui/material";
import type { TagRecord } from "../../src-tauri/bindings/export/DbModels";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import type { ColorTheme } from "../../src-tauri/bindings/export/ColorTheme";
import { useState } from "react";

export type TagListProps = {
    colorTheme: ColorTheme;
    tags: TagRecord[];
    onClickDelete: (id: number) => void;
    onClickEdit: (id: number, newName: string) => void;
    onClickGoRoot: () => void;
};

export function TagList(p: TagListProps) {
    return (
        <Stack
            spacing={1}
            sx={{
                width: 1,
                height: 1,
                boxSizing: "border-box",
                padding: 1,
                overflow: "scroll",
                "&::-webkit-scrollbar": {
                    display: "none",
                },
            }}
            data-testid="tag-list-page"
        >
            {p.tags.map((t) => {
                return (
                    <TagItem
                        colorTheme={p.colorTheme}
                        data={t}
                        key={t.id}
                        onClickDelete={p.onClickDelete}
                        onClickEdit={p.onClickEdit}
                    ></TagItem>
                );
            })}
        </Stack>
    );
}

type TagItemProps = {
    data: TagRecord;
    colorTheme: ColorTheme;
    onClickDelete: (id: number) => void;
    onClickEdit: (id: number, newName: string) => void;
};

function TagItem(p: TagItemProps) {
    const [inputedValue, setInputedValue] = useState(p.data.name);

    const IconButton = styled(Button)({
        minWidth: "45px",
        minHeight: "45px",
        padding: 0,
        bgcolor: p.colorTheme.addButton.bgColor,
        borderStyle: "solid",
        borderWidth: 2,
        borderColor: p.colorTheme.addButton.borderColor,
        color: p.colorTheme.addButton.borderColor,
        borderRadius: "10px",
        marginInline: 3,
    });

    return (
        <Box
            data-testid={`tag-item-${p.data.id}-${p.data.name}`}
            sx={{
                backgroundColor: p.colorTheme.predicateInputBox.bg,
                borderRadius: 3,
                flexGrow: 1,
                display: "flex",
            }}
        >
            <Grid2 container spacing={1} flexGrow={1}>
                <Grid2
                    size="grow"
                    sx={{
                        flexGrow: 1,
                    }}
                >
                    <TextField
                        defaultValue={p.data.name}
                        placeholder={p.data.name}
                        slotProps={{
                            input: {
                                style: {
                                    color: p.colorTheme.predicateInputBox
                                        .textColor,
                                    caretColor:
                                        p.colorTheme.predicateInputBox
                                            .caretColor,
                                },
                            },
                        }}
                        sx={{
                            "& fieldset": { border: "none" },
                            width: 1,
                        }}
                        onChange={(e) => setInputedValue(e.target.value)}
                    ></TextField>
                </Grid2>
                <Grid2
                    size="auto"
                    sx={{
                        marginBlock: "auto",
                        marginInline: 0.5,
                    }}
                >
                    <IconButton
                        onClick={() =>
                            p.onClickEdit(Number(p.data.id), inputedValue)
                        }
                    >
                        <EditIcon></EditIcon>
                    </IconButton>
                    <IconButton
                        onClick={() => p.onClickDelete(Number(p.data.id))}
                    >
                        <DeleteIcon></DeleteIcon>
                    </IconButton>
                </Grid2>
            </Grid2>
        </Box>
    );
}
