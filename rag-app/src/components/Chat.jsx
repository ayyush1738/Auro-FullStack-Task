import { useState, useEffect, useRef } from "react";

const ChatArea = ({ messages, onSend }) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typingMessage, setTypingMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const chatEndRef = useRef(null);

  const isEmpty = messages.length === 0;

  const handleSend = async () => {
    if (!input.trim()) return;
  
    setTypingMessage("");
    const userInput = input.trim();
    setInput("");
    setLoading(true);
  
    try {
      const botResponse = await onSend(userInput);
  
      if (!botResponse) {
        setErrorMessage("⚠️ Server is currently unavailable.");
      } else {
        setErrorMessage(""); // ✅ clear old error
        setTypingMessage(botResponse);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setErrorMessage("⚠️ Server is currently unavailable.");
    }
  
    setLoading(false);
  };
  
  
  useEffect(() => {
    if (messages.length > 0) {
      setErrorMessage(""); // ✅ Clear error once there's at least one valid message
      setLoading(false);
    }
  }, [messages]);
  
  

  return (
    <div className="flex flex-col flex-1 items-center bg-gray-800 w-full px-4 py-6 ">
      <div className="flex-1 w-full max-w-3xl overflow-y-auto custom-scrollbar bg-gray-400 rounded-lg shadow-inner px-4 py-6">
        <div className="flex flex-col space-y-3">
          {isEmpty ? (
            <div className="text-center text-white py-10">
              Upload a PDF File and Ask me Anything!
              <div className="w-full flex justify-center mt-20 bg-transparent bg-opacity-50">
                <img src="/assets/auro-logo.png" alt="Auro Logo" className="w-96" />
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`px-4 py-2 rounded-lg shadow text-sm whitespace-pre-line max-w-[80%] ${
                  msg.type === "user"
                    ? "bg-indigo-700 shadow-lg shadow-indigo-800/50 text-white self-end"
                    : "bg-gray-100 shadow-lg shadow-gray-800/50 text-gray-900 self-start"
                }`}
              >
                {msg.text}
              </div>
            ))
          )}

          {errorMessage && (
            <div className="px-4 py-2 bg-gray-200 rounded-lg self-start max-w-[80%] text-sm shadow">
              {errorMessage}
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center w-full">
              <div className="w-6 h-6 border-4 border-t-4 border-indigo-500 rounded-full animate-spin" />
            </div>
          )}

          <div ref={chatEndRef}></div>
        </div>
      </div>

      <div className="flex w-full max-w-3xl mt-4">
        <input
          className="flex-1 border border-gray-300 text-white bg-gray-500 bg-opacity-50 rounded-l-md p-3 shadow focus:outline-none focus:ring focus:ring-indigo-300 inset-shadow-sm inset-shadow-black"
          placeholder="Ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && input.trim()) {
              handleSend();
            }
          }}
        />
        <button
          onClick={handleSend}
          className="bg-indigo-600 shadow-lg shadow-indigo-800/50 cursor-pointer hover:bg-indigo-700 text-white px-5 py-3 rounded-r-md "
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatArea;
