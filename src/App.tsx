import "@fortawesome/fontawesome-free/css/all.min.css";
import Container from "./components/Container";
import { useAtom } from "jotai";
import { cssAtom, localStorageKey } from "./constants";
import { useCallback, useEffect } from "react";

function App() {
  const [css, setCss] = useAtom(cssAtom);

  const injectCss = useCallback((css: string) => {
    document.getElementById("custom-styles")?.remove();
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
    const localCss = localStorage.getItem(localStorageKey);
    if (localCss) {
      setCss(localCss);
    }
  }, []);

  useEffect(() => {
    console.log("CSS FROM CLARA", css);
  }, [css]);

  return <Container />;
}

export default App;
