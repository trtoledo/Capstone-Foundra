import React, { useEffect, useState, useCallback, useMemo } from "react";
import Inbox from "./Inbox";
import ChatWindow from "./ChatWindow";
import "./Messages.css";
import { fetchAllUsers } from "../../api/users";
import {
  fetchMessages,
  fetchConversation,
  sendHttpMessage,
} from "../../api/messages";
import { useAuth } from "../Context/AuthContext";
import {
  initializeSocket,
  connectSocket,
  disconnectSocket,
  sendMessage as sendSocketMessage,
  onMessageReceived,
  offMessageReceived,
} from "../../api/socket";

const Messenger = () => {
  const { user, token } = useAuth();
  const [threads, setThreads] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const initializedSocket = initializeSocket();
    setSocket(initializedSocket);

    return () => {
      initializedSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (user) {
      connectSocket(token);
      onMessageReceived(handleMessageReceived);
    }
    return () => {
      offMessageReceived();
      disconnectSocket();
    };
  }, [user, socket]);

  const handleMessageReceived = useCallback(
    (newMessage) => {
      if (
        selectedUser &&
        (newMessage.senderId === selectedUser.id ||
          newMessage.recipientId === selectedUser.id)
      ) {
        setMessages((prevMessages) => [
          ...prevMessages.filter((msg) => msg.id !== newMessage.id),
          { ...newMessage, fromSelf: false },
        ]);
      }
    },
    [selectedUser]
  );

  useEffect(() => {
    const loadThreads = async () => {
      if (user) {
        try {
          const data = await fetchMessages(user.id, token);
          setThreads(data);
        } catch (err) {
          setError("Failed to load message threads.");
        }
      } else {
        setThreads([]);
      }
    };
    loadThreads();
  }, [user]);

  useEffect(() => {
    const loadMessages = async () => {
      if (user && selectedUser) {
        setLoadingMessages(true);
        setError(null);
        try {
          const msgs = await fetchConversation(user.id, selectedUser.id, token);
          const formatted = msgs.map((m) => ({
            ...m,
            fromSelf: m.senderId === user.id,
          }));
          setMessages(formatted);
        } catch (err) {
          setError("Failed to load messages.");
          setMessages([]);
        } finally {
          setLoadingMessages(false);
        }
      } else {
        setMessages([]);
      }
    };
    loadMessages();
  }, [selectedUser, user]);

  const handleSendMessage = useCallback(
    async (text) => {
      if (!text.trim() || !selectedUser || !user) return;

      const tempId = `temp-${Date.now()}`;

      const localMessage = {
        id: tempId,
        content: text,
        senderId: user.id,
        recipientId: selectedUser.id,
        createdAt: new Date().toISOString(),
        fromSelf: true,
        status: "sending",
      };

      setMessages((prevMessages) => [...prevMessages, localMessage]);

      sendSocketMessage({
        recipientId: selectedUser.id,
        content: text,
        senderId: user.id,
      });

      try {
        const savedMessage = await sendHttpMessage(selectedUser.id, text, token);
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === tempId ? { ...savedMessage, fromSelf: true, status: "sent" } : msg
          )
        );
      } catch (err) {
        setError("Failed to send message.");
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === tempId ? { ...msg, status: "failed" } : msg
          )
        );
      }
    },
    [selectedUser, user]
  );

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await fetchAllUsers();
        setAllUsers(users);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    loadUsers();
  }, []);

  const memoizedThreads = useMemo(() => threads, [threads]);

  return (
    <div className="messenger-container">
      <div className="inbox-panel">
        <div className="user-search-panel">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="user-search-input"
          />
          <div className="user-list">
            {allUsers
              .filter((u) =>
                u.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((userOption) => (
                <div
                  key={userOption.id}
                  className="user-list-item"
                  onClick={() => setSelectedUser(userOption)}
                >
                  {userOption.name}
                </div>
              ))}
          </div>
        </div>
        <Inbox
          threads={memoizedThreads}
          selectedUser={selectedUser}
          onSelectThread={setSelectedUser}
        />
      </div>
      <div className="chat-panel">
        {error && <div className="error-message">{error}</div>}
        {selectedUser ? (
          loadingMessages ? (
            <div>Loading messages...</div>
          ) : (
            <ChatWindow
              messages={messages}
              selectedUser={selectedUser}
              onSendMessage={handleSendMessage}
            />
          )
        ) : (
          <div className="empty-chat-message">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(Messenger);