// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

contextBridge.exposeInMainWorld(
    "app", {
    add_bookmark: (url: string, title: string, tags: string[], description: string) => {
        return ipcRenderer.invoke("add-bkmk", url, title, tags, description)
    },

    fetch_pageinfo: (url: string) => {
        return ipcRenderer.invoke("fetch-pageinfo", url)
    },

    fetch_suggestion: (word: string) => {
        return ipcRenderer.invoke("fetch-suggestion", word)
    },

    search_bookmarks: (tags: string[]) => {
        return ipcRenderer.invoke("search-bookmarks", tags)
    },

    tag_exists_db: (tag_name: string) => {
        return ipcRenderer.invoke("tag-exists-db", tag_name)
    },
    open_bookmark: (bookmark_id: number) => {
        return ipcRenderer.invoke("open-bookmark", bookmark_id)
    },
    search_google: (tags: string[]) => {
        ipcRenderer.invoke("search-google", tags)
    },
    fetch_tag_list: () => ipcRenderer.invoke("fetch-tag-list"),
    edit_tag: (data: TagData) => ipcRenderer.invoke("edit-tag", data),
    fetch_hit_tags: (tags: string[]) => ipcRenderer.invoke("fetch-hit-tags", tags),
    fetch_tags_where_link_bkmk: (bkmkid: number) => ipcRenderer.invoke("fetch-tags-where-link-bkmk", bkmkid),
    update_bkmk: (data: BookmarkData,tags: string[]) => ipcRenderer.invoke("update-bkmk",data,tags),
    remove_bkmk: (data: BookmarkData) => ipcRenderer.invoke("remove-bkmk",data)
}
);
