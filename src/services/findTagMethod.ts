
import type { FindTagMethod } from "../components/SuggestionWindow";
import { DB } from "./database";

function f(tags: [string, boolean][]): string {
    let jointed = ""
    tags.forEach(block => jointed += block[0])
    return jointed
}
export const findTagMethod: FindTagMethod = async (predicate, inputedTags) => {
    const inputedTagsSet = new Set(inputedTags);
    const dbResult = await DB.fuzzyFindTag(predicate);
    const filted = dbResult.filter((t) => inputedTagsSet.has(f(t)) === false);
    return filted;
};