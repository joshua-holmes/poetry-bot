import { Dispatch, SetStateAction } from "react";
import { Message } from "../constants";

export type HeaderProps = {
  setMessages: Dispatch<SetStateAction<Array<Message>>>;
  setModalActive: Dispatch<SetStateAction<boolean>>;
}

function Header({setMessages, setModalActive}: HeaderProps) {

  const handleNewChatClick = () => {
    setMessages([]);
  }
  const handleInfoClick = () => {
    setModalActive(true);
  }

  return (
    <div id="chat-header">
      Clara, the poem bot
      <div className="header-buttons">
        <button
          id="new-chat-button"
          className="new-chat-button"
          aria-label="Start new chat"
          onClick={handleNewChatClick}
        >
          <i className="fas fa-plus"></i>
          New Chat
        </button>
        <button id="info-button" aria-label="Information" onClick={handleInfoClick}>
          <i className="fas fa-info-circle"></i>
        </button>
      </div>
    </div>
  );
}

export default Header;
