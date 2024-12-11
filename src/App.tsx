import { Stack } from "@mui/material";
import { BookmarkItem } from "./components/BookmarkItem";

function App() {

    return (
        <div>
            <Stack spacing={1} margin={2}>
                <BookmarkItem
                    data={{
                        title: "hello1",
                        key: "aac",
                        tags: ["tag1", "tag2", "tag3"],
                        desc: "this is description",
                        url: "decoy://aaa.www.ccc"
                    }}
                    focus={true}
                    onClickEdit={(key) => console.log("edit:", key)}
                    onClickRemove={(key) => console.log("remove:", key)}
                ></BookmarkItem>
                <BookmarkItem
                    data={{
                        title: "hello",
                        key: "aaa",
                        tags: ["tag1", "tag2", "tag3"],
                        desc: "this is description",
                        url: "decoy://aaa.www.ccc"
                    }}
                    focus={false}
                    onClickEdit={(key) => console.log("edit:", key)}
                    onClickRemove={(key) => console.log("remove:", key)}
                ></BookmarkItem>
                <BookmarkItem
                    data={{
                        title: "hello",
                        key: "caaa",
                        tags: ["tag1", "tag2", "tag3"],
                        desc: "this is description".repeat(100),
                        url: "decoy://aaa.www.ccc"
                    }}
                    focus={false}
                    onClickEdit={(key) => console.log("edit:", key)}
                    onClickRemove={(key) => console.log("remove:", key)}
                ></BookmarkItem>
                <BookmarkItem
                    data={{
                        title: "hello".repeat(20),
                        key: "caaa",
                        tags: ["tag1", "tag2", "tag3"],
                        desc: "this is description".repeat(100),
                        url: "decoy://aaa.www.ccc"
                    }}
                    focus={false}
                    onClickEdit={(key) => console.log("edit:", key)}
                    onClickRemove={(key) => console.log("remove:", key)}
                ></BookmarkItem>
                <BookmarkItem
                    data={{
                        title: "hello".repeat(20),
                        key: "caaa",
                        tags: Array(25).fill("tag"),
                        desc: "this is description".repeat(100),
                        url: "decoy://aaa.www.ccc"
                    }}
                    focus={false}
                    onClickEdit={(key) => console.log("edit:", key)}
                    onClickRemove={(key) => console.log("remove:", key)}
                ></BookmarkItem>

            </Stack>
        </div>
    );
}

export default App;
