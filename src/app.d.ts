declare global {
    interface Window {
        app: IMainProcess;
    }

    type BookmarkData = {
        title: string,
        id: number,
        url: string,
        description: string,
        created_at: string
    }

    type TagData = {
        id: number,
        name: string,
        oto: string
    }


    type f_FetchSuggestion = (word: string) => Promise<{
        err: boolean,
        data: TagData[]
    }>
    type f_SearchBookmarks = (tags: string[]) => Promise<BookmarkData[]>;
    type f_OpenBookmark = (bookmark_id: number) => Promise<void>;
    type f_FetchHitTags = (tags: string[]) => Promise<{
        err: Error | null,
        data: {
            name: string,
            count: number
        }[]
    }>
    type f_TagExistsDB = (tag_name: string) => Promise<boolean>
    type f_AddBookmark = (url: string, title: string, tags: string[], description: string) => Promise<{
        err: boolean,
        message: string
    }>
    type f_FetchTagsWhereLinkBkmk = (bkmkid: number) => Promise<{
        err: Error | null,
        tags: string[]
    }>
    type f_FetchPageInfo = (url: string) => Promise<{
        title: string | null,
        description: string | null
    } | null>
    type f_UpdateBookmark = (data:BookmarkData,tags: string[]) => Promise<{
        err: Error | null
    }>
    type f_RemoveBookmark = (data: BookmarkData) => Promise<{
        err: Error | null
    }>
}

export interface IMainProcess {
    add_bookmark: f_AddBookmark
    fetch_pageinfo: f_FetchPageInfo;
    tag_exists_db: f_TagExistsDB,
    search_bookmarks: f_SearchBookmarks
    fetch_suggestion: f_FetchSuggestion
    open_bookmark: f_OpenBookmark
    fetch_hit_tags: f_FetchHitTags
    fetch_tags_where_link_bkmk: f_FetchTagsWhereLinkBkmk
    update_bkmk: f_UpdateBookmark
    remove_bkmk: f_RemoveBookmark


    // search_google: (tags: string[]) => void
    // fetch_tag_list: () => Promise<{
    //     err: Error | null,
    //     data: TagData[]
    // }>

    // edit_tag: (data: TagData) => Promise<{
    //     err: Error | null,
    // }>

}
