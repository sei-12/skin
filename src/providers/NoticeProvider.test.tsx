import { describe, expect, test } from "vitest";
import "@testing-library/jest-dom/vitest";
import { NoticeProvider, useNotice } from "./NoticeProvider";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";

function SampleComponent() {
    const { addNotice } = useNotice();

    return (
        <>
            <button
                data-testid="sample-button1"
                onClick={() =>
                    addNotice({ message: "button1", serverity: "error" })
                }
            ></button>

            <button
                data-testid="sample-button2"
                onClick={() =>
                    addNotice({ message: "button2", serverity: "warning" })
                }
            ></button>

            <button
                data-testid="sample-button3"
                onClick={() =>
                    addNotice({ message: "button3", serverity: "info" })
                }
            ></button>

            <button
                data-testid="sample-button4"
                onClick={() =>
                    addNotice({ message: "button4", serverity: "success" })
                }
            ></button>
        </>
    );
}

describe("NoticeProvider", () => {
    test("test1", async () => {
        const user = userEvent.setup();

        render(
            <NoticeProvider>
                <SampleComponent></SampleComponent>
            </NoticeProvider>,
        );

        expect(() => {
            screen.getByText("button1");
        }).toThrow();
        await user.click(screen.getByTestId("sample-button1"));
        expect(screen.getByText("button1")).toBeInTheDocument();

        expect(() => {
            screen.getByText("button2");
        }).toThrow();
        await user.click(screen.getByTestId("sample-button2"));
        expect(screen.getByText("button2")).toBeInTheDocument();

        expect(() => {
            screen.getByText("button3");
        }).toThrow();
        await user.click(screen.getByTestId("sample-button3"));
        expect(screen.getByText("button3")).toBeInTheDocument();

        expect(() => {
            screen.getByText("button4");
        }).toThrow();
        await user.click(screen.getByTestId("sample-button4"));
        expect(screen.getByText("button4")).toBeInTheDocument();
    });
});
