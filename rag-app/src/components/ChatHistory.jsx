const SessionList = ({ sessions, activeId, onSelect, onDelete, onNewChat }) => {
  return (
    <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-white">Chats</h2>
        <button
          onClick={onNewChat}
          className="text-sm bg-indigo-700 shadow-lg cursor-pointer shadow-indigo-800/50 text-white px-2 py-1 rounded hover:bg-indigo-800"
        >
          + New Chat
        </button>
      </div>

      <ul className="space-y-2 mt-8">
        {Object.entries(sessions).map(([id, session]) => (
          <li
            key={id}
            className={`flex items-center justify-between p-2  rounded-md cursor-pointer ${
              activeId === id ? "bg-indigo-700 shadow-lg shadow-indigo-800/50 text-white" : "bg-gray-400 text-black hover:bg-gray-100"
            }`}
            onClick={() => onSelect(id)}
          >
            <span className="text-sm truncate w-full">{session.title || "Untitled"}</span>
            <button
              className="ml-2 text-red-500 hover:bg-white w-5 rounded-md cursor-pointer text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(id);
              }}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SessionList;
