import { BookmarkForm } from "../components/BookmarkForm";
import { useSearchBookmarkPage } from "../hooks/SearchBookmark";
import { SearchBookmark } from "../components/SearchBookmark";
import { useCreateNewBookmarkPage } from "../hooks/CreateNewBookmark";

export function CreateNewBookmarkPage() {
    const hook = useCreateNewBookmarkPage();
    return <BookmarkForm {...hook.props} />;
}


export function SearchBookmarkPage() {
    const hook = useSearchBookmarkPage();
    return <SearchBookmark {...hook} />;
}
