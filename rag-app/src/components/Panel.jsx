import { useEffect, useState } from "react";
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const panelContent = (
    <div className="w-82 h-full flex flex-col bg-gray-500 p-4">
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

  if (!isMobile) {
    // Desktop View
    return panelContent;
  }

  // Mobile View
  return (
    <>
      {/* Toggle Button */}
      <div className="absolute top-2 left-2 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 shadow-lg shadow-indigo-800/50 cursor-pointer text-white px-4 py-2 rounded shadow-md"
        >
          Show Menu
        </button>
      </div>

      {/* Modal Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center custom-scrollbar">
          <div className="relative bg-gray-500 p-4 rounded-lg w-84 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-3 text-white text-lg cursor-pointer"
            >
              ✕
            </button>
            {panelContent}
          </div>
        </div>
      )}
    </>
  );
};

export default LeftPanel;
