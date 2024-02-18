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
    type f_FetchPageInfo = (url: string) => Promise<{
        title: string | null,
        description: string | null
    } | null>
}

export interface IMainProcess {
    add_bookmark: f_AddBookmark
    fetch_pageinfo: f_FetchPageInfo;
    tag_exists_db: f_TagExistsDB,
    search_bookmarks: f_SearchBookmarks
    fetch_suggestion: (word: string) => Promise<{
        err: boolean,
        data: TagData[]
    }>;
    open_bookmark: f_OpenBookmark
    search_google: (tags: string[]) => void

    fetch_tag_list: () => Promise<{
        err: Error | null,
        data: TagData[]
    }>

    edit_tag: (data: TagData) => Promise<{
        err: Error | null,
    }>

    fetch_hit_tags: f_FetchHitTags
}
