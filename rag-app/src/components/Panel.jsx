import SessionList from "./ChatHistory";
import DocumentPanel from "./UploadFile";

const LeftPanel = ({
  sessions,
  activeSession,
  onSelectSession,
  onDeleteSession,
  onUpload,
  onNewChat,
}) => {
  return (
    <div className="w-1/5 h-full flex flex-col bg-gray-500 p-4">
      <SessionList
        sessions={sessions}
        activeId={activeSession}
        onSelect={onSelectSession}
        onDelete={onDeleteSession}
        onNewChat={onNewChat}
      />
      <DocumentPanel onUpload={onUpload} />
    </div>
  );
};

export default LeftPanel;
