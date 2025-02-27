import "@fortawesome/fontawesome-free/css/all.min.css";
import Container from "./components/Container";
import { useAtomValue } from "jotai";
import { cssAtom } from "./constants";
import { useCallback, useEffect } from "react";

function App() {
  const css = useAtomValue(cssAtom);

  const injectCss = useCallback((css: string) => {
    const existingEl = document.getElementById("custom-styles");
    if (existingEl) {
      existingEl.remove();
    }
    const newEl = document.createElement("style");
    newEl.innerHTML = css;
    newEl.id = "custom-styles";
    const head = document.querySelector("head")!; // safe to assert that head will always be present
    head.appendChild(newEl);
  }, []);

  useEffect(() => {
    if (css) {
      injectCss(css);
    }
  }, [css, injectCss]);

  useEffect(() => {
    console.log("CSS FROM CLARA", css);
  }, [css]);

  return <Container />;
}

export default App;
