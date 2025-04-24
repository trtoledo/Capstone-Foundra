import { useEffect, useState } from "react";
import Inbox from "./Inbox";
import ChatWindow from "./ChatWindow";
import "./Messages.css";
import { fetchMessages, fetchMessageById, sendMessage } from "../../api/messages";
import { useAuth } from "../Context/AuthContext";

const Messenger = () => {
  const { user } = useAuth();
  const [threads, setThreads] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages().then(setThreads).catch(console.error);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (selectedUser) {
      fetchMessageById(selectedUser.id, token)
        .then(setMessages)
        .catch(console.error);
    }
  }, [selectedUser]);

  const handleSendMessage = async (text) => {
    if (!text.trim() || !selectedUser) return;

    const msg = await sendMessage(selectedUser.id, text);
    setMessages((prev) => [...prev, msg]);
  };

  return (
    <div className="messenger-container">
      <div className="inbox-panel">
        <Inbox
          threads={threads}
          selectedUser={selectedUser}
          onSelectThread={setSelectedUser}
        />
      </div>
      <div className="chat-panel">
        {selectedUser ? (
          <ChatWindow
            messages={messages}
            selectedUser={selectedUser}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <div className="empty-chat-message">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default Messenger;
