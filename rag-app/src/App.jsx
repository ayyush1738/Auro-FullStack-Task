import { useState, useEffect } from "react";
import ChatArea from "./components/Chat";
import LeftPanel from "./components/Panel";
import GoogleLoginUI from "./components/Lib-imorted-comp/GoogleLoginUi";
import { v4 as uuidv4 } from "uuid";
import { auth } from "../firebase";
import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

function App() {
  const [sessions, setSessions] = useState({});
  const [activeSession, setActiveSession] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const idToken = await currentUser.getIdToken();
        console.log("✅ Firebase Auth Token:", idToken); // ← DEBUG LINE

        setToken(idToken);
      } else {
        setUser(null);
        setToken("");
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setSessions({});
    setActiveSession(null);
  };

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
      const res = await fetch("http://localhost:8000/chat/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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

      return data.answer;
    } catch (err) {
      console.error("Error in handleSend:", err);
      return null;
    }
  };

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:8000/document/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    console.log(data);
  };

  return (
    <div className="relative h-screen w-full">
      {/* App Container (blur only when user is not logged in) */}
      <div className={`flex h-full w-full transition-all duration-300 ${!user ? "blur-md" : ""}`}>
        <LeftPanel
          sessions={sessions}
          activeSession={activeSession}
          onSelectSession={setActiveSession}
          onDeleteSession={(id) => {
            const copy = { ...sessions };
            delete copy[id];
            setSessions(copy);
            if (activeSession === id) setActiveSession(null);
          }}
          onUpload={handleUpload}
          onNewChat={() => {
            const newId = uuidv4();
            setSessions((prev) => ({
              ...prev,
              [newId]: { title: "New Chat", messages: [] },
            }));
            setActiveSession(newId);
          }}
        />

        <div className="absolute top-4 right-6 z-40">
          {user && (
            <>
              <img
                src={user.photoURL || "/assets/default-avatar.png"}
                alt="Profile"
                className="w-10 h-10 rounded-full cursor-pointer"
                onClick={() => setShowProfile(!showProfile)}
              />
              {showProfile && (
                <div className="absolute right-0 mt-2 bg-white text-black rounded shadow p-4 w-70">
                  <p><strong>Name:</strong> {user.displayName || "N/A"}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <button
                    onClick={logout}
                    className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 cursor-pointer w-full"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <ChatArea
          messages={sessions[activeSession]?.messages || []}
          onSend={handleSend}
        />
      </div>

      {/* Auth Overlay */}
      {!user && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-opacity-60">
          <div className="p-6 rounded-lg bg-gray-900 shadow-lg">
            <GoogleLoginUI />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
