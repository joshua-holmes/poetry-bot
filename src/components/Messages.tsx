import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import EmptyState from "./message_components/EmptyState";
import ChatMessage from "./message_components/ChatMessage";
import { Message } from "../constants";

export type MessagesProps = {
  messages: Array<Message>;
  setMessages: Dispatch<SetStateAction<Array<Message>>>;
}

function Messages({messages, setMessages}: MessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

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
        messages.map(m => <ChatMessage message={m} />)
      }
      <div ref={messagesEndRef}/>
      </div>
  )
}
export default Messages;
