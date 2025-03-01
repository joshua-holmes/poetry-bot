import { render, screen, fireEvent } from "@testing-library/react";
import { Provider, useSetAtom } from "jotai";
import Header from "./Header"; // Path to your Header component
import { vi, test, expect, describe, Mock } from "vitest";

// Mocking useSetAtom hooks
vi.mock("jotai", async (importOriginal) => ({
  ...(await importOriginal()),
  useSetAtom: vi.fn(),
}));

describe("Header", () => {
  test("renders Header with buttons", () => {
    // Render the Header component
    render(
      <Provider>
        <Header />
      </Provider>,
    );

    // Check if the buttons are rendered
    expect(screen.getByText("New Chat")).toBeInTheDocument();
    expect(screen.getByLabelText("Information")).toBeInTheDocument();
  });

  test("clicking 'New Chat' button clears messages", () => {
    const mockSetMessages = vi.fn();
    (useSetAtom as Mock).mockReturnValue(mockSetMessages);

    render(
      <Provider>
        <Header />
      </Provider>,
    );

    // Click the 'New Chat' button
    fireEvent.click(screen.getByLabelText("Start new chat"));

    // Check if setMessages was called to clear messages
    expect(mockSetMessages).toHaveBeenCalledWith([]);
  });

  test("clicking 'Info' button opens modal", () => {
    const mockSetModalActive = vi.fn();
    (useSetAtom as Mock).mockReturnValue(mockSetModalActive);

    render(
      <Provider>
        <Header />
      </Provider>,
    );

    // Click the 'Info' button
    fireEvent.click(screen.getByLabelText("Information"));

    // Check if setModalActive was called to open the modal
    expect(mockSetModalActive).toHaveBeenCalledWith(true);
  });
});
