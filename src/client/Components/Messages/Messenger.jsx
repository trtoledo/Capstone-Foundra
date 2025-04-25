import { useEffect, useState } from "react";
import Inbox from "./Inbox";
import ChatWindow from "./ChatWindow";
import "./Messages.css";
import {
  fetchMessages,
  fetchMessageById,
  sendMessage as sendHttpMessage,
} from "../../api/messages";
import { useAuth } from "../Context/AuthContext";
import {
  sendMessage as sendSocketMessage,
  onMessageReceived,
  offMessageReceived,
} from "../../api/socket";

const Messenger = () => {
  const { user, token } = useAuth();
  const [threads, setThreads] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!user || !token) return;

    onMessageReceived((newMessage) => {
      if (
        newMessage.senderId === selectedUser?.id ||
        newMessage.recipientId === selectedUser?.id
      ) {
        setMessages((prev) => [...prev, { ...newMessage, fromSelf: false }]);
      }
    });

    return () => {
      offMessageReceived();
    };
  }, [selectedUser, user, token]);

  useEffect(() => {
    fetchMessages().then(setThreads).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedUser) {
      fetchMessageById(selectedUser.id, token)
        .then((msgs) => {
          const formatted = msgs.map((m) => ({
            ...m,
            fromSelf: m.senderId === user.userId,
          }));
          setMessages(formatted);
        })
        .catch(console.error);
    }
  }, [selectedUser, user.userId, token]);

  const handleSendMessage = async (text) => {
    if (!text.trim() || !selectedUser) return;

    const localMessage = {
      id: Date.now(),
      content: text,
      senderId: user.userId,
      recipientId: selectedUser.id,
      createdAt: new Date().toISOString(),
      fromSelf: true,
    };

    setMessages((prev) => [...prev, localMessage]);

    sendSocketMessage({
      recipientId: selectedUser.id,
      content: text,
    });

    try {
      await sendHttpMessage(selectedUser.id, text);
    } catch (err) {
      console.error("HTTP send failed:", err);
    }
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