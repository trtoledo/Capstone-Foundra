import { useState } from "react";

const ChatWindow = ({ messages, selectedUser, onSendMessage }) => {
  const [input, setInput] = useState("");

  const handleSend = () => {
    onSendMessage(input);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b font-bold">
        Chatting with {selectedUser.name}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.fromSelf ? "sent" : "received"}`}
          >
            <div>{msg.content}</div>
            <div className="timestamp">
              {new Date(msg.createdAt).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t flex">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={handleSend}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
