import { BookmarkForm } from "../components/BookmarkForm";
import { useSearchBookmarkPage } from "../hooks/SearchBookmark";
import { SearchBookmark } from "../components/SearchBookmark";
import { useCreateNewBookmarkPage } from "../hooks/CreateNewBookmark";
import { useEditBookmarkPage } from "../hooks/EditBookmarkPage";
import { useTagListPage } from "../hooks/TagList";
import { TagList } from "../components/TagList";

export function CreateNewBookmarkPage() {
    const hook = useCreateNewBookmarkPage();
    return <BookmarkForm {...hook} />;
}

export function SearchBookmarkPage() {
    const hook = useSearchBookmarkPage();
    return <SearchBookmark {...hook} />;
}

export function EditBookmarkPage() {
    const hook = useEditBookmarkPage();
    return <BookmarkForm {...hook}></BookmarkForm>;
}

export function TagListPage() {
    const hook = useTagListPage();
    return <TagList {...hook}></TagList>;
}
