import { BookmarkForm } from "../components/BookmarkForm";
import { useSearchBookmarkPage } from "../hooks/SearchBookmark";
import { SearchBookmark } from "../components/SearchBookmark";
import { useCreateNewBookmarkPage } from "../hooks/CreateNewBookmark";
import { useEditBookmarkPage } from "../hooks/EditBookmarkPage";

export function CreateNewBookmarkPage() {
    const hook = useCreateNewBookmarkPage();
    return <BookmarkForm {...hook} />;
}

export function SearchBookmarkPage() {
    const hook = useSearchBookmarkPage();
    return <SearchBookmark {...hook} />;
}

export function EditBookmarkPage() {
    const hook = useEditBookmarkPage()
    return <BookmarkForm {...hook}></BookmarkForm>
}