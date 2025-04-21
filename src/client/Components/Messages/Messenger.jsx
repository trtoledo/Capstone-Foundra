import { useEffect, useState } from "react";
import Inbox from "./Inbox";
import ChatWindow from "./ChatWindow";
import "./Messenger.css";
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
      <div className="inbox">
        <Inbox
          threads={threads}
          selectedUser={selectedUser}
          onSelectThread={setSelectedUser}
        />
      </div>
      <div className="chat-window">
        {selectedUser ? (
          <ChatWindow
            messages={messages}
            selectedUser={selectedUser}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <div className="p-4 text-center text-gray-400">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default Messenger;
