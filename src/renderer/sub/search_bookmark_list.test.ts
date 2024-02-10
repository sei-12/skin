import { __local__ } from "./search_bookmark_list"

test("SearchBookmarkList", () => {

})

test("elm <--> data", () => {
    let data: BookmarkData = {
        title: "title",
        url: "url",
        description: "desc",
        created_at: "c",
        id: 0
    }

    let elm = __local__.create_new_bookmark_elm(data)
    let data1 = __local__.bkmk_data_from_bkmk_elm(elm)

    expect(data).toEqual(data1)
})