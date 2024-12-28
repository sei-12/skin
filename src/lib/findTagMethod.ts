
import { dbConnection } from "../lib/database";
import { FindTagMethod } from "../components/SuggestionWindow";
export const findTagMethod: FindTagMethod = async (predicate, inputedTags) => {
    const inputedTagsSet = new Set(inputedTags);
    const dbResult = await dbConnection.findTag(predicate);
    const filted = dbResult.filter((t) => inputedTagsSet.has(t) === false);
    return filted;
};