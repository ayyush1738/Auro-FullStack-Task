import { useState, useEffect } from "react";

const ChatArea = ({ messages, onSend }) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typingMessage, setTypingMessage] = useState("");

  const isEmpty = messages.length === 0;

  const simulateTyping = (text) => {
    let index = 0;
    setTypingMessage("");
    const intervalId = setInterval(() => {
      setTypingMessage((prev) => prev + text[index]);
      index += 1;
      if (index === text.length) {
        clearInterval(intervalId); // Stop when done
      }
    }, 100); // Adjust speed (100ms delay per character)
  };

  const handleSend = async () => {
    setLoading(true);
    await onSend(input); // assuming onSend is async
    simulateTyping(input); // Call typing effect for generated text
    setLoading(false);
    setInput(""); // Clear input field
  };

  return (
    <div className="flex flex-col flex-1 items-center p-4 w-full bg-orange-200 p-10">
  <div className="flex-1 overflow-y-auto w-full max-w-3xl">
    <div className="flex flex-col space-y-2 p-5">
      {isEmpty ? (
        <div className="flex items-center justify-center text-center text-gray-500 bg-gray-200 rounded-lg h-20">
          <section className="w-full">Upload your PDF documents and interact</section>
        </div>
      ) : (
        messages.map((msg, i) => (
          <div
            key={i}
            className={`p-2 rounded-md max-w-[80%] ${
              msg.type === 'user'
                ? 'bg-indigo-500 text-white self-end'
                : 'bg-gray-200 self-start'
            }`}
          >
            {msg.text}
          </div>
        ))
      )}
      {loading && (
        <div className="flex items-center justify-center w-full">
          <div className="w-8 h-8 border-4 border-t-4 border-indigo-500 border-solid rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  </div>
  <div className="flex w-full max-w-3xl p-4 mt-4">
    <input
      className="flex-1 border rounded-l-md p-2 shadow-inner"
      placeholder="Ask a question..."
      value={input}
      onChange={(e) => setInput(e.target.value)}
    />
    <button
      className="bg-indigo-500 shadow-lg text-white px-4 rounded-r-md"
      onClick={handleSend}
    >
      Send
    </button>
  </div>
</div>

  );
};

export default ChatArea;
