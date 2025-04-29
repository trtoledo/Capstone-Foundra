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

  // --- STATE ---
  const [threads, setThreads] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState(null);

  const [socket, setSocket] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // --- SOCKET SETUP ---
  useEffect(() => {
    const sock = initializeSocket();
    setSocket(sock);
    return () => sock.disconnect();
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
        setMessages((prev) => [
          ...prev.filter((m) => m.id !== newMessage.id),
          { ...newMessage, fromSelf: false },
        ]);
      }
    },
    [selectedUser]
  );

  // --- LOAD THREADS FOR INBOX ---
  useEffect(() => {
    if (!user) return setThreads([]);
    fetchMessages(token)
      .then(setThreads)
      .catch(() => setError("Failed to load message threads."));
  }, [user]);

  // --- LOAD CONVERSATION WHEN USER SELECTS THREAD OR NEW USER ---
  useEffect(() => {
    if (!user || !selectedUser) return setMessages([]);
    setLoadingMessages(true);
    setError(null);

    fetchConversation(user.id, selectedUser.id, token)
      .then((msgs) =>
        setMessages(
          msgs.map((m) => ({
            ...m,
            fromSelf: m.senderId === user.id,
          }))
        )
      )
      .catch(() => setError("Failed to load messages."))
      .finally(() => setLoadingMessages(false));
  }, [selectedUser, user]);

  // --- SEND MESSAGE ---
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

      setMessages((prev) => [...prev, localMessage]);
      console.log("→ Sending socket message:", { to: selectedUser.id, text });
      sendSocketMessage({ recipientId: selectedUser.id, content: text, senderId: user.id });

      try {
        console.log("→ Calling HTTP send with token:", token);
        const saved = await sendHttpMessage(selectedUser.id, text, token);
        console.log("← HTTP send response:", saved);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === tempId ? { ...saved, fromSelf: true, status: "sent" } : m
          )
        );
      } catch {
        console.error("✖ sendHttpMessage error:", err);
        setError("Failed to send message.");
        setMessages((prev) =>
          prev.map((m) =>
            m.id === tempId ? { ...m, status: "failed" } : m
          )
        );
      }
    },
    [selectedUser, user, token]
  );

  // --- LOAD ALL USERS FOR “NEW CHAT” SEARCH ---
  useEffect(() => {
    fetchAllUsers()
      .then(setAllUsers)
      .catch((e) => console.error("Failed to fetch users", e));
  }, []);

  // --- MEMOIZE THREADS LIST ---
  const memoizedThreads = useMemo(() => threads, [threads]);

  // --- FILTER USERS WHEN TYPING ---
  const filteredUsers = useMemo(
    () =>
      allUsers.filter((u) =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [allUsers, searchQuery]
  );

  return (
    <div className="messenger-container">
      <div className="inbox-panel">
        {/* --- NEW CHAT SEARCH --- */}
        <div className="user-search-panel">
          <input
            type="text"
            placeholder="Type to search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="user-search-input"
          />

          {/* only show matching users once you start typing */}
          {searchQuery.length > 0 && (
            <div className="user-list">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <div
                    key={u.id}
                    className="user-list-item"
                    onClick={() => {
                      setSelectedUser(u);
                      setSearchQuery(""); // clear search
                    }}
                  >
                    {u.name}
                  </div>
                ))
              ) : (
                <div className="empty-search">No users found</div>
              )}
            </div>
          )}
        </div>

        {/* --- EXISTING CONVERSATIONS --- */}
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
            Select a conversation or search for a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(Messenger);