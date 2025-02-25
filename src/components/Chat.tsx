import { useState, useEffect, useRef, SyntheticEvent } from "react";
import styles from "./chat.module.css";
import Markdown from "react-markdown";

type MessageProps = {
  role: Role;
  text: string;
};

const UserMessage = ({ text }: { text: string }) => {
  return <div className={styles.userMessage}>{text}</div>;
};

const AssistantMessage = ({ text }: { text: string }) => {
  return (
    <div className={styles.assistantMessage}>
      <Markdown>{text}</Markdown>
    </div>
  );
};

const Message = ({ role, text }: MessageProps) => {
  switch (role) {
    case "user":
      return <UserMessage text={text} />;
    case "assistant":
      return <AssistantMessage text={text} />;
    default:
      return null;
  }
};

type ChatMessage = {
  role: Role;
  text: string;
};

type Role = "user" | "assistant";

const Chat = () => {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<Array<ChatMessage>>([]);
  const [inputDisabled, setInputDisabled] = useState(false);

  // automatically scroll to bottom of chat
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string) => {
    const response = await fetch(
      "https://magicloops.dev/api/loop/cb423c3f-ceeb-464b-8959-5e8ca7527016/run",
      {
        method: "POST",
        body: JSON.stringify({
          content: text,
        }),
      }
    );
    response.json().then(resp => {
      console.log("UHHHH", resp)
      setInputDisabled(false);
      appendMessage("assistant", resp.output);
    });
  };

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    sendMessage(userInput);
    appendMessage("user", userInput);
    setUserInput("");
    setInputDisabled(true);
    scrollToBottom();
  };

  const appendMessage = (role: Role, text: string) => {
    setMessages((prevMessages) => [...prevMessages, { role, text }]);
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messages}>
        {messages.map((msg, index) => (
          <Message key={index} role={msg.role} text={msg.text} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form
        onSubmit={handleSubmit}
        className={`${styles.inputForm} ${styles.clearfix}`}
      >
        <input
          type="text"
          className={styles.input}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter your question"
        />
        <button
          type="submit"
          className={styles.button}
          disabled={inputDisabled}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
