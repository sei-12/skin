import { describe, expect, test, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { DEFAULT_CONFIG } from "../providers/configProvider";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { TagListProps } from "./TagList";
import { TagList } from "./TagList";

function buildProps(): TagListProps {
    const tags = TESTDATA.map((t) => ({ id: BigInt(t.id), name: t.name }));

    const onClickDelete = vi.fn();
    const onClickEdit = vi.fn();
    const onClickGoRoot = vi.fn();
    return {
        colorTheme: DEFAULT_CONFIG.colorTheme,
        tags,
        onClickDelete,
        onClickEdit,
        onClickGoRoot,
    };
}

describe("TagList", () => {
    test("test1", async () => {
        const props = buildProps();
        render(<TagList {...props}></TagList>);

        const user = userEvent.setup();

        for (let i = 0; i < 10; i++) {
            const item = screen.getByTestId(
                `tag-item-${TESTDATA[i].id}-${TESTDATA[i].name}`
            );
            const textBox = within(item).getByRole("textbox");
            expect(textBox).toBeInTheDocument();

            await user.type(textBox, "hello");

            expect(
                screen.getByDisplayValue(TESTDATA[i].name + "hello")
            ).toBeInTheDocument();

            const buttons = within(item).getAllByRole("button");
            const editButton = buttons[0];
            const deleteButton = buttons[1];

            expect(buttons.length).toBe(2);
            expect(editButton).toBeInTheDocument();
            expect(deleteButton).toBeInTheDocument();

            await user.click(editButton);
            expect(props.onClickEdit).toBeCalledTimes(1 + i);
            expect(props.onClickEdit).toBeCalledWith(
                TESTDATA[i].id,
                TESTDATA[i].name + "hello"
            );

            await user.click(deleteButton);
            expect(props.onClickDelete).toBeCalledTimes(1 + i);
            expect(props.onClickDelete).toBeCalledWith(TESTDATA[i].id);
        }
    });
});

const TESTDATA = [
    { id: 1, name: "Doris" },
    { id: 2, name: "Willabella" },
    { id: 3, name: "Elyssa" },
    { id: 4, name: "Henrietta" },
    { id: 5, name: "Octavius" },
    { id: 6, name: "Wyatt" },
    { id: 7, name: "Sibel" },
    { id: 8, name: "Bridget" },
    { id: 9, name: "Elmer" },
    { id: 10, name: "Malvin" },
    { id: 11, name: "Carlos" },
    { id: 12, name: "Wileen" },
    { id: 13, name: "Brittni" },
    { id: 14, name: "Elwyn" },
    { id: 15, name: "Ferdy" },
    { id: 16, name: "Lynnette" },
    { id: 17, name: "Etti" },
    { id: 18, name: "Logan" },
    { id: 19, name: "Bernice" },
    { id: 20, name: "Philly" },
    { id: 21, name: "Korney" },
    { id: 22, name: "Waly" },
    { id: 23, name: "Cherry" },
    { id: 24, name: "Yoshi" },
    { id: 25, name: "Carri" },
    { id: 26, name: "Leon" },
    { id: 27, name: "Nick" },
    { id: 28, name: "Leeanne" },
    { id: 29, name: "Bertine" },
    { id: 30, name: "Krisha" },
    { id: 31, name: "Kimble" },
    { id: 32, name: "Ozzy" },
    { id: 33, name: "Alisander" },
    { id: 34, name: "Katy" },
    { id: 35, name: "Coop" },
    { id: 36, name: "Aron" },
    { id: 37, name: "Sandy" },
    { id: 38, name: "Katuscha" },
    { id: 39, name: "Lodovico" },
    { id: 40, name: "Ardene" },
    { id: 41, name: "Nada" },
    { id: 42, name: "Gun" },
    { id: 43, name: "Stephi" },
    { id: 44, name: "Carie" },
    { id: 45, name: "Jacki" },
    { id: 46, name: "Waylen" },
    { id: 47, name: "Julieta" },
    { id: 48, name: "Frank" },
    { id: 49, name: "Kit" },
    { id: 50, name: "Francesca" },
    { id: 51, name: "Harriot" },
    { id: 52, name: "Eziechiele" },
    { id: 53, name: "Darda" },
    { id: 54, name: "Salomon" },
    { id: 55, name: "Matelda" },
    { id: 56, name: "Rafaelita" },
    { id: 57, name: "Merwyn" },
    { id: 58, name: "Cassi" },
    { id: 59, name: "Nonah" },
    { id: 60, name: "Mikael" },
    { id: 61, name: "Penelope" },
    { id: 62, name: "Kristos" },
    { id: 63, name: "Riley" },
    { id: 64, name: "Lockwood" },
    { id: 65, name: "Barbabas" },
    { id: 66, name: "Christabella" },
    { id: 67, name: "Ceil" },
    { id: 68, name: "Camile" },
    { id: 69, name: "Nil" },
    { id: 70, name: "Adrianna" },
    { id: 71, name: "Quinton" },
    { id: 72, name: "Annice" },
    { id: 73, name: "Lauralee" },
    { id: 74, name: "Shelden" },
    { id: 75, name: "Nertie" },
    { id: 76, name: "Cathlene" },
    { id: 77, name: "Randa" },
    { id: 78, name: "Ardella" },
    { id: 79, name: "Addison" },
    { id: 80, name: "Trina" },
    { id: 81, name: "Anett" },
    { id: 82, name: "Denis" },
    { id: 83, name: "Leann" },
    { id: 84, name: "Almeda" },
    { id: 85, name: "Barbi" },
    { id: 86, name: "Kylila" },
    { id: 87, name: "Blanche" },
    { id: 88, name: "Dolores" },
    { id: 89, name: "Neila" },
    { id: 90, name: "Myra" },
    { id: 91, name: "Jarad" },
    { id: 92, name: "Miranda" },
    { id: 93, name: "Marjy" },
    { id: 94, name: "Hartley" },
    { id: 95, name: "Gun" },
    { id: 96, name: "Eustacia" },
    { id: 97, name: "Enrichetta" },
    { id: 98, name: "Gilligan" },
    { id: 99, name: "Therese" },
    { id: 100, name: "Harmonia" },
];
