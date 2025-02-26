import { ChangeEvent, KeyboardEvent } from "react";
import { inputFieldAtom, messagesAtom, Role } from "../constants";
import { useAtom } from "jotai";

function Footer() {
  const [inputField, setInputField] = useAtom(inputFieldAtom);
  const [messages, setMessages] = useAtom(messagesAtom);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      handleSendClick();
    }
  }

  const handleInputFieldChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (!!e.target.value.trim()) {
      setInputField(e.target.value);
    } else {
      setInputField("");
    }
  }

  const handleSendClick = () => {
    const trimmedField = inputField.trim();
    if (!trimmedField) {
      return;
    }
    setMessages([
      ...messages,
      {role: Role.USER, text: trimmedField},
    ]);
    setInputField("");
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
        <button id="send-button" onClick={handleSendClick}>
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  )
}

export default Footer;
