import { useState } from "react";
import EmptyState from "./message_components/EmptyState";

function Messages() {
  const [messages, setMessages] = useState([]);

  return (
      <div id="messages-container">
        <EmptyState />
      </div>
  )
}
export default Messages;
