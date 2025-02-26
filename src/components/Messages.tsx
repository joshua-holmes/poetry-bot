import { useEffect, useRef } from "react";
import EmptyState from "./message_components/EmptyState";
import ChatMessage from "./message_components/ChatMessage";
import { loadingAtom, messagesAtom } from "../constants";
import { useAtomValue } from "jotai";
import LoadingBubblesMessage from "./message_components/LoadingBubblesMessage";

function Messages() {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messages = useAtomValue(messagesAtom);
  const loading = useAtomValue(loadingAtom);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  return (
    <div id="messages-container">
      {messages.length === 0 ? (
        <EmptyState />
      ) : (
        messages.map((m, i) => <ChatMessage key={`message ${i}: ${m.text}`} message={m} />)
      )}
      {
        loading ? <LoadingBubblesMessage /> : ""
      }
      <div ref={messagesEndRef} />
    </div>
  );
}
export default Messages;
