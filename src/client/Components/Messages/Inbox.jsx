import { useState } from "react";
import "./Inbox.css";
import { useAuth } from "../Context/AuthContext";

const Inbox = ({ threads, selectedUser, onSelectThread }) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const sortedThreads = [...threads].sort((a, b) => {
    const aLast = a.messages?.[a.messages.length - 1]?.createdAt || 0;
    const bLast = b.messages?.[b.messages.length - 1]?.createdAt || 0;
    return new Date(bLast) - new Date(aLast);
  });

  const filteredThreads = sortedThreads.filter((thread) => {
    const otherUser =
      thread.sender.id === user.id ? thread.recipient : thread.sender;
    return otherUser.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="inbox-container">
      <div className="inbox-header">Inbox</div>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search messages..."
        className="inbox-search"
      />

      {searchTerm.length === 0 ? (
        <div className="empty-inbox-message">
          Type to search for conversations.
        </div>
      ) : filteredThreads.length === 0 ? (
        <div className="empty-inbox-message">No matching users.</div>
      ) : (
        filteredThreads.map((thread) => {
          const otherUser =
            thread.sender.id === user.id ? thread.recipient : thread.sender;

          const lastMessage =
            Array.isArray(thread.messages) && thread.messages.length
              ? thread.messages[thread.messages.length - 1]
              : null;

          const timestamp = lastMessage?.createdAt;

          return (
            <div
              key={thread.id}
              onClick={() => onSelectThread(otherUser)}
              className={`thread-preview ${
                selectedUser?.id === otherUser.id ? "selected" : ""
              }`}
            >
              <div className="thread-name">{otherUser.name}</div>
              <div className="thread-last-message">
                {lastMessage?.content || "No messages yet"}
              </div>
              <div className="thread-timestamp">
                {timestamp && !isNaN(new Date(timestamp))
                  ? new Date(timestamp).toLocaleString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      month: "short",
                      day: "numeric",
                    })
                  : "No timestamp"}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Inbox;