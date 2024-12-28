import { CreateNewBookmark } from "../components/CreateNewBookmark";
import { useCreateNewBookmarkPage, useSearchBookmarkPage } from "../hooks/todo";
import { SearchBookmark } from "../components/SearchBookmark";

export function CreateNewBookmarkPage() {
    const hook = useCreateNewBookmarkPage();
    return <CreateNewBookmark {...hook.props} />;
}


export function SearchBookmarkPage() {
    const hook = useSearchBookmarkPage();
    return <SearchBookmark {...hook} />;
}
