import { useSetAtom } from "jotai";
import { examplePrompts, modalActiveAtom } from "../constants";

function Modal() {
  const setModalActive = useSetAtom(modalActiveAtom);

  const handleClose = () => {
    setModalActive(false);
  };

  return (
    <div id="info-modal" className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>About Clara</h2>
          <button className="close-modal" onClick={handleClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <p>
            Clara is an AI chat bot that responds in rhymes and can generate poems! When a poem is generated, the bot
            will dynamically change the theme of this page to reflect the theme of the poem. Try saying:
          </p>
          <ul>
            {examplePrompts.map((ex, i) => (
              <li key={`info-modal example ${i}: ${ex}`}>{ex}</li>
            ))}
          </ul>
          <p>
            Simply describe a poem and watch AI bot, Clara, draft a masterpiece while being immersed in stylistic
            colors!
          </p>
          <hr className="modal-divider" />
          <div className="creator-info">
            <p>
              Created by
              <a href="https://holmes-software.com" target="_blank" rel="noopener noreferrer">
                Joshua Holmes
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
