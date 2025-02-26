import { ChangeEvent, KeyboardEvent } from "react";
import { inputFieldAtom, loadingAtom, messagesAtom, Role } from "../constants";
import { useAtom, useSetAtom } from "jotai";

const ASSISTANT_ERROR_MSG = "There was an error retrieving my response :/";

function Footer() {
  const [inputField, setInputField] = useAtom(inputFieldAtom);
  const [messages, setMessages] = useAtom(messagesAtom);
  const setLoading = useSetAtom(loadingAtom);

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
    messages.push({ role: Role.USER, text: trimmedField });
    setInputField("");
    setLoading(true);
    makeRequestToClara();
  };

  const makeRequestToClara = () => {
    fetch("/api", {
      method: "POST",
      body: JSON.stringify({
        messages,
        current_style: extractCSS(),
      }),
      headers: {
        "Content-Type": "application/json",
      }
    })
    .then(resp => resp.json())
    .then(handleNewClaraData)
    .catch(error => {
      console.error("Encountered a problem with making a request:", error);
      setLoading(false);
      messages.push({
        role: Role.ASSISTANT,
        text: ASSISTANT_ERROR_MSG,
      });
      setMessages(messages);
    });
  }

  const handleNewClaraData = (data: any) => {
    setLoading(false);
    messages.push({
      role: Role.ASSISTANT,
      text: data.message_text ?? ASSISTANT_ERROR_MSG,
    })
    setMessages(messages);
    if (data.error) {
      console.error(data.error);
    }
  }

  function extractCSS() {
    const stylesheets = document.styleSheets;
    let cssText = "";

    Array.from(stylesheets).forEach((stylesheet) => {
      const firstItem = stylesheet.cssRules.item(0);
      if (firstItem && firstItem.cssText.startsWith(".fa")) {
        return; // skip font awsome CSS
      }
      Array.from(stylesheet.cssRules).forEach((rule) => {
        cssText += `${rule.cssText}\n`;
      });
    });

    return cssText;
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
