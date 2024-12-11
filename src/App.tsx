import { Box, Button, Grid2, Input } from "@mui/material";
import { useState } from "react";
import { IData } from "./data";
import { BookmarkList } from "./components/BookmarkList";

function App() {

    const [items, setItems] = useState<IData.Bookmark[]>([
        {
            title: "hello1",
            key: crypto.randomUUID(),
            tags: ["tag1", "tag2", "tag3"],
            desc: "this is description".repeat(100),
            url: "decoy://aaa.www.ccc"
        },
        {
            title: "hello1".repeat(100),
            key: crypto.randomUUID(),
            tags: ["tag1", "tag2", "tag3"],
            desc: "this is description",
            url: "decoy://aaa.www.ccc"
        },
        {
            title: "hello1",
            key: crypto.randomUUID(),
            tags: ["tag1", "tag2", "tag3"],
            desc: "this is description",
            url: "decoy://aaa.www.ccc"
        },
        {
            title: "hello1",
            key: crypto.randomUUID(),
            tags: ["tag1", "tag2", "tag3"],
            desc: "this is description",
            url: "decoy://aaa.www.ccc"
        },
        {
            title: "hello1",
            key: crypto.randomUUID(),
            tags: ["tag1", "tag2", "tag3"],
            desc: "this is description",
            url: "decoy://aaa.www.ccc"
        },
        {
            title: "hello1",
            key: crypto.randomUUID(),
            tags: ["tag1", "tag2", "tag3"],
            desc: "this is description",
            url: "decoy://aaa.www.ccc"
        },
        {
            title: "hello3",
            key: crypto.randomUUID(),
            tags: ["tag5", "tag4", "tag3"],
            desc: "this is description".repeat(19),
            url: "decoy://aaa.www.ccc"
        },
        {
            title: "hello1",
            key: crypto.randomUUID(),
            tags: ["tag1", "tag2", "tag3"],
            desc: "this is description",
            url: "decoy://aaa.www.ccc"
        },
        {
            title: "hello1aaaa",
            key: crypto.randomUUID(),
            tags: ["tag1", "tag2", "tag3"],
            desc: "this is description".repeat(3),
            url: "decoy://aaa.www.ccc"
        },
        {
            title: "hello4",
            key: crypto.randomUUID(),
            tags: ["tag1", "tag2", "tag3"],
            desc: "this is description",
            url: "decoy://aaa.www.ccc"
        },
        {
            title: "hello11",
            key: crypto.randomUUID(),
            tags: ["tag1", "tag2", "tag3"],
            desc: "this is description",
            url: "decoy://aaa.www.ccc"
        },
        {
            title: "hello1",
            key: crypto.randomUUID(),
            tags: ["tag1", "tag2", "tag3"],
            desc: "this is description".repeat(8),
            url: "decoy://aaa.www.ccc"
        },
        {
            title: "hello1",
            key: crypto.randomUUID(),
            tags: ["tag1", "tag2", "tag3"],
            desc: "this is description",
            url: "decoy://aaa.www.ccc"
        },
        {
            title: "hello7",
            key: crypto.randomUUID(),
            tags: ["tag1", "tag2", "tag3"],
            desc: "this is description",
            url: "decoy://aaa.www.ccc"
        },
        {
            title: "hello1",
            key: crypto.randomUUID(),
            tags: ["tag1", "tag2", "tag3"],
            desc: "this is description",
            url: "decoy://aaa.www.ccc"
        },
        {
            title: "hello3",
            key: crypto.randomUUID(),
            tags: ["tag1", "tag2", "tag3"],
            desc: "this is description",
            url: "decoy://aaa.www.ccc"
        },
        {
            title: "hello3",
            key: crypto.randomUUID(),
            tags: ["tag1", "tag2", "tag3"],
            desc: "this is description",
            url: "decoy://aaa.www.ccc"
        },
    ])

    const [focusIndex, setFocusIndex] = useState(0)

    return (
        <Box
            sx={{ 
                width: "100vw", 
                height: "100vh",
                top:0,
                left: 0,
                overflow: "hidden",
                padding: 3,
                flexGrow: 1,
            }}
        >
            <Grid2
                container
                spacing={1}
                flexDirection={"column"}
                height={1}
                width={1}
            >
                <Grid2 size="auto">
                    <Input></Input>
                    <Button onClick={() => setFocusIndex(focusIndex + 1)}>down</Button>
                    <Button onClick={() => setFocusIndex(focusIndex - 1)}>up</Button>
                </Grid2> 

                <Grid2 
                    size="grow" 
                    sx={{ 
                        overflow: "hidden",
                        display: "flex",
                    }}
                >
                    <BookmarkList
                        focusIndex={focusIndex}
                        onClickEdit={() => {}}
                        onClickRemove={() => {}}
                        items={items}
                    ></BookmarkList>
                </Grid2>
            </Grid2>
        </Box>

    );
}

export default App;
