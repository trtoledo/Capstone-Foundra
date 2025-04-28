import { useState, useEffect, useRef } from "react";
import "./ChatWindow.css";

const ChatWindow = ({ messages, selectedUser, onSendMessage }) => {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const handleSend = () => {
    if (input.trim() !== "") {
      onSendMessage(input);
      setInput("");
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        {selectedUser ? `Chatting with ${selectedUser.name}` : "Select a conversation"}
      </div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.fromSelf ? "sent" : "received"}`}
          >
            <div className="message-content">{msg.content}</div>
            <div className="timestamp">
              {new Date(msg.createdAt).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="chat-input"
        />
        <button
          onClick={handleSend}
          className="send-button"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;