import { Dispatch, SetStateAction } from "react";

export type ModalProps = {
  setModalActive: Dispatch<SetStateAction<boolean>>;
}

function Modal({setModalActive}: ModalProps) {
  const handleClose = () => {
    setModalActive(false);
  }

  return (
    <div id="info-modal" className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>About Clara</h2>
          <button className="close-modal" onClick={handleClose}>×</button>
        </div>
        <div className="modal-body">
          <p>
            Clara is an AI chat bot that responds in rhymes and can generate poems! When a poem is generated, the bot will dynamically change the theme of this page to reflect the theme of the poem. Try saying:
          </p>
          <ul>
            <li>Write a blissful poem about my cat, Charlie, frolicking in the field.</li>
            <li>Create a dark poem about frightful dragons ruling the land.</li>
            <li>Draft a joyful poem about a puppy and a penguin becoming friends.</li>
          </ul>
          <p>
            Simply describe a poem and watch AI bot, Clara, draft a masterpiece while being immersed in stylistic colors!
          </p>
          <hr className="modal-divider" />
          <div className="creator-info">
            <p>
              Created by
              <a
                href="https://holmes-software.com"
                target="_blank"
                rel="noopener noreferrer"
              >
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
