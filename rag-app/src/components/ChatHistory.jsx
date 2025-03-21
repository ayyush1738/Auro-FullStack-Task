const SessionList = ({ sessions, activeId, onSelect, onDelete }) => {
  return (
    <div className="flex-1 overflow-y-auto p-2">
      <h2 className="text-lg font-semibold mb-2">Chats</h2>
      <ul className="space-y-2">
        {Object.entries(sessions).map(([id, session]) => (
          <li
            key={id}
            className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
              activeId === id ? "bg-blue-100" : "hover:bg-gray-100"
            }`}
            onClick={() => onSelect(id)}
          >
            <span className="text-sm truncate w-full">{session.title || "Untitled"}</span>
            <button
              className="ml-2 text-red-500 text-xs"
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
