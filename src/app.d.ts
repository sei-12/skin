declare global {
    interface Window {
        app: IMainProcess;
    }

    type BookmarkData = {
        title: string,
        id: number,
        url: string,
        description: string,
    }
}

export interface IMainProcess {
    add_bookmark: (url:string,title:string,tags:string[],description: string) => Promise<{
        err: boolean,
        message: string
    }>;
    fetch_pageinfo: (url:string) => Promise<{
        title:string|null,
        description:string|null 
    }|null>;
    tag_exists_db: (tag_name:string) => Promise<boolean>;
    search_bookmarks: (tags:string[]) => Promise<BookmarkData[]>;
    fetch_suggestion:(word:string) => Promise<{
        err: boolean,
        data: {
            name:string
        }[]
    }>;
    open_bookmark:(bookmark_id:number) => Promise<void>;
    search_google:(tags:string[]) => void
}
