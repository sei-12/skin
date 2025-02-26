import { renderHook } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { useBookmarkFormDialog } from "./BookmarkFormDialog";
import { act } from "react";

test("BookmarkFormDialog case1", async () => {
    const onClickDone = vi.fn();
    const hook = renderHook(() => {
        return useBookmarkFormDialog(onClickDone);
    });

    expect(hook.result.current.props.open).toBeFalsy();
    act(() => {
        hook.result.current.setOpen(true);
    });

    expect(hook.result.current.props.open).toBeTruthy();
    act(() => {
        hook.result.current.props.onClickCancel();
    });
    expect(hook.result.current.props.open).toBeFalsy();

    act(() => {
        hook.result.current.setOpen(true);
    });
    expect(hook.result.current.props.open).toBeTruthy();
    act(() => {
        hook.result.current.props.onClickDone();
    });
    expect(hook.result.current.props.open).toBeFalsy();
    expect(onClickDone).toBeCalledTimes(1);
});
