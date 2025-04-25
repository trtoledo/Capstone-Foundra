import { useEffect, useState, useCallback, useMemo } from "react";
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
  initializeSocket,
  connectSocket,
  disconnectSocket,
  sendMessage as sendSocketMessage,
  onMessageReceived,
  offMessageReceived,
} from "../../api/socket";

const Messenger = () => {
  const { user } = useAuth();
  const [threads, setThreads] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  // Initialize socket once
  useEffect(() => {
    const initializedSocket = initializeSocket();
    setSocket(initializedSocket);
  
    // Cleanup the socket connection on unmount
    return () => {
      initializedSocket.disconnect();
    };
  }, []);


  // Connect and disconnect socket based on user presence
  useEffect(() => {
    if (user) {
      connectSocket();
      return () => {
        offMessageReceived();
        disconnectSocket();
      };
    }

    // Cleanup if user becomes null
    offMessageReceived();
    disconnectSocket();
  }, [user, socket]); // Depend on user to manage connection

  // Handle incoming messages and update the state
  const handleMessageReceived = useCallback(
    (newMessage) => {
      console.log("Message received:", newMessage);
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

  // Attach the message handler
  useEffect(() => {
    onMessageReceived(handleMessageReceived);
    return () => {
      offMessageReceived();
    };
  }, [handleMessageReceived]);

  // Load threads when the user changes or the component mounts
  useEffect(() => {
    const loadThreads = async () => {
      if (user) {
        try {
          const data = await fetchMessages();
          console.log("Threads:", data);
          setThreads(data);
        } catch (err) {
          console.error(err);
          setError("Failed to load message threads.");
        }
      } else {
        setThreads([]); // Clear threads when user logs out
      }
    };
    loadThreads();
  }, [user]);

  // Load messages when a thread is selected
  useEffect(() => {
    console.log("Selected user:", selectedUser);
    const loadMessages = async () => {
      if (user && selectedUser) {
        const token = user?.token;
        setLoadingMessages(true);
        setError(null); // Clear any previous message loading errors

        try {
          const msgs = await fetchMessageById(selectedUser.id, token);
          console.log("Messages for selected user:", msgs);
          const formatted = msgs.map((m) => ({
            ...m,
            fromSelf: m.senderId === user.userId,
          }));
          setMessages(formatted);
        } catch (err) {
          console.error(err);
          setError("Failed to load messages.");
          setMessages([]); // Clear messages on error
        } finally {
          setLoadingMessages(false);
        }
      } else {
        setMessages([]); // Clear messages when no user or selectedUser
      }
    };
    loadMessages();
  }, [selectedUser, user]);

  // Handle sending a message
  const handleSendMessage = useCallback(
    async (text) => {
      if (!text.trim() || !selectedUser || !user) return;

      const localMessage = {
        id: Date.now(),
        content: text,
        senderId: user.userId,
        recipientId: selectedUser.id,
        createdAt: new Date().toISOString(),
        fromSelf: true,
      };

      setMessages((prevMessages) => [
        ...prevMessages.filter((msg) => msg.id !== localMessage.id),
        localMessage,
      ]);

      sendSocketMessage({
        recipientId: selectedUser.id,
        content: text,
      });

      try {
        await sendHttpMessage(selectedUser.id, text);
      } catch (err) {
        console.error("HTTP send failed:", err);
        setError("Failed to send message.");
        // Optionally revert the local message on failure
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg.id !== localMessage.id)
        );
      }
    },
    [selectedUser, user]
  );

  // Memoize threads for performance optimization
  const memoizedThreads = useMemo(() => threads, [threads]);

  return (
    <div className="messenger-container">
      <div className="inbox-panel">
        <Inbox
          threads={memoizedThreads}
          selectedUser={selectedUser}
          onSelectThread={setSelectedUser}
        />
      </div>
      <div className="chat-panel">
        {error && <div className="error-message">{error}</div>}
        {selectedUser ? (
          <>
            {loadingMessages ? (
              <div>Loading messages...</div>
            ) : (
              <ChatWindow
                messages={messages}
                selectedUser={selectedUser}
                onSendMessage={handleSendMessage}
              />
            )}
          </>
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