import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "jotai";
import Modal from "./Modal";
import { describe, vi, test, expect } from "vitest";

// Mock the atom value before running the tests
const mockSetModalActive = vi.fn();

// Mocking the useSetAtom hook to use the mock function
vi.mock("jotai", async (importOriginal) => ({
  ...(await importOriginal()),
  useSetAtom: () => mockSetModalActive,
}));

// Sample test for Modal component
describe("Modal", () => {
  test("renders the modal content", () => {
    render(
      <Provider>
        <Modal />
      </Provider>,
    );

    // Check if the modal header renders
    expect(screen.getByText("About Clara")).toBeVisible();

    // Check if example prompts are rendered
    expect(screen.getByText("Joshua Holmes")).toBeVisible();
  });

  test("closes the modal when the close button is clicked", () => {
    render(
      <Provider>
        <Modal />
      </Provider>,
    );

    const closeButton = screen.getByRole("button", { name: /×/ });
    fireEvent.click(closeButton); // Simulate the click event

    // Ensure that the setModalActive function was called
    expect(mockSetModalActive).toHaveBeenCalledWith(false);
  });
});
