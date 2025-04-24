import "./Messages.css";

const Inbox = ({ threads, selectedUser, onSelectThread }) => {
  return (
    <div className="inbox-container">
      <div className="inbox-header">Inbox</div>
      {threads
        .filter(({ user }) => user && user.id)
        .map(({ user, lastMessage, timestamp }) => (
          <div
            key={user.id}
            onClick={() => onSelectThread(user)}
            className={`thread-preview ${
              selectedUser?.id === user.id ? "selected" : ""
            }`}
          >
            <div className="thread-name">{user.name}</div>
            <div className="thread-last-message">{lastMessage}</div>
            <div className="thread-timestamp">
              {new Date(timestamp).toLocaleString()}
            </div>
          </div>
        ))}
    </div>
  );
};

export default Inbox;