import { useEffect, useRef } from "react";
import EmptyState from "./message_components/EmptyState";
import ChatMessage from "./message_components/ChatMessage";
import { messagesAtom } from "../constants";
import { useAtom } from "jotai";

function Messages() {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useAtom(messagesAtom);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
      <div id="messages-container">
      { messages.length === 0 ?
        <EmptyState />
        :
        messages.map((m, i) => <ChatMessage key={`message ${i}: ${m.text}`} message={m} />)
      }
      <div ref={messagesEndRef}/>
      </div>
  )
}
export default Messages;
