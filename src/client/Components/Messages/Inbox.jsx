import "./Inbox.css";
import { useAuth } from "../Context/AuthContext";

const Inbox = ({ threads, selectedUser, onSelectThread }) => {
  const {user} = useAuth();

  const sortedThreads = [...threads].sort(
    (a, b) =>
      new Date(b.messages?.[b.messages.length - 1]?.createdAt || 0) -
      new Date(a.messages?.[a.messages.length - 1]?.createdAt || 0)
  );

  return (
    <div className="inbox-container">
      <div className="inbox-header">Inbox</div>

      {sortedThreads.length === 0 ? (
        <div className="empty-inbox-message">
          No conversations yet.
        </div>
      ) : (
        sortedThreads.map((thread) => {
          const lastMessage = thread.messages?.[thread.messages.length - 1];
          const timestamp = lastMessage?.createdAt;

          const otherUser =
            thread.sender.id === user.id ? thread.recipient : thread.sender;

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
                {lastMessage ? lastMessage.content : "No messages yet"}
              </div>
              <div className="thread-timestamp">
                {timestamp ? new Date(timestamp).toLocaleString() : "No timestamp"}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Inbox;