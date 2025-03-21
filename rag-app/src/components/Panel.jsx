import SessionList from "./ChatHistory";
import DocumentPanel from "./UploadFile";

const LeftPanel = ({ sessions, activeSession, onSelectSession, onDeleteSession, onUpload }) => {
  return (
    <div className="w-1/5 h-full flex flex-col border-r">
      <SessionList
        sessions={sessions}
        activeId={activeSession}
        onSelect={onSelectSession}
        onDelete={onDeleteSession}
      />
      <DocumentPanel onUpload={onUpload} />
    </div>
  );
};

export default LeftPanel;
