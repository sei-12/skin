
import type { FindTagMethod } from "../components/SuggestionWindow";
import { DB } from "./database";
export const findTagMethod: FindTagMethod = async (predicate, inputedTags) => {
    const inputedTagsSet = new Set(inputedTags);
    const dbResult = await DB.findTag(predicate);
    const filted = dbResult.filter((t) => inputedTagsSet.has(t) === false);
    return filted;
};