
function Footer() {
  return (
      <div id="input-container">
        <div className="textarea-wrapper">
          <textarea
            id="message-input"
            placeholder="Ask me to change the theme, colors, or style..."
            rows={1}
            autoComplete="off"
          ></textarea>
          <button id="send-button">
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
  )
}

export default Footer;
