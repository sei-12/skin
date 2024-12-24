import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { MyButton } from "./Button";

test("Button", () => {
    render(<MyButton></MyButton>);
    expect(screen.getByRole("button").textContent).toBe("Hello Vitest!!!");
});
