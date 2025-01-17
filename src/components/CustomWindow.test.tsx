import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { CustomWindow } from "./CustomWindow";
import "@testing-library/jest-dom/vitest";
import { DEFAULT_CONFIG } from "../providers/configProvider";

describe("CustomWindow", () => {
    test("test1", () => {
        render(<CustomWindow>hello</CustomWindow>);

        expect(screen.getByText("hello")).toBeInTheDocument();
        expect(screen.getByTestId("custom-window")).toHaveStyle(
            `background-color: ${DEFAULT_CONFIG.colorTheme.bg}`
        );
    });

    test("test2", () => {
        render(
            <CustomWindow>
                <div data-testid="hello"></div>
            </CustomWindow>
        );

        expect(screen.getByTestId("hello")).toBeInTheDocument();
        expect(screen.getByTestId("custom-window")).toHaveStyle(
            `background-color: ${DEFAULT_CONFIG.colorTheme.bg}`
        );
    });
});
