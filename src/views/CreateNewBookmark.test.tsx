// import { render, screen, fireEvent } from "@testing-library/react";
// import "@testing-library/jest-dom/vitest";
// import { describe, expect, test, vi } from "vitest";
// // import { CreateNewBookmark } from "./CreateNewBookmark";

// describe("CreateNewBookmark Component", () => {
//   test("onChange and onChangeUrl are called on input change", () => {
//     const onChangeMock = vi.fn();
//     const onChangeUrlMock = vi.fn();

//     render(
//       <CreateNewBookmark
//         onChange={onChangeMock}
//         onChangeUrl={onChangeUrlMock}
//       />
//     );

//     const urlInput = screen.getByRole("textbox", { name: "url" });
//     const titleInput = screen.getByRole("textbox", { name: "title" });
//     const descInput = screen.getByRole("textbox", { name: "desc" });

//     fireEvent.change(urlInput, { target: { value: "https://example.com" } });
//     expect(onChangeMock).toHaveBeenCalled();
//     expect(onChangeUrlMock).toHaveBeenCalled();

//     fireEvent.change(titleInput, { target: { value: "Example Title" } });
//     fireEvent.change(descInput, { target: { value: "Example Description" } });
//     expect(onChangeMock).toHaveBeenCalledTimes(3); // URL, Title, and Desc inputs
//   });

//   test("validation errors are displayed on invalid input", () => {
//     // Assuming validation error messages are added as part of your component.
//     render(<CreateNewBookmark onChange={() => {}} onChangeUrl={() => {}} />);
//     const urlInput = screen.getByRole("textbox", { name: "url" });

//     fireEvent.change(urlInput, { target: { value: "invalid-url" } });
//     const errorMessage = screen.getByText(/Invalid URL format/i);
//     expect(errorMessage).toBeInTheDocument();
//   });

//   test("buttons are rendered and work", () => {
//     render(<CreateNewBookmark onChange={() => {}} onChangeUrl={() => {}} />);
//     const confirmButton = screen.getByRole("button", { name: "Confirm" });
//     const cancelButton = screen.getByRole("button", { name: "Cancel" });

//     expect(confirmButton).toBeInTheDocument();
//     expect(cancelButton).toBeInTheDocument();

//     fireEvent.click(confirmButton);
//     fireEvent.click(cancelButton);

//     // Further assertions for button behaviors can be added here
//   });
// });