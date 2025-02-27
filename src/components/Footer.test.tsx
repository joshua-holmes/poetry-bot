import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { createStore, Provider, useAtom, useSetAtom } from "jotai";
import Footer from "./Footer"; // Path to your Footer component
import { vi, test, expect, describe, Mock } from "vitest";
import { inputFieldAtom } from "../constants";

// Mocking Jotai hooks
vi.mock("jotai", async (importOriginal) => ({
  ...(await importOriginal()),
  useAtom: vi.fn(() => [undefined, () => {}]),
  useSetAtom: vi.fn(() => {}),
}));

// Mock fetch API
global.fetch = vi.fn().mockResolvedValue({
  json: vi.fn().mockResolvedValue({ content: "This is a test response." })
});

describe("Footer", () => {
  test("renders the Footer component with input and send button", () => {
    render(
      <Provider>
        <Footer />
      </Provider>
    );

    // Check if the textarea and send button are rendered
    expect(screen.getByPlaceholderText("Ask me to write a poem for you!")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  test("updates input field when typing", () => {
    const store = createStore();
    store.set(inputFieldAtom, "");

    render(
      <Provider store={store}>
        <Footer />
      </Provider>
    );

    const input = screen.getByPlaceholderText("Ask me to write a poem for you!") as HTMLTextAreaElement;

    // Type into the input field
    fireEvent.change(input, { target: { value: "New message" } });

    // Check if the value of the input field is updated
    expect(input.value).toBe("New message");
  });
});

