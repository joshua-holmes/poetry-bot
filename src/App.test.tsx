import "@testing-library/jest-dom"; // Ensure Jest matchers are available
import { render } from "@testing-library/react";
import { createStore, Provider } from "jotai";
import App from "./App";
import { vi, test, expect, beforeAll, describe } from "vitest";
import { cssAtom } from "./constants";

// Mock console.log to avoid unnecessary output in tests
vi.spyOn(console, "log").mockImplementation(() => {});

beforeAll(() => {
  // Mock scrollIntoView function
  HTMLElement.prototype.scrollIntoView = vi.fn();
});

describe("App", () => {
  test("renders the App component", () => {
    render(
      <Provider>
        <App />
      </Provider>,
    );
  });

  test("injects CSS into the document when cssAtom has a value", () => {
    const mockCss = "body { background-color: red; }";
    const store = createStore();
    store.set(cssAtom, mockCss);

    render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    const styleElement = document.getElementById("custom-styles");
    expect(styleElement).toBeInTheDocument();
    expect(styleElement?.innerHTML).toBe(mockCss);
  });
});
