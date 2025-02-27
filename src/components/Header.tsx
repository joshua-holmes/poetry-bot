import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { clearBtnAtom, cssAtom, localStorageKey, messagesAtom, modalActiveAtom } from "../constants";

function Header() {
  const setMessages = useSetAtom(messagesAtom);
  const setModalActive = useSetAtom(modalActiveAtom);
  const css = useAtomValue(cssAtom);
  const [clearBtn, setClearBtn] = useAtom(clearBtnAtom);

  const handleSaveClick = () => {
    if (!css) {
      return;
    }
    if (clearBtn) {
      // set back to default colors (sync all states)
      localStorage.removeItem(localStorageKey);
      if (!css) {
        document.getElementById("custom-styles")?.remove();
      }
    } else {
      localStorage.setItem(localStorageKey, css);
    }
    setClearBtn(!clearBtn);
  };
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
        {css ? (
          <button
            id="save-theme-button"
            className="new-chat-button"
            aria-label="Save current theme"
            onClick={handleSaveClick}
            disabled={!css}
          >
            <i className={`fas fa-${clearBtn ? "eraser" : "save"}`}></i>
            {clearBtn ? "Clear" : "Save Theme"}
          </button>
        ) : (
          ""
        )}
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
