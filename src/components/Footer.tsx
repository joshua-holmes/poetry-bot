import { ChangeEvent, KeyboardEvent } from "react";
import { inputFieldAtom, loadingAtom, messagesAtom, Role } from "../constants";
import { useAtom, useSetAtom } from "jotai";

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
        current_style: ""
      }),
      headers: {
        "Content-Type": "application/json",
      }
    })
    .then(resp => resp.json())
    .then(data => handleNewClaraData(data))
    .catch(error => console.error("Encountered a problem with making a request:", error))
  }

  const handleNewClaraData = (data: any) => {
    setLoading(false);
    messages.push({
      role: Role.ASSISTANT,
      text: data.message_text
    })
    setMessages(messages)
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
