// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'

contextBridge.exposeInMainWorld(
    "app", {
        add_bookmark: (url:string,title:string,tags:string[]) => {
            return ipcRenderer.invoke("add-bkmk",url,title,tags)
        },
        
        fetch_title_from_url: (url:string) => {
            return ipcRenderer.invoke("fetch-title-from-url",url)
        },

        fetch_suggestion: (word:string) => {
            return ipcRenderer.invoke("fetch-suggestion",word)
        },

        search_bookmarks: (tags:string[]) => {
            return ipcRenderer.invoke("search-bookmarks",tags)
        },

        tag_exists_db:(tag_name:string) => {
            return ipcRenderer.invoke("tag-exists-db",tag_name)
        },
        open_bookmark:(bookmark_id:number) => {
            return ipcRenderer.invoke("open-bookmark",bookmark_id)
        }
    }
);
