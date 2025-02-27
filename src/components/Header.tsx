import { useSetAtom } from "jotai";
import { messagesAtom, modalActiveAtom } from "../constants";

function Header() {
  const setMessages = useSetAtom(messagesAtom);
  const setModalActive = useSetAtom(modalActiveAtom);

  const handleNewChatClick = () => {
    setMessages([]);
  };
  const handleInfoClick = () => {
    setModalActive(true);
  };

  return (
    <div id="chat-header">
      Clara, the AI Poet and Artist
      <div className="header-buttons">
        <button
          id="save-theme-button"
          className="new-chat-button"
          aria-label="Save current theme"
        >
          <i className="fas fa-save"></i>
          Save Theme
        </button>
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
