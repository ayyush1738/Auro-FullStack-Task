import { useState } from "react";
import ChatArea from "./components/Chat";
import LeftPanel from "./components/Panel";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [sessions, setSessions] = useState({});
  const [activeSession, setActiveSession] = useState(null);

  const handleSend = async (question) => {
    const sessionId = activeSession || uuidv4();
    const existingSession = sessions[sessionId] || { title: question, messages: [] };
  
    const updatedMessages = [...existingSession.messages, { type: "user", text: question }];
  
    setSessions({
      ...sessions,
      [sessionId]: {
        ...existingSession,
        title: existingSession.title || question,
        messages: updatedMessages,
      },
    });
  
    if (!activeSession) setActiveSession(sessionId);
  
    try {
      const res = await fetch("https://auro-fullstack-task-production.up.railway.app/chat/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
  
      if (!res.ok) throw new Error("Server responded with an error");
  
      const data = await res.json();
      const botMsg = { type: "bot", text: data.answer };
  
      setSessions((prev) => ({
        ...prev,
        [sessionId]: {
          ...prev[sessionId],
          messages: [...prev[sessionId].messages, botMsg],
        },
      }));
  
      return data.answer; // ✅ success case
    } catch (err) {
      console.error("Error in handleSend:", err);
      return null; // ❌ error case
    }
  };
  

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("https://auro-fullstack-task-production.up.railway.app/document/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    res.json().then((data) => console.log(data));
  };

  const handleDeleteSession = (id) => {
    const copy = { ...sessions };
    delete copy[id];
    setSessions(copy);
    if (activeSession === id) setActiveSession(null);
  };

  const handleNewChat = () => {
    const newId = uuidv4();
    const newSession = {
      title: "New Chat",
      messages: [],
    };

    setSessions((prev) => ({
      ...prev,
      [newId]: newSession,
    }));

    setActiveSession(newId);
  };

  return (
    <div className="flex h-screen">
      <LeftPanel
        sessions={sessions}
        activeSession={activeSession}
        onSelectSession={setActiveSession}
        onDeleteSession={handleDeleteSession}
        onUpload={handleUpload}
        onNewChat={handleNewChat}
      />
      <ChatArea
        messages={sessions[activeSession]?.messages || []}
        onSend={handleSend}
      />
    </div>
  );
}

export default App;
