
function Header() {

  return (
    <div id="chat-header">
      Poem bot
      <div className="header-buttons">
        <button
          id="new-chat-button"
          className="new-chat-button"
          aria-label="Start new chat"
        >
          <i className="fas fa-plus"></i>
          New Chat
        </button>
        <button id="info-button" aria-label="Information">
          <i className="fas fa-info-circle"></i>
        </button>
      </div>
    </div>
  );
}

export default Header;
