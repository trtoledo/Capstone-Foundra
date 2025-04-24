import { useState } from "react";
import "./Messages.css";

const ChatWindow = ({ messages, selectedUser, onSendMessage }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    onSendMessage(input);
    setInput("");
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        Chatting with {selectedUser.name}
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
