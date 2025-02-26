import { Message } from "../../constants";

export type ChatMessageProps = {
  message: Message;
};

function ChatMessage({ message }: ChatMessageProps) {
  const roleClass = message.role + "-message";

  return <div className={`message ${roleClass}`}>{message.text}</div>;
}

export default ChatMessage;
