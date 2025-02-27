import { ChangeEvent, KeyboardEvent, useState } from "react";
import { cssAtom, inputFieldAtom, loadingAtom, messagesAtom, Role } from "../constants";
import { useAtom, useSetAtom } from "jotai";

const ASSISTANT_ERROR_MSG = "There was an error retrieving my response 😞";
const ASSISTANT_CANT_FIND_CSS = "I cannot find the page's CSS, and cannot restyle the page for you 😢 But we can still chat! 😀";

function Footer() {
  const [inputField, setInputField] = useAtom(inputFieldAtom);
  const [messages, setMessages] = useAtom(messagesAtom);
  const setLoading = useSetAtom(loadingAtom);
  const [css, setCss] = useAtom(cssAtom);
  const [warnedAboutCss, setWarnedAboutCss] = useState(false);

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
    console.log("UHHHHHH", extractCss())
    fetch("/api", {
      method: "POST",
      body: JSON.stringify({
        messages,
        current_style: css ?? extractCss(),
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

    if (data.new_style) {
      setCss(data.new_style);
    }

    if (data.error) {
      console.error(data.error);
    }
  }

  const extractCss = () => {
    // if warned about not finding CSS files, don't try finding them again
    if (warnedAboutCss) {
      return "";
    }

    const stylesheets = document.styleSheets;

    // find style sheet that has root rule or first stylesheet if not found
    const selectedStylesheet = Array.from(stylesheets)
    .find(ss => Array.from(ss.cssRules).findIndex(cr => cr.cssText.includes("root")) !== -1) ?? stylesheets.item(0);

    // find rule in sheet that is for root or first rule if not found
    const selectedRule = Array.from(selectedStylesheet?.cssRules ?? []).find(cr => cr.cssText.includes("root")) ?? selectedStylesheet?.cssRules.item(0);

    // only warn once about not finding CSS
    if (!selectedRule) {
      if (!warnedAboutCss) {
        setWarnedAboutCss(true);
        setMessages([...messages, {
          role: Role.ASSISTANT,
          text: ASSISTANT_CANT_FIND_CSS,
        }]);
      }
      return "";
    }

    return selectedRule.cssText.replace(/\n/g, " ");
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
