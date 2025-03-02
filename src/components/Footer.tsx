import { ChangeEvent, KeyboardEvent } from "react";
import { clearBtnAtom, cssAtom, inputFieldAtom, loadingAtom, messagesAtom, Role } from "../constants";
import { useAtom, useSetAtom } from "jotai";

const ASSISTANT_ERROR_MSG = "There was an error retrieving my response 😞";

function Footer() {
  const [inputField, setInputField] = useAtom(inputFieldAtom);
  const [messages, setMessages] = useAtom(messagesAtom);
  const setLoading = useSetAtom(loadingAtom);
  const [css, setCss] = useAtom(cssAtom);
  const setClearBtn = useSetAtom(clearBtnAtom);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleInputFieldChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (!!e.target.value.trim()) {
      setInputField(e.target.value);
    } else {
      setInputField("");
    }
  };

  const handleSubmit = () => {
    const trimmedField = inputField.trim();
    if (!trimmedField) {
      return;
    }
    messages.push({ role: Role.USER, content: trimmedField });
    setInputField("");
    setLoading(true);
    makeRequestToClara();
  };

  const makeRequestToClara = () => {
    fetch("/api", {
      method: "POST",
      body: JSON.stringify({
        messages,
        current_style: css ?? extractCss(),
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then(handleNewClaraData)
      .catch((error) => {
        console.error("Encountered a problem with making a request:", error);
        setLoading(false);
        messages.push({
          role: Role.ASSISTANT,
          content: ASSISTANT_ERROR_MSG,
        });
        setMessages(messages);
      });
  };

  const handleNewClaraData = (data: any) => {
    setLoading(false);

    messages.push({
      role: Role.ASSISTANT,
      content: data.content ?? ASSISTANT_ERROR_MSG,
    });
    setMessages(messages);

    if (data.new_style) {
      setCss(data.new_style);
      setClearBtn(false); // Allow button to show as "Save Theme"
    }

    if (data.error) {
      console.error(data.error);
    }
  };

  function extractCss() {
    const stylesheets = document.styleSheets;
    let cssText = "";

    Array.from(stylesheets).forEach((stylesheet) => {
      const firstItem = stylesheet.cssRules.item(0);
      if (firstItem && firstItem.cssText.startsWith(".fa")) {
        return; // skip font awsome CSS
      }
      for (const rule of Array.from(stylesheet.cssRules)) {
        if (rule.cssText.startsWith(".fa")) {
          return; // for prod builds, font awesome is in the same style sheet
        }
        cssText += `${rule.cssText} `;
      }
    });

    return cssText.replace(/\n/g, " ");
  }

  return (
    <div id="input-container">
      <div className="textarea-wrapper">
        <textarea
          id="message-input"
          placeholder="Ask me to write a poem for you!"
          rows={1}
          autoComplete="off"
          value={inputField}
          onChange={handleInputFieldChange}
          onKeyDown={handleKeyDown}
        ></textarea>
        <button id="send-button" onClick={handleSubmit}>
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
}

export default Footer;
