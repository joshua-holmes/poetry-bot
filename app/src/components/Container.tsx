import Footer from "./Footer";
import Header from "./Header";
import Messages from "./Messages";
import { modalActiveAtom } from "../constants";
import Modal from "./Modal";
import { useAtomValue } from "jotai";

function Container() {
  const modalActive = useAtomValue(modalActiveAtom);
  return (
    <>
      <div id="chat-container">
        <Header />
        <Messages />
        <Footer />
      </div>
      {
        modalActive ? <Modal /> : ""
      }
    </>
  );
}

export default Container;
