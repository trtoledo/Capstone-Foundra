const Inbox = ({ threads, selectedUser, onSelectThread }) => {
  return (
    <div>
      <div className="inbox-header">Inbox</div>
      {threads.map(({ user, lastMessage, timestamp }) => (
        <div
          key={user.id}
          onClick={() => onSelectThread(user)}
          className={`thread-preview ${
            selectedUser?.id === user.id ? "selected" : ""
          }`}
        >
          <div className="font-medium">{user.name}</div>
          <div className="text-sm text-gray-400">{lastMessage}</div>
          <div className="text-xs text-gray-500">
            {new Date(timestamp).toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Inbox;