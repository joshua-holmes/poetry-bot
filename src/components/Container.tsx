import Footer from "./Footer";
import Header from "./Header";
import Messages from "./Messages";

function Container() {
  return (
    <div id="chat-container">
      <Header />
      <Messages />
      <Footer />
    </div>
  );
}

export default Container;
