import { CreateNewBookmark } from "../components/CreateNewBookmark";
import { useSearchBookmarkPage } from "../hooks/SearchBookmark";
import { SearchBookmark } from "../components/SearchBookmark";
import { useCreateNewBookmarkPage } from "../hooks/CreateNewBookmark";

export function CreateNewBookmarkPage() {
    const hook = useCreateNewBookmarkPage();
    return <CreateNewBookmark {...hook.props} />;
}


export function SearchBookmarkPage() {
    const hook = useSearchBookmarkPage();
    return <SearchBookmark {...hook} />;
}
