
export interface I_DbConneciton {
    filterTags(inputed: string): Promise<string[]>
}