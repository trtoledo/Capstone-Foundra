import "./Inbox.css";

const Inbox = ({ threads, selectedUser, onSelectThread }) => {

  return (
    <div className="inbox-container">
      <div className="inbox-header">Inbox</div>
      {threads
        ?.filter((user) => user.senderId === localStorage.getItem("id"))
        .map((thread) => {
          const lastMessage = thread.messages?.[thread.messages.length - 1];
          const timestamp = lastMessage?.createdAt;

          return (
            <div
              key={thread.id}
              onClick={() => onSelectThread(thread)}
              className={`thread-preview ${
                selectedUser?.id === thread.recipientId ? "selected" : ""
              }`}
            >
              <div className="thread-name">{thread.recipient.name}</div>
              <div className="thread-last-message">
                {lastMessage ? lastMessage.content : "No messages yet"}
              </div>
              <div className="thread-timestamp">
                {timestamp ? new Date(timestamp).toLocaleString() : "No timestamp"}
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Inbox;