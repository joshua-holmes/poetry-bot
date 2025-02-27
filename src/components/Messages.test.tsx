import { render, screen } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import Messages from "./Messages"; // Path to your Messages component
import { messagesAtom, loadingAtom, Role } from "../constants"; // Path to your atoms
import { vi, describe, test, expect, beforeAll } from "vitest";

// Mocking the required components for testing
vi.mock("./message_components/EmptyState", () => ({
  default: () => <div>EmptyState</div>
}));
vi.mock("./message_components/LoadingBubblesMessage", () => ({
  default: () => <div data-testid="loading-bubbles">Loading...</div>
}));

// Mocking the atoms for testing
const mockMessages = [
  { role: Role.USER, content: "Hello" },
  { role: Role.ASSISTANT, content: "How are you?" }
];

beforeAll(() => {
  HTMLElement.prototype.scrollIntoView = vi.fn();
});

describe("Messages", () => {
  test("renders EmptyState when there are no messages", () => {
    // Mock the atom values
    render(
      <Provider>
        <Messages />
      </Provider>
    );

    // Check that the EmptyState component is rendered
    expect(screen.getByText("EmptyState")).toBeInTheDocument();
  });

  test("renders ChatMessage components when there are messages", () => {
    const store = createStore();
    store.set(messagesAtom, mockMessages);
    // Mock the messages atom to simulate the state
    render(
      <Provider store={store}>
        <Messages />
      </Provider>
    );

    // Ensure that the ChatMessage components are rendered with correct content
    mockMessages.forEach((message) => {
      expect(screen.getByText(message.content)).toBeInTheDocument();
    });
  });

  test("renders LoadingBubblesMessage when loading is true", () => {
    const store = createStore();
    store.set(loadingAtom, true);
    // Mock the loading atom to simulate loading state
    render(
      <Provider store={store}>
        <Messages />
      </Provider>
    );

    // Check that the loading spinner is displayed
    expect(screen.getByTestId("loading-bubbles")).toBeInTheDocument();
  });

  test("does not render LoadingBubblesMessage when loading is false", () => {
    const store = createStore();
    store.set(loadingAtom, false);
    // Mock the loading atom to simulate loading state
    render(
      <Provider store={store}>
        <Messages />
      </Provider>
    );

    // Ensure that the loading spinner is not displayed
    expect(screen.queryByTestId("loading-bubbles")).not.toBeInTheDocument();
  });

  test("scrolls to the bottom", async () => {
    // We can mock scrollIntoView for testing purposes
    const scrollIntoViewMock = vi.fn();
    HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

    const store = createStore();
    store.set(messagesAtom, mockMessages);
    // Mock the messages atom to simulate the state
    render(
      <Provider store={store}>
        <Messages />
      </Provider>
    );

    // Check that it initially scrolled
    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: "smooth" });
    expect(scrollIntoViewMock).toHaveBeenCalledOnce();
  });
});
