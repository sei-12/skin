declare global {
    interface Window {
        app: IMainProcess;
    }
}

export interface IMainProcess {
    add_bookmark: (url:string,title:string,tags:string[]) => Promise<{
        err: boolean,
        message: string
    }>;
    fetch_title_from_url: (url:string) => Promise<string|null>;
    tag_exists_db: (tag_name:string) => Promise<boolean>;
    search_bookmarks: (tags:string[]) => Promise<{
        title:string,
        id: number,
        url:string
    }[]>;
    fetch_suggestion:(word:string) => Promise<{
        err: boolean,
        data: {
            name:string
        }[]
    }>,
    open_bookmark:(bookmark_id:number) => Promise<void>;
}
