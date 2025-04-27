import "./Inbox.css";

const Inbox = ({ threads, selectedUser, onSelectThread }) => {
  console.log(threads);
  
  return (
    <div className="inbox-container">
      <div className="inbox-header">Inbox</div>
      {threads
        ?.filter(( user ) => user.senderId === localStorage.getItem("id"))
        .map(( message ) => (
          <div
            key={message.id}
            onClick={() => onSelectThread(message)}
            className={`thread-preview ${
              selectedUser?.id === message.recipientId ? "selected" : ""
            }`}
          >
            <div className="thread-name">{message.recipient.name}</div>
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