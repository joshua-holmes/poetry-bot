import { useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Messages from "./Messages";
import { Message } from "../constants";
import Modal from "./Modal";

function Container() {
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [modalActive, setModalActive] = useState<boolean>(false);

  return (
    <>
      <div id="chat-container">
        <Header setMessages={setMessages} setModalActive={setModalActive} />
        <Messages
          messages={messages}
          setMessages={setMessages}
        />
        <Footer
          messages={messages}
          setMessages={setMessages}
        />
      </div>
      {
        modalActive ? <Modal setModalActive={setModalActive}/> : ""
      }
    </>
  );
}

export default Container;
